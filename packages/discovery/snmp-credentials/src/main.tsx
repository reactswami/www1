import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { theme } from '@statseeker/ui/theme';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { environment } from './config';
import { ReactQueryProvider, queryClient } from './lib';
import { routeTree } from './routeTree.gen';

// Set up a Router instance
const router = createRouter({
   routeTree,
   defaultPreload: 'intent',
   context: {
      queryClient,
   },
   defaultPreloadStaleTime: 0
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
   // @ts-ignore
   if (import.meta.env.MODE === 'development') {
      import('./test/server').then(async (res) => await res.startMockServer());
   }
   const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

   root.render(
      <StrictMode>
         <ChakraProvider theme={extendTheme(theme)}>
            <ReactQueryProvider>
               <RouterProvider router={router} basepath={environment.baseRouteName} />
            </ReactQueryProvider>
         </ChakraProvider>
      </StrictMode>
   );
}

bootstrapApp();
