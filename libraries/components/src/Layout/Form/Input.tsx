import { Input as ChakraInput, type InputProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
   return <ChakraInput {...props} ref={ref} />;
});
