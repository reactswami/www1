import {
   Spinner as ChakraSpinner,
   type SpinnerProps as ChakraSpinnerProps,
} from '@chakra-ui/react';
import { forwardRef } from 'react';

interface SpinnerProps extends ChakraSpinnerProps {
   centered?: boolean;
}

export const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(({ centered, ...props }, ref) => {
   return centered ? (
      <ChakraSpinner
         {...props}
         ref={ref}
         position="absolute"
         top="50%"
         left="50%"
         transform="translate(-50%, -50%)"
      />
   ) : (
      <ChakraSpinner {...props} ref={ref} />
   );
});
