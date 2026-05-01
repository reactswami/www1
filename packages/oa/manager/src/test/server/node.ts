import { setupServer } from 'msw/node';
import { handlers } from './handlers';

/**
 * Set up the msw service worker for node environement
 */
export const server = setupServer(...handlers);
