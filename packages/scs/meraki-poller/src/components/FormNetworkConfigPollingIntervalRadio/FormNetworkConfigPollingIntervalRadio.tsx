import { Flex, FormControl, FormLabel } from '@chakra-ui/react';
import { type UseFormSetValue } from 'react-hook-form';

export interface Props {
   value: number;
   label: string;
   isSelected: boolean;
   setValue: UseFormSetValue<any>;
}

export const FormNetworkConfigPollingIntervalRadio = ({
   value,
   label,
   isSelected,
   setValue,
}: Props) => {
   return (
      <FormControl
         borderRadius={4}
         transition={'all ease-in 100ms'}
         border={'1px'}
         maxWidth={'min(24rem, 100%)'}
         shadow={isSelected ? 'md' : 'none'}
         borderColor={isSelected ? 'gray.500' : 'gray.100'}
         _hover={{
            background: 'gray.100',
         }}
      >
         <Flex
            justifyContent="space-between"
            alignItems={'center'}
            paddingRight={4}
            cursor="pointer"
         >
            <FormLabel
               padding={4}
               flexGrow={1}
               htmlFor={label}
               cursor="pointer"
               marginBottom={0}
            >
               {label}
            </FormLabel>
            <input
               onChange={() => setValue('config_poll_interval', value)}
               id={label}
               checked={isSelected}
               type="radio"
               value={value}
            />
         </Flex>
      </FormControl>
   );
};
