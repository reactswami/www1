import { environment } from '../../config';
import { initialiseDb } from './db';

/**
 * Initialise the mock server for both development and testing environments
 *
 * @returns {undefined}
 */
export const startMockServer = async () => {
   switch (environment.env) {
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
 * Mock server for browser (i.e. development)
 */
const initaliseMockBrowser = async () => {
   await initialiseDb();
   await import('./browser').then((module) => module.worker.start());
};
