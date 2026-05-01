import { deleteUserSyncPolicies } from '@statseeker/api/internal_api/entities/user_sync';
import { useToast } from '@statseeker/hooks/useToast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { useCallback } from 'react';
import { userSyncPoliciesQuery, fetchUsersByPolicyIds } from '~/lib/ReactQuery/queryOptions';


export function useDeletePoliciesForm(ids: number[]) {
    const route = useRouter();
    const toast = useToast();
    const queryClient = useQueryClient();

    const { data: impactedUsers, isLoading: isImpactedUsersLoading } = useQuery({
        queryKey: ['impactedUsers', ids],
        queryFn: () => fetchUsersByPolicyIds(ids),
        enabled: ids.length > 0,
    });

    const deletePolicies = useMutation({
        mutationKey: ['deletePolicy'],
        mutationFn: async ({ ids }: { ids: number[] }) => {
            return await deleteUserSyncPolicies(ids);
        },
        onError: ({ message }) => {
            toast({
                title: 'Error',
                description: message,
                status: 'error',
            });
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['user_sync_policy'] });
            toast({
                status: 'success',
                title: 'Success',
                description: 'Policies updated successfully.',
            });
            route.navigate({
                to: '/directory/ad',
                replace: true,
                params: {},
                search: {}, // Clear query parameters
            });
        },
    });


    const submitCallback = useCallback((ids: number[]) => {
        deletePolicies.mutate({ ids });
    }, [deletePolicies]);

    return {
        impactedUsers,
        isImpactedUsersLoading,
        submitCallback,
        isLoading: deletePolicies.isPending,
    };
}
