import {
   Input as ChakraInput,
   InputRightElement as ChakraInputRightElement,
   InputGroup
} from '@chakra-ui/react';
import { EyeNoneIcon, EyeOpenIcon } from '@radix-ui/react-icons';
import { getSpacing } from '@statseeker/ui/theme';
import React, { type FocusEventHandler, forwardRef, useState } from 'react';

import { type InputProps } from '../Input';

type PasswordElementProps = Pick<
   InputProps,
   | 'onChange'
   | 'size'
   | 'value'
   | 'isDisabled'
   | 'isShowDisabled'
   | 'placeholder'
   | 'defaultValue'
   | 'error'
   | 'label'
   | 'required'
   | 'type'
   | 'helpText'
   | 'flexGrow'
   | 'flexBasis'
   | 'tabIndex'
> & {
   id?: string;
   required?: boolean;
   hasLeftElement: boolean;
   hasLeftAddon: boolean;
   hasRightAddon: boolean;
   name?: string;
   onBlur?: FocusEventHandler;
};
export const PasswordElement = forwardRef(
   (props: PasswordElementProps, ref: React.ForwardedRef<HTMLInputElement>) => {
      const {
         placeholder,
         value,
         defaultValue,
         onChange,
         onBlur,
         name,
         id,
         size,
         hasLeftElement,
         required,
         hasLeftAddon,
         hasRightAddon,
         tabIndex,
      } = props;
      const [showInputValue, setShowInputValue] = useState(false);

      const handleClick = () => setShowInputValue(!showInputValue);

      return (
         <>
            <InputGroup size={size}>
               <ChakraInput
                  role="textbox"
                  type={showInputValue ? 'text' : 'password'}
                  size={size}
                  onChange={onChange}
                  placeholder={placeholder}
                  value={value}
                  defaultValue={defaultValue}
                  required={required}
                  ref={ref}
                  onBlur={onBlur}
                  name={name}
                  id={id}
                  paddingLeft={getSpacing(hasLeftElement ? 'lg' : 'sm')}
                  borderLeftRadius={hasLeftAddon ? '0' : undefined}
                  borderRightRadius={hasRightAddon ? '0' : undefined}
                  tabIndex={tabIndex}
                  pr="2.5rem"
               />
               <ChakraInputRightElement width={'2.5rem'}>
                  {showInputValue ? (
                     <EyeNoneIcon
                        onClick={handleClick}
                        aria-label={showInputValue ? 'Hide password' : 'Show password'}
                     />
                  ) : (
                     <EyeOpenIcon
                        onClick={handleClick}
                        aria-label={showInputValue ? 'Hide password' : 'Show password'}
                     />
                  )}
               </ChakraInputRightElement>
            </InputGroup>
         </>
      );
   }
);
