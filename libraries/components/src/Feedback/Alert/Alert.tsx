import {
   Alert as ChakraAlert,
   AlertTitle,
   type AlertProps as ChakraAlertProps,
   AlertDescription,
   AlertIcon,
   Box,
} from '@chakra-ui/react';
import { forwardRef, type ReactElement } from 'react';

export const AlertVariants = ['info', 'success', 'warning', 'error'] as const;
export type AlertVariantType = (typeof AlertVariants)[number];

type AlertProps = (
   | {
        title?: string;
        description: string;
        variant: AlertVariantType;
        noIcon: boolean;
     }
   | {
        title?: string;
        description: string;
        variant: AlertVariantType;
        customIcon?: ReactElement;
     }
) &
   Omit<ChakraAlertProps, 'status'>;

export const Alert = forwardRef<HTMLDivElement, AlertProps>((props, ref) => {
   return (
      <ChakraAlert status={props.variant} marginBottom={'10px'} ref={ref}>
         {'noIcon' in props && props.noIcon ? null : 'customIcon' in props && props.customIcon ? (
            <Box as={props.customIcon.type} marginInlineEnd={3} {...props.customIcon.props} />
         ) : (
            <AlertIcon />
         )}
         {props.title && <AlertTitle>{props.title}</AlertTitle>}
         <AlertDescription>{props.description}</AlertDescription>
      </ChakraAlert>
   );
});
