import { type ApiResponse } from '@statseeker/api/internal_api';
import { getTaskById, type Task } from '@statseeker/api/internal_api/entities';
import { queryOptions } from '@tanstack/react-query';

const discoverScheduleQueryKeys = {
   id: (id: number | undefined) => ['discover_schedule', id] as const,
};

export const getDiscoverScheduleByIdQuery = ({
   id,
   refetchInterval = false,
}: {
   id: number | undefined;
   refetchInterval?: number | (() => number | false) | false | undefined;
}) =>
   queryOptions({
      queryKey: discoverScheduleQueryKeys.id(id),
      queryFn: () => {
         if (!id) {
            return new Promise<ApiResponse<Task> | undefined>((res) => res(undefined));
         }
         return getTaskById(id).then((result: ApiResponse<Task> | undefined) => {
            const data = result?.data;
            return {
               ...result,
               data,
            };
         });
      },
      refetchInterval,
   });
