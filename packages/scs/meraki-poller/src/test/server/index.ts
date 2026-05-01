/**
 * Initialise the mock server for both development and testing environments
 *
 * @returns {undefined}
 */
export const startMockServer = async () => {
   switch (import.meta.env.MODE) {
      case "development":
         await initaliseMockBrowser();
         break;
      default:
         break;
   }
};

const initaliseMockBrowser = async () => {
   await import('./db').then((module) => module.initialiseDb());
   await import('./browser').then((module) => module.worker.start());
};
