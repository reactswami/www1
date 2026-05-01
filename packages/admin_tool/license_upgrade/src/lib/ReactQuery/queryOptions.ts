/**
 * Contains the query options which combine the keys and functions
 */
import { keepPreviousData, queryOptions } from '@tanstack/react-query';
import { queryKeys } from './keys';
import { getLicense } from '~/api';

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
