/**
 * Contains the query options which combine the keys and functions
 */
import { getLicense } from '@statseeker/api/internal_api/entities/license/api';
import { keepPreviousData, queryOptions } from '@tanstack/react-query';
import { queryKeys } from './keys';

export const licenseQueryOptions = {
   get: () => {
      return queryOptions({
         queryKey: queryKeys.getLicense,
         queryFn: () => getLicense(),
         placeholderData: keepPreviousData,
         staleTime: 60000,
      });
   },
};
