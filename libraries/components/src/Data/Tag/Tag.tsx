import { Tag as ChakraTag, type TagProps as ChakraTagProps } from '@chakra-ui/react';

export const TagVariants = [
   'success',
   'warning',
   'danger',
   'gray',
   'blue',
   'purple',
   'cyan',
   'yellow',
   'pink',
] as const;

type TagProps = {
   size?: 'sm' | 'md' | 'lg';
   variant?: (typeof TagVariants)[number];
   title?: string;
   children: string;
} & ChakraTagProps;

import { forwardRef } from 'react';

export const Tag = forwardRef<HTMLSpanElement, TagProps>((props, ref) => {
   const colorScheme =
      props.variant == 'success'
         ? 'green'
         : props.variant == 'warning'
         ? 'orange'
         : props.variant == 'danger'
         ? 'red'
         : props.variant ?? 'gray';
   return (
      <ChakraTag
         ref={ref}
         size={props.size ?? 'sm'}
         colorScheme={colorScheme}
         title={props.title}
         textTransform={props.textTransform}
      >
         {props.children}
      </ChakraTag>
   );
});
