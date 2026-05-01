/**
 * Define your production environement variables
 */
import { type Environment } from '~/types';

const endpoints: Environment['endpoints'] = {
   entityOperations: '/scs-cgi/manage_scanbi',
};

export const environment: Environment = {
   production: true,
   env: 'test',
   endpoints: endpoints,
};
