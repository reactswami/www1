/**
 * Contains the query options which combine the keys and functions
 */
import {
   getDiscover,
} from '@statseeker/api/internal_api/entities';
import { queryOptions } from '@tanstack/react-query';
import { discoverQueryKeys } from '../keys';

export const discoverQueryOptions = {
   currentDiscoverQueryOptions: ({
      refetchInterval = false,
   }: {
      refetchInterval?: number | false | undefined;
   }) =>
      queryOptions({
         queryKey: discoverQueryKeys.current,
         queryFn: () => getDiscover(),
         refetchInterval: refetchInterval,
         staleTime: 0, // we want to fetch a new copy of the data each time and not rely on the cache
         select: (data) => ({
            ...data.data[0],
         }),
      }),
};
