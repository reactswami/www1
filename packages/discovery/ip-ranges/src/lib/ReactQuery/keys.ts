/**
 * Contains the query keys for the queries
 * @see https://tanstack.com/query/v4/docs/guides/query-keys
 */

import { type getRangesQueryParams } from '~/types/ipRange';

export const queryKeys = {
   RANGES: ['ip_range_config'] as const,
   GET_RANGES: (params?: getRangesQueryParams) =>
      [...queryKeys.RANGES, params] as const,
   GET_RANGE_BY_ID: (id: number) => [...queryKeys.RANGES, id] as const,
};
