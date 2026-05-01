import {
   Box,
   Flex,
   FormControl,
   FormLabel,
   Input,
   InputGroup,
   InputLeftElement,
   InputRightElement,
   Tooltip,
   theme,
} from '@chakra-ui/react';
import { Cross1Icon, InfoCircledIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

type GlobalFilterInputProps = {
   label?: string;
   onChange: (text: string | undefined) => void;
   defaultValue?: string;
   width?: string;
};

export default function GlobalFilterInput({
   label = 'Global search',
   onChange,
   width = '50ch',
   ...props
}: GlobalFilterInputProps) {
   const [text, setText] = useState<string | undefined>(props.defaultValue);

   function handleOnTextChange({ text }: { text: string | undefined }) {
      onChange(text);
      setText(text);
   }

   return (
      <FormControl width={width} alignContent={'flex-end'}>
         <FormLabel>
            <Flex gap={'xs'} alignItems={'center'}>
               {label}
               <Tooltip placement="right" label="regular expression supported">
                  <Box position="relative">
                     <InfoCircledIcon />
                  </Box>
               </Tooltip>
            </Flex>
         </FormLabel>
         <InputGroup position={'relative'}>
            <InputLeftElement
               pointerEvents={'none'}
               children={<MagnifyingGlassIcon color={theme.colors.gray[800]} />}
               display={'flex'}
               justifyContent={'center'}
               alignItems={'center'}
            />
            <Input
               value={text}
               onChange={(e) => handleOnTextChange({ text: e.target.value })}
            ></Input>
            {text && text?.length > 0 ? (
               <InputRightElement
                  padding={1}
                  borderLeft={'1px'}
                  borderColor="gray.100"
                  transition={'100ms background ease-in'}
                  _hover={{
                     background: 'gray.25',
                  }}
                  children={
                     <Box cursor={'pointer'} role="button" aria-label="reset search">
                        <Cross1Icon color={theme.colors.gray[700]} />
                     </Box>
                  }
                  onClick={() => handleOnTextChange({ text: '' })}
               />
            ) : null}
         </InputGroup>
      </FormControl>
   );
}
