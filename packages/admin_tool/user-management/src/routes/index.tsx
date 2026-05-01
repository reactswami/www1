import { useDisclosure } from '@chakra-ui/react';
import { UserRoundCog, UserRoundShieldLock, UserDirectory, ListRestartIcon, Spinner } from '@statseeker/components';
import { Alert } from '@statseeker/components/Feedback/Alert';
import { AdminLayout } from '@statseeker/components/Layout/AdminLayout';
import { NavLayout } from '@statseeker/components/Layout/NavLayout';
import { NavCard, NavSection } from '@statseeker/components/Layout/NavLayout/components';
import { NavCardBuilder } from '@statseeker/components/Layout/NavLayout/components/NavCard/NavCardBuilder';
import { getProductName } from '@statseeker/utils/environment';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useCallback } from 'react';
import { UserSyncConfigureSchedule } from '~/components/UserSyncConfigureSchedule';
import { UserSyncExecutionModal } from '~/components/UserSyncExecutionModal';
import { useUserSyncConfigureSchedule } from '~/hooks/useUserSyncConfigureSchedule';
import { queryClient, userAuthenticationQuery } from '~/lib/ReactQuery';
import { userSyncTaskQuery, getCurrentUserSyncStatusQuery, userSyncAuthQuery } from '~/lib/ReactQuery/queryOptions';
import { UserAuthConfig } from '~/types/type';

export const Route = createFileRoute('/')({
    component: IndexRoute,
    loader: async () => {
        const [userAuthConfig, lastUserSyncStatus, userSyncAuth] = await Promise.all([
            queryClient.fetchQuery(userAuthenticationQuery),
            queryClient.fetchQuery(getCurrentUserSyncStatusQuery),
            queryClient.fetchQuery(userSyncAuthQuery),
        ]);
        return {
            userAuthConfig: userAuthConfig,
            lastUserSyncStatus: lastUserSyncStatus,
            hasUserSyncAuth: userSyncAuth.data.length > 0,
        };
    }
});


/**
 * Prepare the auth method tag to display on the 'User Authentication' card. The main purpose of
 * this function is to distinguish between LDAP and AD auth. Currently the 'AUTHMETHOD' field is
 * LDAP for both LDAP and AD auth, so we need to check for the presence of the 'LDAP_AD_DOMAIN'
 * field to determine if it is AD auth.
 * @param userAuthConfig user authentication configuration object
 * @returns string to display on the 'User Authentication' card
 */
function getAuthMethodTag(userAuthConfig: UserAuthConfig) {
    if (userAuthConfig.AUTHMETHOD === 'LDAP') {
        if (userAuthConfig.LDAP_AD_DOMAIN) {
            return 'Active Directory';
        }
        return 'LDAP';
    }
    return userAuthConfig.AUTHMETHOD;
};


