/**
 * Contains the query options which combine the keys and functions
 */
import { getDiscoverHostsCount } from '@statseeker/api/internal_api/entities';
import { queryOptions } from '@tanstack/react-query';
import { discoverHostsQueryKeys } from '../keys';

export const discoverHostsQueryOptions = {
   count: () =>
      queryOptions({
         queryKey: discoverHostsQueryKeys.count(),
         queryFn: () => getDiscoverHostsCount(),
      }),
};
