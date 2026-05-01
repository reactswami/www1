import { Spacer as ChakraSpacer, type SpacerProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

export const Spacer = forwardRef<HTMLDivElement, SpacerProps>((props, ref) => {
   return <ChakraSpacer {...props} ref={ref} />;
});
