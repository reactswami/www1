import { ApiGetRequest, api_describe } from '../../api-request';
import { type ApiObject } from '../../types';
import { type Group } from '../group';

/**
 * Fetches groups from the API
 * @param request - API request parameters excluding object_type
 * @returns {Promise<Group[]>} Array of group objects
 * @example
 * const groups = await getGroups({
 *   filter: 'name="MyGroup"',
 *   limit: 10
 * });
 */
export const getGroups = async (request: Omit<ApiObject, 'object_type'>) =>
   new ApiGetRequest<Group>({
      ...request,
      object_type: 'group',
   }).run_api_request();

/**
 * Gets API schema for group objects
 * @returns {Promise<Object>} Group object schema
 * @example
 * const schema = await describeGroup();
 * console.log(schema.properties);
 */
export const describeGroup = async () => api_describe({ object_type: 'group' });
