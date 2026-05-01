import { ApiGetRequest } from '../../api-request';
import { type ApiObject } from '../../types';
import { type NimOption } from './type';

export async function getNimOptions({ request }: { request: Omit<ApiObject, 'object_type'> }) {
   return new ApiGetRequest<NimOption>({
      ...request,
      object_type: 'nim_options',
   }).run_api_request();
}
