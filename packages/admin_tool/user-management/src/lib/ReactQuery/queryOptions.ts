/**
 * Contains the query options which combine the keys and functions
 */
import { getTask } from "@statseeker/api/internal_api/entities/task/api";
import { getTimezones } from '@statseeker/api/internal_api/entities/timezone';
import { getUsers } from '@statseeker/api/internal_api/entities/user/api';
import { getUserSyncPolicies, getUserSyncPolicyById } from "@statseeker/api/internal_api/entities/user_sync";
import { getUserSyncAuth } from "@statseeker/api/internal_api/entities/user_sync_auth/api";
import { getUserSyncHistory, getUserSyncHistoryById } from "@statseeker/api/internal_api/entities/user_sync_history/api";
import { type UserSyncHistory, type UserSyncHistoryFilter } from "@statseeker/api/internal_api/entities/user_sync_history/type";
import { type ApiResponse } from '@statseeker/api/internal_api/types';
import { ROWS_PER_PAGE } from '@statseeker/components/Legacy/SSDataTable';
import { formatDuration } from '@statseeker/utils/formatDuration';
import { formatSortParam } from '@statseeker/utils/formatSortParam';
import { queryOptions, type QueryKey } from "@tanstack/react-query";
import { queryKeys } from "./keys";
import { type UserAuthConfig, type UserFilterType } from "~/types/type";


async function getUserAuthConfiguration(): Promise<UserAuthConfig> {
   const response = await fetch('/cgi/user_authentication?output_mode=json', {
      credentials: 'include',
   });

   if (!response.ok) {
      throw new Error('Failed to fetch auth config');
   }

   const data = await response.json();

   if (data.details?.AUTHMETHOD === undefined) {
      throw new Error('Failed to fetch auth config');
   }
   return data.details;
}


async function getSelectedAuthMethod(): Promise<string> {
   const details = await getUserAuthConfiguration();
   return details.AUTHMETHOD;
}


export const userSyncPoliciesQuery = queryOptions({
   queryKey: queryKeys.GET_USER_SYNC_POLICIES,
   queryFn: getUserSyncPolicies,
});

export const userSyncPolicyByIdQuery = (id: number) => queryOptions({
   queryKey: queryKeys.GET_USER_SYNC_POLICY_BY_ID(id),
   queryFn: () => getUserSyncPolicyById(id),
});

export const userSyncTaskQuery = queryOptions({
   queryKey: queryKeys.GET_USER_SYNC_TASK,
   queryFn: () => getTask({ type: 'UserSyncSchedule' }),
});

export const selectedAuthMethodQuery = queryOptions({
   queryKey: queryKeys.GET_SELECTED_AUTH_METHOD,
   queryFn: getSelectedAuthMethod,
   staleTime: 0, /* Always fetch this query. It is still modified in the legacy UI, so we can never invalidate it */
});

export const userAuthenticationQuery = queryOptions({
   queryKey: queryKeys.GET_USER_AUTH_CONFIGURATION,
   queryFn: getUserAuthConfiguration,
   staleTime: 0, /* Always fetch this query. It is still modified in the legacy UI, so we can never invalidate it */
});

export const timezonesQuery = queryOptions({
   queryKey: queryKeys.GET_TIMEZONES,
   queryFn: getTimezones,
});

export const userSyncAuthQuery = queryOptions({
   queryKey: queryKeys.GET_USER_SYNC_AUTH,
   queryFn: getUserSyncAuth,
});


export const getUserSyncHistoryByIdQuery = ({
   id,
   refetchInterval = false,
}: {
   id: number;
   refetchInterval?: number | (() => number | false) | false | undefined;
}) =>
   queryOptions({
      queryKey: queryKeys.GET_USER_SYNC_HISTORY_BY_ID(id),
      queryFn: () => {
         return getUserSyncHistoryById(id);
      },
      refetchInterval,
   });


/**
* The purpose of this function is to further filter down the row data based on the user value. We
* need to look into the details field which isn't easily achieved using JQ filtering via the API.
*/
const userFilter = (userSyncHistoryData: UserSyncHistory[], userFilterValue?: string) => {
   if (!userFilterValue) {
      return userSyncHistoryData;
   }

   return userSyncHistoryData.filter((history) => {
      if (!history.details) {
         return false;
      }
      const synchronizedUsers = history.details.flatMap((detail) => {
         return detail.synchronized_users.map((user) => ({ name: user.name, changed: user.diff.length > 0 }));
      });

      return synchronizedUsers.some((user) => user.name === userFilterValue && user.changed);
   });
};


export const getUserSyncHistoryQuery = (params: UserSyncHistoryFilter, userFilterValue?: string) => {
   params = {
      limit: params.limit === undefined ? ROWS_PER_PAGE : params.limit,
      offset: params.offset === undefined ? 0 : params.offset,
      sort: params.sort === undefined ? 'finish' : formatSortParam(params.sort),
      dry_run: params?.dry_run,
      force: params?.force,
      status: params.status,
      dir: params.dir,
      text_filter: params?.text_filter ?? undefined,
   };
   return queryOptions({
      queryKey: queryKeys.GET_USER_SYNC_HISTORY(params),
      queryFn: () => {
         return getUserSyncHistory(params).then((result: ApiResponse<UserSyncHistory>) => {
            // convert the duration to human-readable format
            const data = result.data.map((history: UserSyncHistory) => {
               return {
                  ...history,
                  duration: formatDuration(Number(history.duration)),
               };
            });

            // if the userFilterValue is provided, further filter the data based on the user changes
            const filteredData = userFilterValue ? userFilter(data, userFilterValue) : data;

            return {
               ...result,
               data: filteredData,
            };
         });
      },
      staleTime: 0,
   });
};


export const getCurrentUserSyncStatusQuery = queryOptions({
   queryKey: queryKeys.GET_CURRENT_USER_SYNC_STATUS,
   queryFn: () => {
      return getUserSyncHistory({ limit: 1, sort: 'start', dir: 'desc' }).then((result) => {
         return result.data.length > 0 ? result.data[0].status : undefined;
      });
   },
   refetchInterval: 5000, // Refetch every 5 seconds to keep the status updated
   staleTime: 0,
});


export const getUsersQuery = () => {
   return queryOptions({
      queryKey: queryKeys.GET_USERS,
      queryFn: () => getUsers({ fields: ['id', 'name'] }),
      staleTime: Infinity,
   });
};


export const getSynchronizedUsersQuery = () =>
   queryOptions<UserFilterType[], Error, UserFilterType[], QueryKey>({
      queryKey: queryKeys.GET_SYNCHRONIZED_USERS,
      queryFn: () => getUsers({
         fields: ['id', 'name', { key: 'managed_by', hide: true, filter: "GLOB 'process:user_sync*'" }],
         sort: ['name']
      }).then((res) => res.data.map((user) => ({ id: user.id, name: user.name ?? '' } as UserFilterType))),
      staleTime: Infinity,
   });


export async function fetchUsersByPolicyIds(ids: number[]) {
   const managedByFields: string[] = ids.map((id) => `'process:user_sync:${id}'`);
   const filter = '{managed_by} IN (' + managedByFields.join(',') + ')';
   const resp = await getUsers({ fields: ['id', 'name', 'managed_by'], filter });
   return resp.data;
}