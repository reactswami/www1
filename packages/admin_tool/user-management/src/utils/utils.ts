import { type ApiResponse } from '@statseeker/api/internal_api';
import { addTask, updateTask , getTask} from '@statseeker/api/internal_api/entities/task/api';
import { type Task } from '@statseeker/api/internal_api/entities/task/type';
import { type UserSyncExecuteOptions } from '@statseeker/api/internal_api/entities/user_sync';
import { executeUserSync } from '@statseeker/api/internal_api/entities/user_sync/api';
import { type UserSyncExecuteResult } from '@statseeker/api/internal_api/entities/user_sync_history/type';
import { type QueryClient } from '@tanstack/react-query';
import { userSyncTaskQuery } from '~/lib/ReactQuery/queryOptions';
import { type DirType } from '~/types';

const dirTitleMap: Record<DirType, { title: string }> = {
    ad: { title: 'Active Directory User Directory' },
};


export function getDirectoryTitle(dirType: DirType) {
    return dirTitleMap[dirType];
}


export async function runUserSync(dry_run: boolean): Promise<ApiResponse<UserSyncExecuteResult>> {
    /* collect the existing command options that we need to preserve, such as use_user_auth, and force */
    const task_resp = await getTask({ type: 'UserSyncSchedule' });
    if (!task_resp.success) {
        throw new Error(task_resp.errmsg || 'Failed to fetch user sync task.');
    }

    const defaultCommandOptions: UserSyncExecuteOptions = {
        force: true,
        use_user_auth: true,
        username_attribute: 'sAMAccountName',
    };
    const fetchedTask: Task = task_resp.data[0];
    const commandOptions = fetchedTask?.commands && fetchedTask.commands.length > 0 ? fetchedTask.commands[0].options : defaultCommandOptions;

    return await executeUserSync({
        ...commandOptions,
        dry_run,
    });
};


export async function updateUserSyncSchedule({
    queryClient,
    enabled,
    time,
    updateOptions = {}
}: {
    queryClient: QueryClient;
    enabled?: number | undefined;
    time?: string | number | undefined;
    updateOptions?: UserSyncExecuteOptions;
}) {
    const task_resp = await queryClient.fetchQuery(userSyncTaskQuery);

    if (!task_resp.success) {
        throw new Error(task_resp.errmsg || 'Failed to fetch user sync task.');
    }

    const fetchedTask: Task = task_resp.data[0];
    const commandOptions = fetchedTask?.commands && fetchedTask.commands.length > 0 ? fetchedTask.commands[0].options : {};

    /* If the parameter was defined, use that. Otherwise, use the existing value or default */
    const enabled_val = enabled ?? fetchedTask?.enabled ?? 0;
    const time_val = time ?? fetchedTask?.time ?? '0 * * * *';

    const submitTask: Task = {
        id: fetchedTask?.id, /* can be undefined */
        name: 'Active Directory User Synchronization Schedule',
        type: 'UserSyncSchedule',
        /* Default to the start of every hour */
        time: time_val,
        /* Default to disabled if there was no task previously */
        enabled: enabled_val,
        commands: [{
            "command": "execute",
            "context": "user-sync-process",
            "object_type": "user_sync",
            "options": {
                /* hard-coded defaults */
                dry_run: false,
                force: true,
                use_user_auth: true,
                /* Preserve existing options */
                ...commandOptions,
                /* Override with any new options from the function parameters */
                ...updateOptions,
            },
        }]
    };

    const ret = submitTask.id ? await updateTask({ task: [submitTask] }) : await addTask({ task: submitTask });
    if (!ret.success) {
        throw new Error(ret.errmsg || 'Failed to update user sync schedule.');
    }
    return ret;
};
