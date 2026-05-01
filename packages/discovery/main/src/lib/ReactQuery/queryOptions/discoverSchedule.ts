import { type ApiResponse } from '@statseeker/api/internal_api';
import {
   getDiscoverTask,
   type Task,
   type TaskFilter,
   getDiscoverTaskById,
   getDiscoverTasksFromHistory,
   type DiscoverHistoryTask,
   type DiscoverHistoryFilter,
   getDiscoverTasksFromHistoryById,
} from '@statseeker/api/internal_api/entities';
import { ROWS_PER_PAGE } from '@statseeker/components/Legacy/SSDataTable';
import { formatSortParam } from '@statseeker/utils/formatSortParam';
import { queryOptions, skipToken } from '@tanstack/react-query';
import { discoverHistoryTask, discoverTaskQueryKeys } from '../keys';

export const getDiscoverTaskQuery = (params: TaskFilter) => {

   params = {
      limit: params.limit === undefined ? ROWS_PER_PAGE : params.limit,
      offset: params.offset === undefined ? 0 : params.offset,
      sort: params.sort === undefined ? 'name' : formatSortParam(params.sort),
      dir: params.dir,
      enabled: params?.enabled !== undefined ? params?.enabled : undefined,
      text_filter: params?.text_filter !== undefined ? params?.text_filter : undefined,
      type: 'DiscoverSchedule',
      poller_status: params?.poller_status !== undefined ? params?.poller_status : undefined,
   };
   return queryOptions({
      queryKey: discoverTaskQueryKeys.get(params),
      queryFn: () => {
         return getDiscoverTask(params).then((result: ApiResponse<Task>) => {
            const data = result?.data;
            return {
               ...result,
               data,
            };
         });
      },
      throwOnError: false,
      staleTime: 0,
   });
};

export const getDiscoverScheduleByIdQuery = ({
   id,
   refetchInterval = false,
}: {
   id?: number;
   refetchInterval?: number | (() => number | false) | false | undefined;
}) =>
   queryOptions({
      queryKey: discoverTaskQueryKeys.id(id ?? 0),
      queryFn: () => {
         return getDiscoverTaskById(id ?? 0).then((result: ApiResponse<Task>) => {
            const data = result.data;
            return {
               ...result,
               data,
            };
         });
      },
      refetchInterval,
      enabled: !!id
   });

export const getDiscoverHistoryTasks = (params: DiscoverHistoryFilter) => {
   params = {
      limit: params.limit === undefined ? ROWS_PER_PAGE : params.limit,
      offset: params.offset === undefined ? 0 : params.offset,
      sort: params.sort === undefined ? 'finish' : formatSortParam(params.sort),
      discoverMode: params?.device ? ['Rewalk'] : params.discoverMode,
      status: params.status,
      task_name: params.task_name,
      task_type: params.task_type,
      user: params.user,
      dir: params.dir,
      text_filter: params?.text_filter ?? undefined,
      device: params?.device ?? undefined,
      task_enabled: params.task_enabled ?? undefined,
      poller_status: params.poller_status ?? undefined,
      poller_name: params?.poller_name ?? undefined,
   };

   return queryOptions({
      queryKey: [discoverHistoryTask.get(), params],
      queryFn: () => {
         return getDiscoverTasksFromHistory(params).then((result: ApiResponse<DiscoverHistoryTask>) => {
            const data = result.data;
            return {
               ...result,
               data,
            };
         });
      },
      refetchInterval: false,
   });
};

export const getDiscoverHistoryTasksByIdQuery = ({
   id,
   refetchInterval = false,
}: {
   id?: number;
   refetchInterval?: number | (() => number | false) | false | undefined;
}) =>
   queryOptions({
      queryKey: [discoverHistoryTask.get(), id ?? 0],
      queryFn: id ? () => {
         return getDiscoverTasksFromHistoryById(id).then((result: ApiResponse<DiscoverHistoryTask>) => {
            const data = result.data;
            return {
               ...result,
               data,
            };
         });
      } : skipToken,
      refetchInterval,
      enabled: !!id
   });