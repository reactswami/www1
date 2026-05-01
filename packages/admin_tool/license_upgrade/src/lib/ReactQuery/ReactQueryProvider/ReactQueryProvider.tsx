import { NUMBER_OF_REQUEST_RETRIES } from '~/config/defaults';
import { environment } from '~/config/environment';
import { type DefaultOptions, QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { type ReactNode } from 'react';

const isTestMode = environment.env === 'test';

const queryConfig: DefaultOptions = {
   queries: {
      retry: isTestMode ? false : NUMBER_OF_REQUEST_RETRIES, // Turn off retries in test mode
      refetchOnWindowFocus: false,
      staleTime: Infinity, // Force use of cache unless we invalidate the query
   },
};
interface ReactQueryProviderProps {
   children: ReactNode;
}

export const queryClient = new QueryClient({
   defaultOptions: queryConfig,
});

export const ReactQueryProvider = ({ children }: ReactQueryProviderProps) => {
   return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
