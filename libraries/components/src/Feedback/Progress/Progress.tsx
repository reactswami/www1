import { Progress as ChakraProgress, type ProgressProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

export const Progress = forwardRef<HTMLDivElement, ProgressProps>((props, ref) => {
   return <ChakraProgress colorScheme="blue" borderRadius="md" {...props} ref={ref} />;
});
