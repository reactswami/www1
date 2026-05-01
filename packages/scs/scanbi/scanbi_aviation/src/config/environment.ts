/**
 * Define your production environement variables
 * This file can be replaced during build by using the `fileReplacements` array.
 * When building for production, this file is replaced with `environment.prod.ts`.
 */

import { endpoints as productionEndpoints } from './environment.prod';
import { type Environment } from '~/types';

const endpoints: Environment['endpoints'] = productionEndpoints;

export const environment: Environment = {
   production: true,
   env: 'staging',
   endpoints: endpoints,
   baseRouteName: import.meta.env.PROD ? '/scs-cgi/manage_scanbi' : '/'
};
