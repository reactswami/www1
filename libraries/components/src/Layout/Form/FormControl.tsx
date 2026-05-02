import {
   FormControl as ChakraFormControl,
   FormLabel as ChakraFormLabel,
   FormErrorMessage as ChakraFormErrorMessage,
   type FormControlProps,
   type FormLabelProps,
   type FormErrorMessageProps,
} from '@chakra-ui/react';
import { forwardRef } from 'react';

export const FormControl = forwardRef<HTMLDivElement, FormControlProps>((props, ref) => {
   return <ChakraFormControl {...props} ref={ref} />;
});

export const FormLabel = forwardRef<HTMLLabelElement, FormLabelProps>((props, ref) => {
   return <ChakraFormLabel {...props} ref={ref} />;
});

export const FormErrorMessage = forwardRef<HTMLDivElement, FormErrorMessageProps>((props, ref) => {
   return <ChakraFormErrorMessage {...props} ref={ref} />;
});
