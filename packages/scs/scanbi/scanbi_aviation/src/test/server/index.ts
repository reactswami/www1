import { initialiseDb } from './db';
import { environment } from '~/config';

/**
 * Initialise the mock server for both development and testing environments
 *
 * @returns {undefined}
 */
export const startMockServer = async () => {
   switch (import.meta.env.MODE) {
      case 'development':
      case 'test':
         await initaliseMockBrowser();
         break;
      case 'production':
      default:
         break;
   }
};

/**
 * Mock server for browser (i.e. staging)
 */
const initaliseMockBrowser = async () => {
   await initialiseDb();
   await import('./browser').then((module) => module.worker.start());
};
