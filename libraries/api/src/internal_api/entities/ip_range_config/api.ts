import { ApiGetRequest } from '../../api-request';
import { type ApiObject } from '../../types';
import { type IpRangeConfig } from './type';

/**
 * Retrieves IP range configurations from the API
 * @param params - The parameters object
 * @param params.request - API request object without the object_type property
 * @returns Promise that resolves to an array of IP range configurations
 * @typeParam ReturnType - The type of the returned data, defaults to IpRangeConfig
 */
export async function getIpRangeConfigs<ReturnType = IpRangeConfig>({ request }: { request: Omit<ApiObject, 'object_type'> }) {
   return new ApiGetRequest<ReturnType>({
      ...request,
      object_type: 'ip_range_config',
   }).run_api_request();
}
