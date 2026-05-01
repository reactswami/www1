/**
 * @interface ApiFilter
 * @description The filter for search text, sort, and pagination for all the API's.
 */
export type ApiFilter = {
   /** The search text filter */
   text_filter?: string;
   /** The pagination filter offset */
   offset?: number;
   /**Pagination limit field */
   limit?: number;
   /**Sort field */
   sort?: string;
   /** Sort direction field */
   dir?: 'asc' | 'desc';
   /** The filter for the group id */
   group_id_filter?: number;
};
