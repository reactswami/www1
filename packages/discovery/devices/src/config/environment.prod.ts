/**
 * Define your production environement variables
 */
import { type Environment } from '~/types';

export const environment: Environment = {
   production: true,
   env: 'production',
   baseRouteName: '/cgi/admin_tool/', // TODO - Add path to CGI
};
