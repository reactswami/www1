import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { type UserSyncExecuteOptions } from '@statseeker/api/internal_api/entities/user_sync';
import { Alert } from "@statseeker/components/Feedback/Alert";
import { AdminLayout } from '@statseeker/components/Layout/AdminLayout';
import { AdminPage } from "@statseeker/components/Layout/AdminPage";
import { AdminManageListPage } from '@statseeker/components/Legacy/AdminManageList';
import { createFileRoute } from '@tanstack/react-router';
import * as z from 'zod';
import { GlobalSettingsForm } from '~/components/GlobalSettingsForm';
import { useManagePolicyPageLogic } from '~/hooks/useManagePolicyPageLogic';
import { selectedAuthMethodQuery } from '~/lib';
import { userSyncAuthQuery, userSyncTaskQuery } from '~/lib/ReactQuery';
import { type PolicyConfig } from '~/types/type';
import { getDirectoryTitle } from '~/utils/utils';

const directorySchema = z.object({
    selectedIds: z.array(z.number()).optional(),
});


export const Route = createFileRoute('/directory/ad/__layout')({
    component: DirectoryAdLayout,
    validateSearch: (search) => directorySchema.parse(search),
    loader: async ({ context }) => {
        const [selectedAuthMethod, userSyncAuth, userSyncTask] = await Promise.all([
            context.queryClient.fetchQuery(selectedAuthMethodQuery),
            context.queryClient.fetchQuery(userSyncAuthQuery),
            context.queryClient.fetchQuery(userSyncTaskQuery),
        ]);

        return {
            selectedAuthMethod,
            userSyncAuth: userSyncAuth.data.length > 0 ? userSyncAuth.data[0] : undefined,
            userSyncTask: userSyncTask.data.length > 0 ? userSyncTask.data[0] : undefined,
        };
    },
});


export function DirectoryAdLayout() {
    const dirType = 'ad';

    const { userSyncAuth, selectedAuthMethod, userSyncTask } = Route.useLoaderData();
    const taskOptions: UserSyncExecuteOptions | undefined = userSyncTask?.commands?.[0]?.options as UserSyncExecuteOptions | undefined;
    const executeOptions = {
        dry_run: taskOptions?.dry_run,
        use_user_auth: taskOptions?.use_user_auth,
        username_attribute: taskOptions?.username_attribute,
        force: taskOptions?.force,
    };

    const {
        localPolicies,
        isSuccess,
        isLoading,
        updatePoliciesMutation,
        buttonDefs,
        datatableProps,
    } = useManagePolicyPageLogic(Route);

    return (
        <AdminLayout {...getDirectoryTitle(dirType)} height="100vh" backButtonLink='/'>
            {selectedAuthMethod === 'File' && (
                <Alert
                    mt={2}
                    mb={2}
                    variant='warning'
                    description='The User Synchronization feature requires an external authentication provider to be configured.'
                />
            )}
            <Tabs defaultIndex={localPolicies.length > 0 ? 1 : 0}>
                <TabList>
                    <Tab>Global Settings</Tab>
                    <Tab>Manage Policies</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel>
                        <GlobalSettingsForm
                            executeOptions={executeOptions}
                            initialUserSyncAuthConfig={userSyncAuth}
                            selectedAuthMethod={selectedAuthMethod}
                        />
                    </TabPanel>
                    <TabPanel>

                        <AdminPage
                            className='user-directory'
                            flex='1'
                            minHeight={0}
                            flexDirection='row'
                        >
                            <AdminManageListPage<PolicyConfig>
                                dataLabel='Policy'
                                routeId={Route.id}
                                toRoute='/directory/ad/'
                                buttonDefs={buttonDefs}
                                data={localPolicies}
                                dataTotal={localPolicies.length}
                                success={isSuccess}
                                datatableProps={datatableProps}
                                isLoading={updatePoliciesMutation.isPending || isLoading}
                                textSearchSupported={false}
                            />
                        </AdminPage>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </AdminLayout>
    );
}
