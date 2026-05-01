import { type updateUserSyncFields } from '@statseeker/api/internal_api/entities/user_sync/type';
import { type ColumnDef } from '@statseeker/components/Legacy/SSDataTable';
import { type UseMutateFunction } from '@tanstack/react-query';
import { useMemo, type Dispatch, type SetStateAction } from "react";
import { type PolicyConfig } from "~/types";


const userDirectoryColumns: ColumnDef[] = [
    {
        field: 'name',
        headerName: 'Name',
        canSort: false
    },
    {
        field: 'enabled',
        headerName: 'Enabled',
        canSort: false,
        flex: 0.1,
        minWidth: 90,
        valueFormatter: (params: any) => params.value ? 'Yes' : 'No',
    },
];


export function usePolicyDatatableProps({
    setLocalPolicies,
    updatePoliciesMutation
}: {
    setLocalPolicies: Dispatch<SetStateAction<PolicyConfig[]>>;
    updatePoliciesMutation: {
        mutate: UseMutateFunction<any, unknown, updateUserSyncFields[], unknown>;
    };
}) {
    return useMemo(() => ({
        columns: userDirectoryColumns,
        rowDrag: true,
        onRowDrag: (newPolicies: PolicyConfig[]) => {
            const rows = newPolicies.map((policy, index) => ({
                ...policy,
                priority: index+1
            }));
            setLocalPolicies(rows.sort((a, b) => a.priority - b.priority));
            updatePoliciesMutation.mutate(rows);
        },
        loadingMessage: null,
        rowClassRules: {
            'disabled': ((params: any) => !params.data?.enabled)
        },
    }), [updatePoliciesMutation, setLocalPolicies]);
}
