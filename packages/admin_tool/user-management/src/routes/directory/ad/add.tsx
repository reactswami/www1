import { type Timezone } from '@statseeker/api/internal_api/entities/timezone/type';
import { AdminManageListContent } from '@statseeker/components/Legacy/AdminManageList';
import { createFileRoute } from '@tanstack/react-router';
import { PolicyForm } from '~/components/PolicyForm';
import { selectedAuthMethodQuery, timezonesQuery } from '~/lib';

export const Route = createFileRoute('/directory/ad/add')({
    loader: async ({ context }: { context: any }): Promise<{
        selectedAuthMethod: string | undefined;
        timezones: Timezone[];
    }> => {
        const [selectedAuthMethod, timezones] = await Promise.all([
            context.queryClient.ensureQueryData(selectedAuthMethodQuery),
            context.queryClient.ensureQueryData(timezonesQuery),
        ]);

        return {
            selectedAuthMethod,
            timezones: timezones.data,
        };
    },
    component: AddPolicyRoute,
});

function AddPolicyRoute() {

    const { timezones, selectedAuthMethod } = Route.useLoaderData();

    const sys_tz = timezones?.find(tz => tz.enabled)?.name || 'UTC';
    const defaultPolicyFormConfig = () => ({
        id: 0,
        priority: 0, /* priority is assigned by the back-end, so this value will be ignored for adds */
        name: '',
        enabled: true,
        user_group_sync: {
            include_users: [],
            include_groups: [],
            exclude_users: [],
        },
        user_template: {
            tz: sys_tz,
            api: 'r',
            is_admin: 0,
            exportDateFormat: '%s',
            top_n: 200,
            auth_ttl: 1800,
            auth_refresh: 1800,
            reportRowSpacing: 'standard',
            groups: [],
        },
    });

    return (
        <AdminManageListContent title="Add Policy">
            <PolicyForm
                mode="add"
                initialPolicy={defaultPolicyFormConfig()}
                timezones={timezones}
                selectedAuthMethod={selectedAuthMethod ?? 'File'}
            />
        </AdminManageListContent>
    );
}
