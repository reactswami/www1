import { type Timezone } from '@statseeker/api/internal_api/entities/timezone/type';
import { type getUserSyncFields } from '@statseeker/api/internal_api/entities/user_sync/type';
import { AdminManageListContent } from '@statseeker/components/Legacy/AdminManageList';
import { createFileRoute } from '@tanstack/react-router';
import { useMemo } from 'react';
import { PolicyForm } from '~/components/PolicyForm';
import { userSyncPoliciesQuery, timezonesQuery, selectedAuthMethodQuery } from '~/lib/ReactQuery/queryOptions';

export const Route = createFileRoute('/directory/ad/copy/$id')({
    loader: async ({ params, context }: { params: { id: string }; context: any }): Promise<{
        selectedAuthMethod: string | undefined;
        timezones: Timezone[];
        policies: getUserSyncFields[];
        initialPolicy: getUserSyncFields | undefined;
    }> => {
        const id = Number(params.id);

        const [selectedAuthMethod, timezones, policies] = await Promise.all([
            context.queryClient.ensureQueryData(selectedAuthMethodQuery),
            context.queryClient.ensureQueryData(timezonesQuery),
            context.queryClient.fetchQuery(userSyncPoliciesQuery),
        ]);

        const initialPolicy = policies.data.find((policy: any) => policy.id === id);

        return {
            selectedAuthMethod,
            timezones: timezones.data,
            policies: policies.data,
            initialPolicy,
        };
    },
    component: EditPolicyRoute,
});

function EditPolicyRoute() {
    const { initialPolicy, policies, timezones, selectedAuthMethod } = Route.useLoaderData();

    /* Generate a new name for the copied policy */
    const copyName = useMemo(() => {
        if (!initialPolicy) return '';

        const copySuffix = ' Copy';
        let newName = initialPolicy.name + copySuffix;
        while (policies.some(policy => policy.name === newName)) {
            newName = newName + copySuffix;
        }
        return newName;
    }, [initialPolicy, policies]);

    if (!initialPolicy) {
        return <AdminManageListContent title="Edit Policy">Policy not found</AdminManageListContent>;
    }

    return (
        <AdminManageListContent title="Add Policy">
            <PolicyForm
                mode="add"
                initialPolicy={{
                    ...initialPolicy,
                    name: copyName,
                    user_group_sync: {
                        include_users: initialPolicy.include_users,
                        include_groups: initialPolicy.include_groups,
                        exclude_users: initialPolicy.exclude_users,
                    },
                }}
                timezones={timezones}
                selectedAuthMethod={selectedAuthMethod ?? 'File'}
            />
        </AdminManageListContent>
    );
}
