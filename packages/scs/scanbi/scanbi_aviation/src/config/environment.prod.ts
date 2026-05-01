/**
 * Define your production environement variables
 */
import { type Environment } from '~/types';

export const endpoints: Environment['endpoints'] = {
   entityOperations: '/scs-cgi/manage_scanbi',
};

export const environment: Environment = {
   production: true,
   env: 'production',
   endpoints: endpoints,
   baseRouteName: import.meta.env.PROD ? '/scs-cgi/manage_scanbi' : '/'
};
