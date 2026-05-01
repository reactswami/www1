import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { theme } from '@statseeker/ui/theme';
import { type PropsWithChildren } from 'react';

interface StatseekerThemeProviderProps {}

export const StatseekerThemeProvider = (props: PropsWithChildren<StatseekerThemeProviderProps>) => {
   return <ChakraProvider theme={extendTheme(theme)}>{props.children}</ChakraProvider>;
};
