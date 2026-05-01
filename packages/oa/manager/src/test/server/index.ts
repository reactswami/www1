import { seedDb } from './db';

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
         await seedDb();
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
   await import('./browser').then((module) => module.worker.start());
};
