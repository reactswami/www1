import { StatseekerThemeProvider } from '@statseeker/components/Theme/StatseekerThemeProvider';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { routeTree } from './routeTree.gen';
import { environment } from '~/config';
import { ReactQueryProvider, queryClient } from '~/lib';

// Set up a Router instance
const router = createRouter({
   routeTree,
   defaultPreload: 'intent',
   context: {
      queryClient,
   },
   defaultPreloadStaleTime: 0,
});

declare module '@tanstack/react-router' {
   interface Register {
      router: typeof router;
   }
}

/**
 * Bootstrap the application with the mockServer, if not in production
 */
async function bootstrapApp() {
   if (process.env.NODE_ENV === 'development') {
      import('./test/server').then(async (res) => await res.startMockServer());
   }
   const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

   root.render(
      <StrictMode>
         <StatseekerThemeProvider>
            <ReactQueryProvider>
               <RouterProvider router={router} basepath={environment.baseRouteName} />
            </ReactQueryProvider>
         </StatseekerThemeProvider>
      </StrictMode>
   );
}

bootstrapApp();
