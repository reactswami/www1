import { type getUserSyncFields } from '@statseeker/api/internal_api/entities/user_sync';
import { type DiffOp } from '@statseeker/api/internal_api/entities/user_sync_history/type';
import { type FilterGroup } from '@statseeker/components/FilterActions';
import { type ChangeEvent, useCallback, useMemo, useState } from 'react';
import { type SynchronizedUserRow } from '~/components/SynchronizedUserTable';

const DEFAULT_PAGE_SIZE = 10;

function newPolicyName(name: string | undefined, policyExists: boolean) {
    const newName = name ?? 'No matching policy';
    if (newName === 'No matching policy') {
        return newName;
    }
    return policyExists ? newName : `${newName} (Policy no longer exists)`;
}


function sortByStatus(a: SynchronizedUserRow, b: SynchronizedUserRow) {
    if (a.new) {
        /* a is new */
        return b.new ? 0 : -1;
    }
    else if (!a.new && a.diff.length > 0) {
        /* a is modified */
        if (b.new) {
            return 1;
        }
        else if (b.diff.length > 0) {
            return 0;
        }
        else {
            return -1;
        }
    }
    else {
        /* a is unchanged */
        return (!b.new && b.diff.length === 0) ? 0 : 1;
    }
};


function matchesSearchTerm(item: SynchronizedUserRow, searchTerm: string) {
    if (searchTerm === '') {
        return true;
    }
    try {
        const regex = new RegExp(searchTerm, 'i');
        return regex.test(item.name);
    } catch (e) {
        return true; /* if regex is invalid, ignore the search term and show all results */
    }
};

export default function useSynchronizedUserTable({
    policies,
    data,
    handlePageChange,
    offset,
    limit,
}: {
    policies: getUserSyncFields[] | null;
    data: SynchronizedUserRow[] | null;
    handlePageChange: (newOffset: number) => void;
    offset?: number;
    limit?: number;
}) {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState<('new' | 'modified' | 'unchanged')[]>([]);
    const [policyFilter, setPolicyFilter] = useState<number | undefined>(undefined);
    const [selectedRow, setSelectedRow] = useState<{ name: string; diff: DiffOp[] } | undefined>(undefined);

    const filteredData = useMemo(() => {
        if (data === null) {
            return [];
        }
        return data.filter((item) => {
            /* check filter conditions */
            if (policyFilter && item.policy_id !== policyFilter) {
                return false;
            }
            if (activeFilter.length > 0) {
                const isNew = item.new === true;
                const isModified = !isNew && item.diff.length > 0;
                const isUnchanged = !isNew && !isModified;

                if (!(activeFilter.includes('new') && isNew) &&
                    !(activeFilter.includes('modified') && isModified) &&
                    !(activeFilter.includes('unchanged') && isUnchanged)) {
                    return false;
                }
            }
            return matchesSearchTerm(item, searchTerm);
        }).sort(sortByStatus);
    }, [data, searchTerm, activeFilter, policyFilter]);

    const onPolicyFilterChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
        const policyId = e.target.value;
        if (policyId === '') {
            setPolicyFilter(undefined);
            handlePageChange(0);
            return;
        }
        setPolicyFilter(Number(policyId));
    }, [handlePageChange]);

    const pageLimit = limit || DEFAULT_PAGE_SIZE;
    const rowData = useMemo(() => {
        const localOffset = offset ?? 0;
        const rows = filteredData;
        return rows.slice(localOffset, localOffset + pageLimit);
    }, [filteredData, offset, pageLimit]);
    const rowDataTotal = filteredData.length;

    const filterGroups: FilterGroup[] = useMemo(() => [
        {
            id: 'status',
            title: 'Status',
            type: 'checkbox',
            value: activeFilter || '',
            options: [
                { label: 'Show new', value: 'new' },
                { label: 'Show modified', value: 'modified' },
                { label: 'Show unchanged', value: 'unchanged' },
            ],
        }
    ], [activeFilter]);

    const updatedPolicyName = useCallback((cell: { value: string; data: SynchronizedUserRow }) => {
        const policyExists = policies?.find(policy => policy.id === cell.data.policy_id);
        return newPolicyName(cell.value, policyExists !== undefined);
    }, [policies]);

    const prepareChanges = useCallback((row: SynchronizedUserRow) => {
        const policyExists = policies?.some(policy => policy.id === row.policy_id);
        let managed_by = newPolicyName(row.policy_name, policyExists !== undefined);

        const diff = row.diff.map((change: DiffOp) => {
            if (change.path === '/managed_by') {
                return {
                    ...change,
                    value: managed_by
                };
            }
            return change;
        });
        return { name: row.name, diff };
    }, [policies]);

    const handleSelectedRow = useCallback((row: SynchronizedUserRow[] | undefined) => {
        setSelectedRow(row && row.length > 0 ? prepareChanges(row[0]) : undefined);
    }, [prepareChanges]);

    return {
        data,
        setActiveFilter,
        filterGroups,
        setSearchTerm,
        activeFilter,
        policyFilter,
        onPolicyFilterChange,
        rowData,
        rowDataTotal,
        pageLimit,
        handleSelectedRow,
        selectedRow: selectedRow,
        policyName: updatedPolicyName
    };
}