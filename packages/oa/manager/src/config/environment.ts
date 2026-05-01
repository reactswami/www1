/**
 * Define your production environement variables
 * This file can be replaced during build by using the `fileReplacements` array.
 * When building for production, this file is replaced with `environment.prod.ts`.
 */

import { endpoints as testEndpoints } from './environment._test';
import { endpoints as productionEndpoints } from './environment.prod';
import { type Environment } from '~/types';

const endpoints: Environment['endpoints'] = import.meta.env.PROD ? productionEndpoints : testEndpoints;

export const environment: Environment = {
   production: true,
   env: 'development',
   endpoints
};
