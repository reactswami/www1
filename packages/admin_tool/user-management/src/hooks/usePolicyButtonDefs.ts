import { type updateUserSyncFields } from '@statseeker/api/internal_api/entities/user_sync';
import { type UseMutateFunction } from '@tanstack/react-query';
import { useMemo, type Dispatch, type SetStateAction } from "react";
import { type PolicyConfig } from "~/types";


export function usePolicyButtonDefs({
    Route,
    toggleLabel,
    selectedIds,
    localPolicies,
    setLocalPolicies,
    updatePoliciesMutation
}: {
    Route: { id: string };
    toggleLabel: string;
    selectedIds: number[] | undefined;
    localPolicies: PolicyConfig[];
    setLocalPolicies: Dispatch<SetStateAction<PolicyConfig[]>>;
    updatePoliciesMutation: {
        mutate: UseMutateFunction<any, unknown, updateUserSyncFields[], unknown>;
    };
}) {
    return useMemo(() => [
        {
            text: 'Add',
            linkProps: {
                from: Route.id,
                to: '/directory/ad/add' as any,
                search: (prev: any) => ({ ...prev, selectedIds: undefined }),
            },
        },
        {
            text: toggleLabel,
            buttonProps: {
                className: 'Toggle',
                isDisabled: selectedIds === undefined || selectedIds?.length === 0,
                onClick: () => {
                    const newPolicies = localPolicies.map((policy: PolicyConfig) => {
                        if (!selectedIds?.includes(policy.id ?? -1)) return policy;
                        return { ...policy, enabled: toggleLabel === 'Enable' };
                    });
                    setLocalPolicies(newPolicies.sort((a, b) => a.priority - b.priority));
                    updatePoliciesMutation.mutate(newPolicies);
                },
            }
        },
        {
            text: 'Delete',
            linkProps: {
                from: Route.id,
                to: '/directory/ad/delete' as any,
                search: (prev: any) => ({ ...prev, id: selectedIds ?? [] }),
            },
            buttonProps: {
                isDisabled: (selectedIds === undefined || selectedIds?.length === 0),
            },
        },
        {
            text: 'Copy',
            linkProps: {
                from: Route.id,
                to: '/directory/ad/copy/$id' as any,
                search: (prev: any) => ({ ...prev, selectedIds: undefined }),
            },
            buttonProps: {
                isDisabled: (selectedIds === undefined || selectedIds?.length === 0 || selectedIds?.length > 1),
            },
        }
    ], [selectedIds, toggleLabel, localPolicies, updatePoliciesMutation, Route.id, setLocalPolicies]);
}

