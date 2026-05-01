import { ApiGetRequest, api_describe, api_get } from '../../api-request';
import { type APIObjectCount } from './type';

/**
 * Fetches entity counts from the API
 * @param request - API request parameters excluding object_type
 * @returns {Promise<ApiResponse<APIObjectCount>>} Array of object count objects
 * @example
 * const counts = await getAllObjectCounts();
 */
export const getAllObjectCounts = async () =>
   api_get(
      new ApiGetRequest<APIObjectCount>({
         object_type: 'entity_count',
         fields: ['name', 'title', 'enabled', 'disabled', 'exceeded', 'total'],
      })
   );

/**
 * Gets API description for the 'license' object
 * @returns {Promise<ApiResponse>} description
 * @example
 * const schema = await describeEntityCount();
 * console.log(schema.properties);
 */
export const describeEntityCount = async () => api_describe({ object_type: 'entity_count' });
