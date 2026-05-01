/**
 * Define your production environement variables
 */
import { type Environment } from '~/types';

const endpoints: Environment['endpoints'] = {
   savePingPollingConfiguration: '/cgi/rps_device_manage',
};

export const environment: Environment = {
   production: true,
   env: 'test',
   endpoints,
};
