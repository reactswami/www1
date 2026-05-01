import { type AxiosResponse } from 'axios';
import { routes } from './routes';
import { axios } from '~/lib';
import { type APIGlobalSchema } from '~/types/api';

export const getGlobalConfig = () =>
   axios.get<APIGlobalSchema, AxiosResponse<APIGlobalSchema>>(
      routes.GET_GLOBAL_CONFIG
   );
