import {
   InputGroup as ChakraInputGroup,
   FormErrorMessage,
   FormHelperText,
   InputLeftAddon,
   InputLeftElement,
   InputRightAddon,
   InputRightElement,
   FormControl,
   type FlexboxProps,
} from '@chakra-ui/react';
import React, { type FocusEventHandler, type ReactElement, forwardRef } from 'react';

import { InputElement } from './Input/InputElement';
import { FormLabel } from './Label/Label';
import { PasswordElement } from './Password/PasswordInput';

export interface InputProps {
   placeholder?: string;
   defaultValue?: string;
   value?: string;
   onChange?: (e: React.ChangeEvent<HTMLInputElement>) => unknown;
   type?: 'password' | 'text' | 'number';
   label?: string;
   error?: string;
   helpText?: string;
   isRequired?: boolean;
   size?: 'lg' | 'sm' | 'md';
   isDisabled?: boolean;
   isShowDisabled?: boolean;
   leftAddon?: ReactElement;
   rightAddon?: ReactElement;
   leftElement?: ReactElement;
   rightElement?: ReactElement;
   onBlur?: FocusEventHandler;
   name?: string;
   id?: string;
   required?: boolean;
   flexGrow?: FlexboxProps['flexGrow'];
   flexBasis?: FlexboxProps['flexBasis'];
   tabIndex?: number;
   autoFocus?: boolean;
   paddingLeft?: string;
   maxLength?: number;
}

export const Input = forwardRef(
   (
      {
         id,
         placeholder,
         defaultValue,
         value,
         onChange,
         onBlur,
         name,
         type,
         label,
         error,
         helpText,
         isRequired,
         required,
         size = 'md',
         flexGrow,
         flexBasis,
         isDisabled,
         isShowDisabled,
         leftAddon,
         rightAddon,
         leftElement,
         rightElement,
         autoFocus,
         tabIndex,
         paddingLeft = 'var(--input-padding)',
         maxLength
      }: InputProps,
      ref?: React.ForwardedRef<HTMLInputElement>
   ) => {
      return (
         <FormControl
            isRequired={isRequired}
            flexGrow={flexGrow}
            flexBasis={flexBasis}
            isInvalid={!!error}
            isDisabled={isDisabled}
         >
            <FormLabel label={label} isRequired={isRequired} />
            <ChakraInputGroup>
               {leftAddon && <InputLeftAddon children={leftAddon} />}
               {leftElement && <InputLeftElement children={leftElement} />}

               {type === 'password' ? (
                  <PasswordElement
                     id={id}
                     ref={ref}
                     isDisabled={isDisabled}
                     isShowDisabled={isShowDisabled && !!value}
                     placeholder={placeholder}
                     defaultValue={defaultValue}
                     value={value}
                     name={name}
                     onBlur={onBlur}
                     onChange={onChange}
                     label={label}
                     error={error}
                     helpText={helpText}
                     size={size}
                     flexGrow={flexGrow}
                     flexBasis={flexBasis}
                     hasLeftElement={!!leftElement}
                     hasLeftAddon={!!leftAddon}
                     hasRightAddon={!!rightAddon}
                     required={isRequired || required}
                     tabIndex={tabIndex}
                  />
               ) : (
                  <InputElement
                     ref={ref}
                     isDisabled={isDisabled}
                     isShowDisabled={isShowDisabled && !!value}
                     placeholder={placeholder}
                     defaultValue={defaultValue}
                     value={value}
                     name={name}
                     onBlur={onBlur}
                     onChange={onChange}
                     type={type}
                     label={label}
                     error={error}
                     helpText={helpText}
                     required={isRequired}
                     size={size}
                     flexGrow={flexGrow}
                     flexBasis={flexBasis}
                     hasLeftElement={!!leftElement}
                     hasLeftAddon={!!leftAddon}
                     hasRightAddon={!!rightAddon}
                     autoFocus={autoFocus}
                     tabIndex={tabIndex}
                     paddingLeft={paddingLeft}
                     maxLength={maxLength}
                  />
               )}

               {rightAddon && <InputRightAddon children={rightAddon} />}
               {rightElement && <InputRightElement children={rightElement} />}
            </ChakraInputGroup>

            {helpText && <FormHelperText>{helpText}</FormHelperText>}
            {error && <FormErrorMessage>{error}</FormErrorMessage>}
         </FormControl>
      );
   }
);
