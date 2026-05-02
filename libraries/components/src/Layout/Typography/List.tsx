import {
   UnorderedList as ChakraUnorderedList,
   OrderedList as ChakraOrderedList,
   ListItem as ChakraListItem,
   type ListProps,
   type ListItemProps,
} from '@chakra-ui/react';
import { forwardRef } from 'react';

export const UnorderedList = forwardRef<HTMLUListElement, ListProps>((props, ref) => {
   return <ChakraUnorderedList {...props} ref={ref} />;
});

export const OrderedList = forwardRef<HTMLOListElement, ListProps>((props, ref) => {
   return <ChakraOrderedList {...props} ref={ref} />;
});

export const ListItem = forwardRef<HTMLLIElement, ListItemProps>((props, ref) => {
   return <ChakraListItem {...props} ref={ref} />;
});
