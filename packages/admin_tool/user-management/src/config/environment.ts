/**
 * Define your production environement variables
 * This file can be replaced during build by using the `fileReplacements` array.
 * When building for production, this file is replaced with `environment.prod.ts`.
 */

import { type Environment } from '~/types';

export const environment: Environment = {
   production: import.meta.env.PROD,
   env: 'production',
   baseRouteName: import.meta.env.PROD ? '/cgi/admin_tool/' : '/',
   //proxy_requests: {
   //   proxy_server: 'http://ssbuild14-2-vm.statseeker.com:5000',
   //   host: 'https://10.2.xx.xx',
   //   user: 'my_user',
   //   password: 'my_password'
   //},
};
