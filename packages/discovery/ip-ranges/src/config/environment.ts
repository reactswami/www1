/**
 * Define your production environement variables
 * This file can be replaced during build by using the `fileReplacements` array.
 * When building for production, this file is replaced with `environment.prod.ts`.
 */

import { type Environment } from '~/types';

export const environment: Environment = {
   baseRouteName: import.meta.env.PROD ? '/cgi/admin_tool/' : '/'
};
