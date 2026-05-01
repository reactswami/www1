/**
 * Define your production environement variables
 * This file can be replaced during build by using the `fileReplacements` array.
 * When building for production, this file is replaced with `environment.prod.ts`.
 */

import { type Environment } from '~/types';

const endpoints: Environment['endpoints'] = {
   savePingPollingConfiguration: '/cgi/rps_device_manage',
};

export const environment: Environment = {
   production: true,
   env: 'development',
   endpoints,
};
