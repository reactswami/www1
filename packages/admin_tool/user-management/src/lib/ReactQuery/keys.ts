import { type UserSyncHistoryFilter } from "@statseeker/api/internal_api/entities/user_sync_history/type";

/**
 * Contains the query keys for the queries to ensure they get unique cache entries
 * @see https://tanstack.com/query/v4/docs/guides/query-keys
 */
export const queryKeys = {
    GET_USER_SYNC_POLICY_BY_ID: (id: number) => ['user_sync_policy', id],
    GET_USER_SYNC_POLICIES: ['user_sync_policy'],
    GET_USER_SYNC_TASK: ['user_sync_task'],
    GET_SELECTED_AUTH_METHOD: ['selected_auth_method'],
    GET_USER_AUTH_CONFIGURATION: ['user_auth_configuration'],
    GET_TIMEZONES: ['timezones'],
    GET_USER_SYNC_AUTH: ['user_sync_auth'],
    GET_USER_SYNC_HISTORY_BY_ID: (id: number) => ['user_sync_history', id],
    GET_USER_SYNC_HISTORY: (params: UserSyncHistoryFilter) => ['user_sync_history', params],
    GET_USERS: ['users'],
    GET_SYNCHRONIZED_USERS: ['synchronized_users'],
    GET_CURRENT_USER_SYNC_STATUS: ['current_user_sync_status'],
};
