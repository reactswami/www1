/**
 * Contains the query options which combine the keys and functions
 */
import { getDiscoveryConfig } from '@statseeker/api/internal_api/entities';
import { queryOptions } from '@tanstack/react-query';
import { discoverConfigQueryKeys } from '../keys';


export const discoverConfigQueryOptions = {
   get: () =>
      queryOptions({
         queryKey: discoverConfigQueryKeys.get,
         queryFn: () => getDiscoveryConfig(),
      }),
};
