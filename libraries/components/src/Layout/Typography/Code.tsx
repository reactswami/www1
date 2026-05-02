import { Code as ChakraCode, type CodeProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

export const Code = forwardRef<HTMLElement, CodeProps>((props, ref) => {
   return <ChakraCode {...props} ref={ref} />;
});
