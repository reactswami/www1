import { Divider as ChakraDivider, type DividerProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

export const Divider = forwardRef<HTMLDivElement, DividerProps>((props, ref) => {
   return <ChakraDivider {...props} ref={ref} />;
});
