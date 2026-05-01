/**
 * Contains the query keys for the queries to ensure they get unique cache entries
 * @see https://tanstack.com/query/v4/docs/guides/query-keys
 */

export const queryKeys = {
   downloadLicense: ['downloadLicense'] as const,
   getLicense: ['getLicense'] as const,
   uploadLicense: ['uploadLicense'] as const,
   cancelUpgrade: ['cancelUpgrade'] as const,
};
