import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { theme } from '@statseeker/ui/theme';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { type AxiosError } from 'axios';
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { environment } from './config';
import { queryClient, ReactQueryProvider } from './lib';
import { AppProvider } from './providers';
import { routeTree } from './routeTree.gen';

// Set up a Router instance
const router = createRouter({
   routeTree,
   defaultPreload: 'intent',
   context: {
      queryClient,
   },
   defaultPreloadStaleTime: 0,
});

declare module '@tanstack/react-query' {
   interface Register {
      defaultError: AxiosError;
   }
}

declare module '@tanstack/react-router' {
   interface Register {
      router: typeof router;
   }
}

/**
 * Bootstrap the application with the mockServer, if not in production
 */
async function bootstrapApp() {
   // @ts-ignore
   if (process.env.NODE_ENV === 'development') {
      import('./test/server').then(async (res) => await res.startMockServer());
   }

   const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

   root.render(
      <StrictMode>
         <AppProvider>
            <RouterProvider router={router} basepath={environment.baseRouteName} />
         </AppProvider>
      </StrictMode>
   );
}

bootstrapApp();
