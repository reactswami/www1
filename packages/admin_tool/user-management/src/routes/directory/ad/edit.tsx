import { type Timezone } from '@statseeker/api/internal_api/entities/timezone/type';
import { type getUserSyncFields } from '@statseeker/api/internal_api/entities/user_sync/type';
import { AdminManageListContent } from '@statseeker/components/Legacy/AdminManageList';
import { createFileRoute } from '@tanstack/react-router';
import { PolicyForm } from '~/components/PolicyForm';
import { selectedAuthMethodQuery, timezonesQuery, userSyncPolicyByIdQuery } from '~/lib';

export const Route = createFileRoute('/directory/ad/edit/$id')({
    loader: async ({ params, context }: { params: { id: string }; context: any }): Promise<{
        selectedAuthMethod: string | undefined;
        timezones: Timezone[];
        initialPolicy: getUserSyncFields | undefined;
    }> => {
        const id = Number(params.id);

        const [selectedAuthMethod, timezones, policy] = await Promise.all([
            context.queryClient.ensureQueryData(selectedAuthMethodQuery),
            context.queryClient.ensureQueryData(timezonesQuery),
            context.queryClient.fetchQuery(userSyncPolicyByIdQuery(id)),
        ]);

        return {
            selectedAuthMethod,
            timezones: timezones.data,
            initialPolicy: policy.data[0],
        };
    },
    component: EditPolicyRoute,
});

function EditPolicyRoute() {
    const { timezones, selectedAuthMethod, initialPolicy } = Route.useLoaderData();

    if (!initialPolicy) {
        return <AdminManageListContent title="Edit Policy">Policy not found</AdminManageListContent>;
    }

    return (
        <AdminManageListContent title="Edit Policy">
            <PolicyForm
                mode="edit"
                initialPolicy={{
                    ...initialPolicy,
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