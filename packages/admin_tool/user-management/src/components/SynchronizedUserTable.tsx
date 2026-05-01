import { Box, Flex, FormControl, Select } from '@chakra-ui/react';
import { type DiffOp } from '@statseeker/api/internal_api/entities/user_sync_history';
import { Pagination, Tag } from '@statseeker/components';
import { FilterActions } from '@statseeker/components/FilterActions';
import { GlobalSearch } from '@statseeker/components/GlobalSearch';
import { FormLabel } from '@statseeker/components/Legacy/Input/Label/Label';
import { SSDataTable, type ColumnDef } from '@statseeker/components/Legacy/SSDataTable';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import UserSyncResultsActions from './UserSyncResultsActions';
import useSynchronizedUserTable from '~/hooks/useSynchronizedUserTable';
import { userSyncPoliciesQuery } from '~/lib/ReactQuery/queryOptions';


export type SynchronizedUserRow = {
    name: string;
    new: boolean;
    policy_name: string;
    policy_id: number;
    diff: DiffOp[];
};


export default function SynchronizedUserTable(props: {
    data: SynchronizedUserRow[] | null;
    handlePageChange: (newOffset: number) => void;
    offset?: number;
    limit?: number;
    handleLimitChange: (newLimit: number) => void;
}) {
    const { data: policies, isLoading } = useQuery(userSyncPoliciesQuery);

    const { handleLimitChange, handlePageChange, offset } = props;
    const {
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
        selectedRow,
        policyName
    } = useSynchronizedUserTable({ ...props, policies: policies ? policies.data : null });

    const columns: ColumnDef[] = useMemo(() => [
        {
            field: 'name',
            headerName: 'User Name',
            headerDescription: 'The name of the synchronized user account',
            showTooltip: true,
            canSort: false,
        },
        {
            field: 'new',
            headerName: 'Status',
            headerDescription: 'Indicates the status of the user account.',
            showTooltip: true,
            cellRenderer: (cell) => {
                const variant = cell.value === true ? 'success' : cell.data.diff.length > 0 ? 'blue' : 'gray';
                return (
                    <Box display={'flex'} alignItems={'center'} width={'100%'} height={'100%'}>
                        <Tag variant={variant} >
                            {cell.value === true ? 'New' : cell.data.diff.length > 0 ? 'Modified' : 'Unchanged'}
                        </Tag>
                    </Box>
                );
            },
            canSort: false,
            minWidth: 100,
            maxWidth: 100
        },
        {
            field: 'policy_name',
            headerName: 'Policy',
            headerDescription: 'The name of the policy that resulted in this user being synchronized',
            showTooltip: true,
            canSort: false,
            valueFormatter: policyName,
        }
    ], [policyName]);

    /* From all of the data rows. Prepare a unique list of all the policies */
    const selectData = useMemo(() => {
        if (!data || !policies?.data) return null;
        const seen = new Set<number>();
        return data
            /* only allow selecting policies that exist */
            .filter(synchronizedUser =>
                policies.data.findIndex(p => p.id === synchronizedUser.policy_id) !== -1
            )
            /* don't show duplicate policy values in the dropdown */
            .filter(user => {
                if (seen.has(user.policy_id)) return false;
                seen.add(user.policy_id);
                return true;
            })
            /* map to option elements */
            .map(policy => (
                <option key={policy.policy_id} value={policy.policy_id}>{policy.policy_name}</option>
            ));
    }, [data, policies]);

    return (
        <Box width="100%" display="flex" flexDirection="column" alignItems="left">
            <Flex alignItems='end' gap={3}>
                <GlobalSearch
                    onChange={(e) => { setSearchTerm(e.target.value); handlePageChange(0); }}
                    placeholder='Search Users'
                    label='Search Users'
                />
                <Box>
                    <FormControl>
                        <FormLabel label="Policy" whiteSpace="nowrap">
                            <Select
                                size={'md'}
                                minWidth={'100%'}
                                onChange={onPolicyFilterChange}
                                placeholder="Select..."
                                value={policyFilter}
                            >
                                {selectData}
                            </Select>
                        </FormLabel>
                    </FormControl>
                </Box>

                <Box display={'flex'} alignItems={'center'} gap={2} marginLeft={'auto'}>
                    <FilterActions
                        filterGroups={filterGroups}
                        onFilterChange={(_, optionValue) => {
                            setActiveFilter(optionValue as ('new' | 'modified' | 'unchanged')[]);
                            handlePageChange(0);
                        }}
                        onResetFilters={setActiveFilter.bind(null, [])}
                        appliedFiltersCount={activeFilter.length}
                    />
                    <UserSyncResultsActions result={selectedRow} />
                </Box>
            </Flex>
            <SSDataTable<SynchronizedUserRow>
                columns={columns}
                resizableCols={true}
                rowData={rowData}
                selectText={true}
                isLoading={data === null || isLoading}
                rowSelectMode="single"
                onChange={handleSelectedRow}
            />
            <Pagination
                limit={pageLimit}
                totalCount={rowDataTotal}
                onPageChange={handlePageChange}
                offset={offset}
                onLimitChange={handleLimitChange}
            />
        </Box>
    );
}