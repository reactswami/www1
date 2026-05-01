import { ApiGetRequest, api_describe } from '../../api-request';
import { type ApiObject } from '../../types';
import { type User } from './index';

export const getUsers = async (request: Omit<ApiObject, 'object_type'>) =>
   new ApiGetRequest<User>({
      ...request,
      object_type: 'user',
   }).run_api_request();

export const describeUser = async () => api_describe({ object_type: 'user' });
