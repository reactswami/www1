import {
   Alert as ChakraAlert,
   AlertIcon as ChakraAlertIcon,
   AlertTitle as ChakraAlertTitle,
   AlertDescription as ChakraAlertDescription,
   type AlertProps,
   type AlertIconProps,
   type AlertTitleProps,
   type AlertDescriptionProps,
} from '@chakra-ui/react';
import { forwardRef } from 'react';

export const Alert = forwardRef<HTMLDivElement, AlertProps>((props, ref) => {
   return <ChakraAlert {...props} ref={ref} />;
});

export const AlertIcon = (props: AlertIconProps) => <ChakraAlertIcon {...props} />;

export const AlertTitle = forwardRef<HTMLDivElement, AlertTitleProps>((props, ref) => {
   return <ChakraAlertTitle {...props} ref={ref} />;
});

export const AlertDescription = forwardRef<HTMLDivElement, AlertDescriptionProps>((props, ref) => {
   return <ChakraAlertDescription {...props} ref={ref} />;
});
