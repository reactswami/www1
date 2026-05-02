import { Spinner as ChakraSpinner, type SpinnerProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

export const Spinner = forwardRef<HTMLDivElement, SpinnerProps>((props, ref) => {
   return <ChakraSpinner {...props} ref={ref} />;
});