function IndexRoute() {
    const { data: userSyncTaskResp } = useQuery(userSyncTaskQuery);
    const userSyncTask = userSyncTaskResp?.data?.[0];
    const navigate = Route.useNavigate();
    const { userAuthConfig, lastUserSyncStatus: initialLastUserSyncStatus, hasUserSyncAuth } = Route.useLoaderData();

    const { data: lastUserSyncStatus, isPending, isFetched } = useQuery(getCurrentUserSyncStatusQuery);
    const initialUserSyncInProgress = initialLastUserSyncStatus === 'In Progress';
    const userSyncInProgress = isFetched ? lastUserSyncStatus === 'In Progress' : initialUserSyncInProgress;
    const selectedAuthMethod = userAuthConfig?.AUTHMETHOD;

    const openAddEditUser = useCallback(() => (window.parent.parent.location.href = '#admin:Add / Edit Users'), []);
    const addEditUsersCard = new NavCardBuilder()
        .text('Add / Edit Users')
        .description('Create new users or modify existing user accounts.')
        .icon(<UserRoundCog size="xl" />)
        .className('edit-users')
        .cardAction(openAddEditUser)
        .addStandardButton(
            'Manage',
            openAddEditUser
        )
        .build();

    const openConsoleOptions = useCallback(() => (window.parent.parent.location.href = '#admin:Console Options'), []);
    const consoleOptionsCard = new NavCardBuilder()
        .text('Access Permissions')
        .description('Configure global and user access permissions.')
        .icon(<UserRoundCog size="xl" />)
        .className('console-options')
        .cardAction(openConsoleOptions)
        .addStandardButton(
            'Manage',
            openConsoleOptions
        )
        .build();

    const openUserAuthentication = useCallback(() => (window.parent.parent.location.href = '#admin:User Authentication'), []);
    const userAuthenticationCard = new NavCardBuilder()
        .text('User Authentication')
        .description('Configure how users authenticate access to ' + getProductName() + '.')
        .icon(<UserRoundShieldLock size="xl" />)
        .className('user-auth')
        .cardAction(openUserAuthentication)
        .addStandardButton(
            'Manage',
            openUserAuthentication
        )
        .status('active', getAuthMethodTag(userAuthConfig))
        .build();


    const { scheduleDisclosure, mutation, userSyncScheduleTask } = useUserSyncConfigureSchedule(userSyncTask);

    const task_status = userSyncTask?.enabled === 1 ? 'active' : 'disable';
    const task_status_text = userSyncTask?.enabled ? 'Sync Enabled' : 'Sync Disabled';
    const navigateCallback = useCallback((dryRun: boolean) => navigate({
        to: '/user_sync_execute',
        search: {
            dry_run: dryRun,
        },
    }), [navigate]);

    const executeDisclosure = useDisclosure();
    const hasAuth = getAuthMethodTag(userAuthConfig) === 'Active Directory' || hasUserSyncAuth;
    const canExecute = !isPending && !userSyncInProgress && hasAuth && selectedAuthMethod !== 'File';
    const canDryRun = !isPending && !userSyncInProgress && hasAuth;
    const adUserDirectoryCard = new NavCardBuilder()
        .text('Active Directory')
        .description('Manage Active Directory User Directories')
        .icon(<UserDirectory size={'xl'} />)
        .className('user-directory')
        .addLinkButton(
            'Manage',
            '/directory/ad'
        )
        .addDropdownButton([
            { buttonText: 'Run Now', link: () => { executeDisclosure.onOpen(); }, disabled: !canExecute },
            { buttonText: 'Dry Run', link: () => { navigateCallback(true); }, disabled: !canDryRun },
            { buttonText: 'Schedule', link: scheduleDisclosure.onOpen, disabled: false },
        ])
        .status(task_status, task_status_text)
        .build();

    const userDirectorySyncHistoryCard = new NavCardBuilder()
        .text('View Recent Synchronizations')
        .description('Browse synchronization history')
        .icon(<ListRestartIcon size="xl" />)
        .className('user-directory')
        .addLinkButton(
            'View',
            '/user_dir_sync_history'
        )
        .build();

    return (
        <>
            <AdminLayout title={'Manage Users'} subtitle="" height='max-content'>
                {userSyncInProgress && (
                    <Alert
                        variant='info'
                        title='User Synchronization in Progress'
                        description='A user synchronization task is currently running.'
                    />
                )}
                <NavLayout>
                    <NavSection name={'Users'} >
                        <NavCard {...addEditUsersCard} />
                        <NavCard {...consoleOptionsCard} />
                    </NavSection>
                    <NavSection name={'Authentication'} >
                        <NavCard {...userAuthenticationCard} />
                    </NavSection>
                    <NavSection name={'User Directories'} >
                        <UserSyncConfigureSchedule
                            scheduleDisclosure={scheduleDisclosure}
                            mutation={mutation}
                            userSyncScheduleTask={userSyncScheduleTask}
                        />
                        <UserSyncExecutionModal
                            isOpen={executeDisclosure.isOpen}
                            onClose={executeDisclosure.onClose}
                            onConfirm={() => navigateCallback(false)}
                        />
                        <NavCard {...adUserDirectoryCard} />
                        <NavCard {...userDirectorySyncHistoryCard} />
                    </NavSection>
                </NavLayout>
            </AdminLayout>
        </>
    );
}