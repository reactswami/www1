import { updateUserSyncPolicies } from '@statseeker/api/internal_api/entities/user_sync/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from "react";
import { usePolicyButtonDefs } from '~/hooks/usePolicyButtonDefs';
import { usePolicyDatatableProps } from '~/hooks/usePolicyDatatableProps';
import { userSyncPoliciesQuery } from '~/lib';
import { type PolicyConfig } from "~/types";

export function useManagePolicyPageLogic(Route: { id: string; useSearch: () => { selectedIds: number[] | undefined } }) {
    const { selectedIds } = Route.useSearch();

    const { data: policies, isLoading, isSuccess } = useQuery(userSyncPoliciesQuery);
    const [localPolicies, setLocalPolicies] = useState(policies?.data.sort((a: PolicyConfig, b: PolicyConfig) => (a !== undefined && b !== undefined ? a.priority - b.priority : 0)) || []);

    useEffect(() => {
        if (JSON.stringify(localPolicies) !== JSON.stringify(policies?.data)) {
            setLocalPolicies(policies?.data.sort((a, b) => a.priority - b.priority) || []);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [policies]);

    const queryClient = useQueryClient();

    const updatePoliciesMutation = useMutation({
        mutationFn: updateUserSyncPolicies,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['user_sync_policy'] });
        }
    });

    const toggleLabel = useMemo<'Enable' | 'Disable'>(() => {
        const selectedPolicies = localPolicies.filter(policy => selectedIds?.includes(policy.id ?? -1));
        return selectedPolicies.length > 0 && selectedPolicies.every(policy => policy.enabled)
            ? 'Disable'
            : 'Enable';
    }, [localPolicies, selectedIds]);

    const buttonDefs = usePolicyButtonDefs({
        Route,
        toggleLabel,
        selectedIds,
        localPolicies,
        setLocalPolicies,
        updatePoliciesMutation
    });

    const datatableProps = usePolicyDatatableProps({ setLocalPolicies, updatePoliciesMutation });

    return {
        localPolicies,
        setLocalPolicies,
        isSuccess,
        isLoading,
        updatePoliciesMutation,
        buttonDefs,
        datatableProps,
        toggleLabel,
    };
}