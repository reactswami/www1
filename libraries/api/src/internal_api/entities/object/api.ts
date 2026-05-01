import { ApiGetRequest, api_describe } from '../../api-request';
import { type ApiObjectDataType } from './type';

/**
 * Fetches objects from the API
 * @param request - API request parameters excluding object_type
 * @returns {Promise<ApiObject[]>} Array of group objects
 * @example
 * const groups = await getAllObjects();
 */
export const getAllObjects = async () =>
   new ApiGetRequest<ApiObjectDataType>({
      object_type: 'object',
      fields: ['name', 'title', 'poller', 'inherits', 'inherited_by'],
      sort: ['title'],
   }).run_api_request();

/**
 * Gets API description for the 'object' object
 * @returns {Promise<ApiObject>} description
 * @example
 * const schema = await describeObject();
 * console.log(schema.properties);
 */
export const describeObject = async () => api_describe({ object_type: 'object' });
