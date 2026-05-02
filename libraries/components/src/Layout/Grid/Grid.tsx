import {
   Grid as ChakraGrid,
   GridItem as ChakraGridItem,
   type GridProps,
   type GridItemProps,
} from '@chakra-ui/react';
import { forwardRef } from 'react';

export const Grid = forwardRef<HTMLDivElement, GridProps>((props, ref) => {
   return <ChakraGrid {...props} ref={ref} />;
});

export const GridItem = forwardRef<HTMLDivElement, GridItemProps>((props, ref) => {
   return <ChakraGridItem {...props} ref={ref} />;
});
