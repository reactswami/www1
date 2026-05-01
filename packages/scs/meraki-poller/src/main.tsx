import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';

import App from './App';

async function bootstrapApp() {
   // @ts-ignore
   if (import.meta.env.MODE === 'development') {
      import('./test/server').then(async (res) => await res.startMockServer());
   }

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
