import { Text as ChakraText, type TextProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

export const Text = forwardRef<HTMLParagraphElement, TextProps>((props, ref) => {
   return <ChakraText {...props} ref={ref} />;
});
