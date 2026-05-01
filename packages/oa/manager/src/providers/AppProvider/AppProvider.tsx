import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { ErrorBoundary, Loader } from '@statseeker/components';
import { theme } from '@statseeker/ui/theme';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { type ReactNode, Suspense } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { environment } from '~/config';
import { ReactQueryProvider } from '~/lib';

interface AppProviderProps {
   children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
   return (
      <Suspense fallback={<Loader />}>
         <ChakraProvider theme={extendTheme(theme)}>
            <ReactQueryProvider>
               <>
                  <ReactQueryDevtools />
                  <ErrorBoundary errorMessage="Something went wrong">
                     <Router basename={environment.baseRouteName}>
                        {children}
                     </Router>
                  </ErrorBoundary>
               </>
            </ReactQueryProvider>
         </ChakraProvider>
      </Suspense>
   );
};
