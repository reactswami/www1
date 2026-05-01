import { Input, forwardRef } from '@chakra-ui/react';
import { getSpacing } from '@statseeker/ui/theme';
import { type FocusEventHandler, type ForwardedRef } from 'react';

import { type InputProps } from '../Input';

type InputElementProps = Pick<
   InputProps,
   | 'isDisabled'
   | 'isShowDisabled'
   | 'placeholder'
   | 'defaultValue'
   | 'value'
   | 'onChange'
   | 'type'
   | 'label'
   | 'error'
   | 'helpText'
   | 'size'
   | 'flexGrow'
   | 'flexBasis'
   | 'tabIndex'
   | 'autoFocus'
   | 'paddingLeft'
   | 'maxLength'
> & {
   required?: boolean;
   hasLeftElement: boolean;
   hasLeftAddon: boolean;
   hasRightAddon: boolean;
   onBlur?: FocusEventHandler;
   name?: string;
};

export const InputElement = forwardRef(
   (props: InputElementProps, ref: ForwardedRef<HTMLInputElement>) => {
      const {
         placeholder,
         value,
         defaultValue,
         onChange,
         onBlur,
         name,
         type,
         size,
         hasLeftElement,
         hasLeftAddon,
         hasRightAddon,
         tabIndex,
         autoFocus,
         paddingLeft = 'var(--input-padding)',
         maxLength
      } = props;

      return (
         <Input
            ref={ref}
            placeholder={placeholder}
            value={value}
            defaultValue={defaultValue}
            onChange={onChange}
            onBlur={onBlur}
            id={name}
            name={name}
            type={type}
            size={size}
            autoFocus={autoFocus}
            paddingLeft={getSpacing(hasLeftElement ? 'lg' : 'sm')}
            borderLeftRadius={hasLeftAddon ? '0' : undefined}
            borderRightRadius={hasRightAddon ? '0' : undefined}
            tabIndex={tabIndex}
            style={{ paddingLeft: paddingLeft }}
            maxLength={maxLength}
         />
      );
   }
);
