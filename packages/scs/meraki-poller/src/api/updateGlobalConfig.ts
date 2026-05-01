import { routes } from './routes';
import { axios } from '~/lib';
import { type APIGlobalSchema, type ApiGlobalConfig, type DeepPartial } from '~/types';

export type updateGlobalConfigReponse = ApiGlobalConfig;

export const updateGlobalConfig = (
   body: DeepPartial<APIGlobalSchema> & { new_ids?: string[] }
) => {
   return axios.post(routes.UPDATE_GLOBAL_CONFIG, {
      action: 'update',
      config: body,
   });
};
