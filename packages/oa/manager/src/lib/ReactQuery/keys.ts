/**
 * Contains the query keys for the queries
 * @see https://tanstack.com/query/v4/docs/guides/query-keys
 */
export const queryKeys = {
   all: ['oas'],
   oaDetail: (id: string) => ['Oa', id] as const,
   services: (id: string) => ['services', id],
   devicesPingedByOa: (oa: string) => ['devicesPinged', oa],
};
