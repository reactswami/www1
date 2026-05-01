import 'regenerator-runtime';

import {
   Box,
   Flex,
   FormControl,
   FormLabel,
   Input,
   InputGroup,
   InputLeftElement,
   InputRightElement,
   Skeleton,
   Tooltip,
} from '@chakra-ui/react';
import {
   Cross1Icon,
   InfoCircledIcon,
   MagnifyingGlassIcon,
} from '@radix-ui/react-icons';

import { theme } from '@statseeker/ui/theme';
import { forwardRef } from 'react';

interface Props {
   globalFilter: string;
   setGlobalFilter: (arg: string) => void;
}

export const GlobalFilter = forwardRef<HTMLDivElement, Props>(
   ({ globalFilter, setGlobalFilter }, ref) => {
      return (
         <Flex ref={ref} flexGrow={1}>
            <FormControl style={{ width: `min(35vw, 50ch)` }}>
               <FormLabel>
                  <Flex gap="xs" alignItems={'center'}>
                     Global search
                     <Tooltip
                        placement="right"
                        label="regular expression supported"
                     >
                        <Box position="relative" bottom="2px">
                           <InfoCircledIcon />
                        </Box>
                     </Tooltip>
                  </Flex>
               </FormLabel>
               <Skeleton isLoaded={true}>
                  <InputGroup>
                     <InputLeftElement
                        pointerEvents={'none'}
                        children={
                           <MagnifyingGlassIcon
                              color={theme.colors.gray[800]}
                           />
                        }
                     />
                     <Input
                        onChange={(e) =>
                           setGlobalFilter(e.target.value as string)
                        }
                        value={globalFilter}
                     />
                     {globalFilter && (
                        <InputRightElement
                           padding={1}
                           borderLeft={'1px'}
                           borderColor="gray.100"
                           transition={'100ms background ease-in'}
                           _hover={{
                              background: 'gray.25',
                           }}
                           onClick={() => setGlobalFilter('')}
                           children={
                              <Box
                                 cursor={'pointer'}
                                 role="button"
                                 aria-label="reset search"
                              >
                                 <Cross1Icon color={theme.colors.gray[700]} />
                              </Box>
                           }
                        />
                     )}
                  </InputGroup>
               </Skeleton>
            </FormControl>
         </Flex>
      );
   }
);



