import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';

import App from './App';

/**
 * Bootstrap the application with the mockServer, if not in production
 */
async function bootstrapApp() {
   const root = ReactDOM.createRoot(
      document.getElementById('root') as HTMLElement
   );

   root.render(
      <StrictMode>
         <App />
      </StrictMode>
   );
}

bootstrapApp();
