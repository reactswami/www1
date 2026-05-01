import { ApiGetRequest } from "../../api-request";
import { ApiObject } from "../../types";
import { Port } from "./type";

/**
 * Retrieves a list of ports from the API.
 *
 * @param request - API request object without the object_type property
 * @returns Promise that resolves to an array of Port objects
 *
 * @example
 * const ports = await getPorts({
 *   // API request parameters
 * });
 */
export const getPorts = async (request: Omit<ApiObject, 'object_type'>) =>
   new ApiGetRequest<Port>({
      ...request,
      object_type: 'port',
   }).run_api_request();