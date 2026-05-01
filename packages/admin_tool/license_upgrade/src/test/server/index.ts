import { initialiseDb } from './db';

/**
 * Initialise the mock server for both development and testing environments
 *
 * @returns {undefined}
 */
export const startMockServer = async () => {
   switch (process.env.NODE_ENV) {
      case 'development':
         await initaliseMockBrowser();
         break;
      case 'test':
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
