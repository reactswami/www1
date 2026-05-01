import { Box, ChakraProvider, extendTheme } from '@chakra-ui/react';
import { theme } from '@statseeker/ui/theme';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { type ReactNode, Suspense } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ErrorBoundary } from '~/components/ErrorBoundary';
import { Loader } from '~/components/Loader';
import { environment } from '~/config';
import { ReactQueryProvider } from '~/lib/ReactQuery';

interface AppProviderProps {
   children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
   return (
      <Suspense fallback={<Loader />}>
         <ChakraProvider theme={extendTheme(theme)}>
            <ReactQueryProvider>
               <ReactQueryDevtools />
               <Router basename={environment.baseRouterName}>
                  <Box
                     background={theme.colors.background[500]}
                     minWidth={'fit-content'}
                  >
                     <ErrorBoundary>{children}</ErrorBoundary>
                  </Box>
               </Router>
            </ReactQueryProvider>
         </ChakraProvider>
      </Suspense>
   );
};
