import { Box as ChakraBox, type BoxProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

export const Box = forwardRef<HTMLDivElement, BoxProps>((props, ref) => {
   return <ChakraBox {...props} ref={ref} />;
});
