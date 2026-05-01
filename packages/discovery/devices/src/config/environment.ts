/**
 * Define your production environement variables
 * This file can be replaced during build by using the `fileReplacements` array.
 * When building for production, this file is replaced with `environment.prod.ts`.
 */

import { type Environment } from '~/types';


/*
 * By default, when in development mode, mocking is used for all API requests. If you prefer
 * to talk to a live system to get more realistic behaviour, then uncomment the proxy_requests
 * environment below and set the values to match your system.
 */

export const environment: Environment = {
   production: true,
   env: 'development',
   baseRouteName: import.meta.env.PROD ? '/cgi/admin_tool/' : '/',
   //proxy_requests: {
   //   proxy_server: 'http://ssbuild14-2-vm.statseeker.com:5000',
   //   host: 'https://10.2.xx.xx',
   //   user: 'my_user',
   //   password: 'my_password'
   //},
};
