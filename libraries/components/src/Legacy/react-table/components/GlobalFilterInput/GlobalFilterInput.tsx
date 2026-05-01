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
import { Cross1Icon, InfoCircledIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { theme } from '@statseeker/ui/theme';
import { type Table } from '@tanstack/react-table';
import { createContext, useContext } from 'react';

type ViewMode = 'sm' | 'md';

export interface MinContext<T> {
   table: Table<T>;
   isLoading: boolean;
   isSuccess: boolean;
   isError: boolean;
   globalFilter: string;
   setGlobalFilter: (arg: string) => void;
   viewMode: ViewMode;
   setViewMode: (arg: ViewMode) => void;
}

export interface Props<T> {
   context: MinContext<T>;
   width?: string;
}

/*
 *  A global search input that can placed at the top of the table.
 */
export const GlobalFilterInput = <T,>({ context, width = '50ch' }: Props<T>) => {
   const { isLoading, globalFilter, setGlobalFilter } = useContext(createContext(context));

   return (
      <FormControl width={width}>
         <FormLabel>
            <Flex gap="xs" alignItems={'center'}>
               Global search
               <Tooltip placement="right" label="regular expression supported">
                  <Box position="relative" bottom="2px">
                     <InfoCircledIcon />
                  </Box>
               </Tooltip>
            </Flex>
         </FormLabel>
         <Skeleton isLoaded={!isLoading}>
            <InputGroup>
               <InputLeftElement
                  pointerEvents={'none'}
                  children={<MagnifyingGlassIcon color={theme.colors.gray[800]} />}
               />
               <Input
                  onChange={(e) => setGlobalFilter(e.target.value as string)}
                  value={globalFilter}
                  _focusVisible={{ borderColor: 'primary.500' }}
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
                        <Box cursor={'pointer'} role="button" aria-label="reset search">
                           <Cross1Icon color={theme.colors.gray[700]} />
                        </Box>
                     }
                  />
               )}
            </InputGroup>
         </Skeleton>
      </FormControl>
   );
};
