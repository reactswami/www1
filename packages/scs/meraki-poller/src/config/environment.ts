// This file can be replaced during build by using the `fileReplacements` array.
// When building for production, this file is replaced with `environment.prod.ts`.

import { type Environment } from '~/types';

export const environment: Environment = {
   production: true,
   routes: {
      TEST_CONNECTION: `/scs-cgi/meraki_manager`,
      GET_GLOBAL_CONFIG: `/scs-cgi/meraki_manager?action=get`,
      UPDATE_GLOBAL_CONFIG: `/scs-cgi/meraki_manager`,
   },
   baseRouterName: import.meta.env.MODE ==='production' ? '/scs-cgi/meraki_manager' : "/",
};
