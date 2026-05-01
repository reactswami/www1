import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

/**
 * Set up the msw service worker for browsers environement
 */
export const worker = setupWorker(...handlers);
