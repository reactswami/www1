/**
 * Contains the query options which combine the keys and functions
 */
import { getNimOptions } from '@statseeker/api/internal_api/entities';
import { queryOptions } from '@tanstack/react-query';
import { nimOptionsQueryKeys } from '../keys';

export const nimOptionsQueryOptions = {
   get: () =>
      queryOptions({
         queryKey: nimOptionsQueryKeys.get,
         queryFn: () =>
            getNimOptions({
               request: {
                  fields: ['id', 'value'],
               },
            }),
         select: (data) => data.data,
      }),
};
