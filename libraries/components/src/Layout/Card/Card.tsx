import {
   Card as ChakraCard,
   CardHeader as ChakraCardHeader,
   CardBody as ChakraCardBody,
   CardFooter as ChakraCardFooter,
   type CardProps,
   type CardHeaderProps,
   type CardBodyProps,
   type CardFooterProps,
} from '@chakra-ui/react';
import { forwardRef } from 'react';

export const Card = forwardRef<HTMLDivElement, CardProps>((props, ref) => {
   return <ChakraCard {...props} ref={ref} />;
});

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>((props, ref) => {
   return <ChakraCardHeader {...props} ref={ref} />;
});

export const CardBody = forwardRef<HTMLDivElement, CardBodyProps>((props, ref) => {
   return <ChakraCardBody {...props} ref={ref} />;
});

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>((props, ref) => {
   return <ChakraCardFooter {...props} ref={ref} />;
});
