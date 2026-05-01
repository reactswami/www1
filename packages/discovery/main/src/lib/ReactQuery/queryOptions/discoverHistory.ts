import { type ApiResponse } from '@statseeker/api/internal_api';
import {
   describeDiscoverHistory,
   getDiscoveryHistoryById,
   type DiscoverHistory,
   type DiscoverHistoryFilter,
   getDiscoverHistory,
} from '@statseeker/api/internal_api/entities';
import { ROWS_PER_PAGE } from '@statseeker/components/Legacy/SSDataTable';
import { formatDuration } from '@statseeker/utils/formatDuration';
import { formatSortParam } from '@statseeker/utils/formatSortParam';
import { queryOptions, skipToken } from '@tanstack/react-query';
import { discoverHistoryQueryKeys } from '../keys';

export const describeDiscoverHistoryQuery = () =>
   queryOptions({
      queryKey: discoverHistoryQueryKeys.describe(),
      queryFn: () => describeDiscoverHistory(),
   });

/**
 * getDiscoverHistoryByIdQuery
 * 
 * @id - optional id, if id is not provided then query function will be skipped using skipToken and the query will not enabled,
 *  skipToken is provided to substitute the query function as the id_filter in the api cannot take an optional id
 */
export const getDiscoverHistoryByIdQuery = ({
   id,
   refetchInterval = false,
   staleTime = Infinity
}: {
   id?: number;
   refetchInterval?: number | (() => number | false) | false | undefined;
   staleTime?: 0 | typeof Infinity;
}) =>
   queryOptions({
      queryKey: discoverHistoryQueryKeys.id(id ?? 0),
      queryFn: id ? () => {
         return getDiscoveryHistoryById(id).then((result: ApiResponse<DiscoverHistory & { credential_length: number }>) => {
            const data = result.data.map((history: DiscoverHistory & { credential_length: number }) => {
               return {
                  ...history,
                  duration: formatDuration(history.duration),
               };
            });

            return {
               ...result,
               data,
            };
         });
      } : skipToken,
      refetchInterval,
      enabled: !!id,
      staleTime,
      gcTime: staleTime
   });

export const getDiscoverHistoryQuery = (params: DiscoverHistoryFilter, refetchInterval?: number | (() => number | false) | false | undefined) => {
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
   };
   return queryOptions({
      queryKey: discoverHistoryQueryKeys.get(params),
      queryFn: () => {
         return getDiscoverHistory(params).then((result: ApiResponse<DiscoverHistory & { credential_length: number }>) => {
            const data = result.data.map((history: DiscoverHistory & { credential_length: number }) => {
               return {
                  ...history,
                  mode:
                     history.mode === 'Hosts' && history.credential_length === 0
                        ? 'Ping Only Discover'
                        : history.mode,
                  duration: formatDuration(history.duration),
               };
            });

            return {
               ...result,
               data,
            };
         });
      },
      staleTime: 0,
      refetchInterval: refetchInterval

   });
};
