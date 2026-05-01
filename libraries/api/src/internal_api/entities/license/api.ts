import { ApiGetRequest, api_add, api_describe, api_get } from '../../api-request';
import { type APILicense } from './type';

/**
 * Gets API description for the 'license' object
 * @returns {Promise<ApiResponse>} description
 * @example
 * const schema = await describeLicense();
 * console.log(schema.properties);
 */
export const describeLicense = async () => api_describe({ object_type: 'license' });

/**
 * Gets the current license information
 * @returns {Promise<ApiLicense>} The current installed license information
 */
export const getLicense = async () =>
   api_get(
      new ApiGetRequest<APILicense>({
         object_type: 'license',
         fields: [
            'id',
            'version',
            'server_id',
            'hardware_id',
            'tier',
            'licenced',
            'perpetual',
            'not_before',
            'not_after',
            'features',
         ],
      })
   );

/**
 * Adds/Tests a new license
 * @returns {Promise<ApiLicense>} The added license information
 */
export const addLicense = async ({
   server_id,
   key,
   test = false,
}: {
   server_id: string;
   key: string;
   test?: boolean;
}) =>
   api_add<APILicense, { server_id: string; key: string }>({
      object_type: 'license',
      rows: [{ server_id, key: key.trim() }],
      options: { test },
      context: 'License Management upload new license',
   });
