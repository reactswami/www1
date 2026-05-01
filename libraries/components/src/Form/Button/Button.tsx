import {
   Button as ChakraButton,
   type ButtonProps as ChakraButtonProps,
   IconButton,
} from '@chakra-ui/react';
import { forwardRef, type ReactElement } from 'react';

export const ButtonVariants = [
   'primary',
   'secondary',
   'tertiary',
   'danger',
   'danger-light',
   'warning',
   'warning-light',
   'link',
] as const;

type ButtonProps = Pick<
   ChakraButtonProps,
   | 'bg'
   | 'color'
   | 'borderRadius'
   | '_hover'
   | 'outline'
   | 'border'
   | 'fontSize'
   | 'padding'
   | 'fontWeight'
   | 'height'
   | 'onClick'
> & {
   variant: (typeof ButtonVariants)[number];

   isLoading?: boolean;
   isDisabled?: boolean;
   icon?: ReactElement;
   children?: string;
   'aria-label'?: string;
} & ChakraButtonProps;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
   const variant = props.variant
      ? ['primary', 'danger', 'warning'].includes(props.variant)
         ? 'solid'
         : ['secondary', 'danger-light', 'warning-light'].includes(props.variant)
            ? 'outline'
            : props.variant === 'tertiary'
               ? 'ghost'
               : props.variant === 'link'
                  ? 'link'
                  : 'solid'
      : 'solid';

   const colorScheme = props.variant
      ? ['danger', 'danger-light'].includes(props.variant)
         ? 'red'
         : ['warning', 'warning-light'].includes(props.variant)
            ? 'orange'
            : undefined
      : undefined;

   return props.children ? (
      <ChakraButton
         ref={ref}
         {...props}
         variant={variant}
         colorScheme={colorScheme}
         leftIcon={props.icon}
      >
         {props.children}
      </ChakraButton>
   ) : (
      <IconButton
         ref={ref}
         {...props}
         variant={variant}
         aria-label={props['aria-label'] ?? 'Icon Button'}
         icon={props.icon}
      />
   );
});
