import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { ErrorBoundary } from '@statseeker/components';
import { theme } from '@statseeker/ui/theme';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { type ReactNode, Suspense } from 'react';
import { ReactQueryProvider } from '~/lib';

interface AppProviderProps {
   children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {

   const scanBI = {
      ...theme,
      colors: {
         ...theme.colors,
         // There was an issue when we first built ScanBI that it wasn't using our theme, just falling back to Chakra's defaults.
         // Because of that, we need to override some of our colours to match Chakra so that ScanBI looks the same.
         red: {
            ...theme.colors.red,
            600: '#C53030',
         },
         green: {
            ...theme.colors.green,
            600: '#38A169',
         },
         gray: {
            ...theme.colors.gray,
            600: '#4a5568',
            700: '#2D3748',
            800: '#1A202C',
         },
         primary: {
            // Note that we aren't defining shades other than 500 because it breaks visuals across the package.
            // We need to redefine how we use and theme colors to effectively use these.
            // 25:  'hsl(257, 88%, 98%)',
            // 50:  'hsl(257, 82%, 92%)',
            // 100: 'hsl(257, 58%, 55%)',
            // 200: 'hsl(256, 56%, 50%)',
            // 300: 'hsl(256, 55%, 46%)',
            // 400: 'hsl(256, 55%, 39%)',
            500: '#3F2683', // Brand Colour
            // 600: 'hsl(256, 55%, 30%)',
            // 700: 'hsl(256, 55%, 27%)',
            // 800: 'hsl(257, 58%, 12%)',
            // 900: 'hsl(259, 73%, 5%)',
         },
      },
   };

   return (
      <Suspense fallback={<div>Loading</div>}>
         <ChakraProvider theme={extendTheme(scanBI)}>
            <ReactQueryProvider>
               <>
                  <ReactQueryDevtools />
                  <ErrorBoundary errorMessage="Something went wrong">
                     {children}
                  </ErrorBoundary>
               </>
            </ReactQueryProvider>
         </ChakraProvider>
      </Suspense>
   );
};
