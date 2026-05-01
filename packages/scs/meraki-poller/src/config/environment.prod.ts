import { type Environment } from '~/types';

export const environment: Environment = {
   production: true,
   routes: {
      TEST_CONNECTION: `/scs-cgi/meraki_manager`,
      GET_GLOBAL_CONFIG: `/scs-cgi/meraki_manager?action=get`,
      UPDATE_GLOBAL_CONFIG: `/scs-cgi/meraki_manager`,
   },
   baseRouterName: '/scs-cgi/meraki_manager',
};
