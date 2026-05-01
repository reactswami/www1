import {
   Tooltip as ChakraTooltip,
   type TooltipProps as ChakraTooltipProps,
} from '@chakra-ui/react';
import { forwardRef } from 'react';

type TooltipProps = ChakraTooltipProps;

export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>((props, ref) => {
   return props.children ? (
      <ChakraTooltip ref={ref} textTransform={'capitalize'} borderRadius={'md'} {...props} >
         {props.children}
      </ChakraTooltip>
   ) : (
      <ChakraTooltip {...props}>test</ChakraTooltip>
   );
});
