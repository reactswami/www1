import {
   type ApiConnection,
   type ApiTestConnectionResponse,
} from 'packages/scs/meraki-poller/src/types/api';
import { routes } from './routes';
import { axios } from '~/lib';

/*
 * Test and update the connection settings
 * If the connection test is successful, it updates the connection.
 * If you wish to only test the connection, then you shouldn't pass any argument.
 */
export const testConnection = (body?: ApiConnection) =>
   axios.post<ApiTestConnectionResponse>(routes.TEST_CONNECTION, {
      action: 'test',
      config: body,
   });
