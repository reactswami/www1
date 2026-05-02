import { Select as ChakraSelect, type SelectProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

export const Select = forwardRef<HTMLSelectElement, SelectProps>((props, ref) => {
   return <ChakraSelect {...props} ref={ref} />;
});
