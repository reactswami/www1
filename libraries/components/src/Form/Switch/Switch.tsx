import { Switch as ChakraSwitch, FormControl, FormLabel } from '@chakra-ui/react';
import { type ChangeEvent } from 'react';

interface SwitchProps {
   label?: string;
   isChecked?: boolean;
   onChange?: (e: ChangeEvent<HTMLInputElement>) => unknown;
   isDisabled?: boolean;
   name?: string;
   defaultChecked?: boolean;
}

export const Switch = (props: SwitchProps) => {
   return (
      <FormControl display="flex" flexDir="column">
         {props.label && <FormLabel htmlFor={props.name}>{props.label}</FormLabel>}
         <ChakraSwitch
            onChange={props.onChange}
            name={props.name}
            isChecked={props.isChecked}
            defaultChecked={props.defaultChecked}
            isDisabled={props.isDisabled}
         />
      </FormControl>
   );
};
