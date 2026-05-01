/**
 * Contains the query keys for the queries to ensure they get unique cache entries
 * @see https://tanstack.com/query/v5/docs/framework/react/guides/query-keys
 */
import { type SearchOptions } from '@statseeker/api/internal_api/entities/search';

export const searchQueryKeys = {
   get: (params: SearchOptions) => {
      if (params?.options && params?.options?.categories) {
         const filters = params?.options?.categories;
         return ['search', params?.options.query, ...filters] as const;
      } else {
         return ['search', params?.options.query] as const;
      }
   },
};
