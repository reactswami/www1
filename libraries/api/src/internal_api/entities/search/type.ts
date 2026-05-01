/**
 * Search type definition 
 * @property {string} action - the link to open the action
 * @property {string} title - label of the action
 * @property {'_self' | '_blank'} target - mode in which the link to be opened in the browser, blank means open in new window.
 * @property {number} height - height of the report in the browser
 * @property {number} width - width of the report in the browser
 */
export type SearchAction = {
   action: string;
   title: string;
   target: '_self' | '_blank';
   height?: number;
   width?: number;
};

/**
 * Search type definition 
 * @property {string} name - name of the search item
 * @property {string} content - progress in percentage of the task
 * @property {string} category - category of the search, example: device, interface
 * @property {string} status - status of the search item
 * @property {Record<string, string>} metadata - metadata of the search item
 * @property {SearchAction[]} actions  - an array of actions
 */
export type Search = {
   name: string;
   content?: string;
   metadata?: Record<string, string | string[]>;
   actions: SearchAction[];
   status?: string;
   category: string;
};
/**
 * Search options definition 
 * @property {string} query - query word for the search
 * @property {number} limit- query limin
 */
type SearchOption = {
   query: string;
   limit?: number;
   categories?: string[];
};

/**
 * Search options definition 
 * @property {SearchOption} options - options for the search
 */
export type SearchOptions = {
   options: SearchOption;
};

/**
 * SEARCH_OBJECT_TYPE type definition
 * @property {string} object_type for the search api
 */
export const SEARCH_TYPE = Object.freeze({
   object_type: 'search',
});
