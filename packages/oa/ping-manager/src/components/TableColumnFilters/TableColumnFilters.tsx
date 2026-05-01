import {
   Box,
   Button,
   Flex,
   Menu,
   MenuButton,
   MenuDivider,
   MenuIcon,
   MenuItem,
   MenuItemOption,
   MenuList,
   MenuOptionGroup,
   Skeleton,
   Tag,
} from '@chakra-ui/react';
import { Cross2Icon } from '@radix-ui/react-icons';
import { FilterIcon } from '@statseeker/ui/icons';
import { useQuery } from '@tanstack/react-query';
import { requests } from '~/api';
import { usePingTableContext } from '~/contexts';
import { queryKeys } from '~/lib/ReactQuery';

export const TableColumnFilters = () => {
   const { pollerFilter, setPollerFilter, exceededFilter, setExceededFilter, isInitialLoading } =
      usePingTableContext();
   let filtersAppliedCount = pollerFilter.length;
   if (exceededFilter) {
      filtersAppliedCount += 1;
   }
   const resetFilters = () => {
      setPollerFilter([]);
      setExceededFilter(false);
   };
   const { data } = useQuery({
      queryKey: queryKeys.oa,
      queryFn: requests.getOAsWithPingEnabled,
      select: (data) => data.data.filter(({ name }) => name), // The backend sometimes return corrupted data, we filter them out
   });
   const options = data ?? [];

   return (
      <Skeleton isLoaded={!isInitialLoading} alignSelf="center">
         <Menu closeOnSelect={false} preventOverflow>
            <MenuButton as={Button} variant="outline" leftIcon={<FilterIcon />}>
               <Flex alignItems={'center'} gap="sm">
                  Filters
                  {filtersAppliedCount > 0 && (
                     <Tag
                        size="sm"
                        fontSize={'xs'}
                        colorScheme="orange"
                        variant="subtle"
                        borderRadius={'full'}
                     >
                        {filtersAppliedCount}
                     </Tag>
                  )}
               </Flex>
            </MenuButton>
            <MenuList maxHeight="50vh" overflow="auto" position="relative" paddingY={0}>
               <MenuOptionGroup type={'checkbox'} title={'Pollers'} value={pollerFilter}>
                  {options.map(({ name }, idx) => (
                     <MenuItemOption
                        value={name}
                        key={idx}
                        onClick={() => {
                           const newCurrentFilter = pollerFilter.includes(name)
                              ? pollerFilter.filter((value) => value !== name)
                              : [...pollerFilter, name];

                           setPollerFilter(newCurrentFilter);
                        }}
                        borderColor={'gray.300'}
                        background={'white'}
                        transition={'100ms ease-out background'}
                        cursor="pointer"
                        _hover={{
                           background: 'blue.50',
                        }}
                        fontSize="sm"
                     >
                        {name}
                     </MenuItemOption>
                  ))}
               </MenuOptionGroup>

               <MenuDivider />

               <MenuOptionGroup
                  type={'checkbox'}
                  title={'Exceeded'}
                  value={exceededFilter ? 'true' : ''}
               >
                  <MenuItemOption
                     value={'true'}
                     key={0}
                     onClick={() => {
                        setExceededFilter(!exceededFilter);
                     }}
                     borderColor={'gray.300'}
                     background={'white'}
                     transition={'100ms ease-out background'}
                     cursor="pointer"
                     _hover={{
                        background: 'blue.50',
                     }}
                     fontSize="sm"
                  >
                     Only show exceeded devices
                  </MenuItemOption>
               </MenuOptionGroup>

               <Box position="sticky" bottom={-1} paddingBottom={1} zIndex={99} background="white">
                  <MenuDivider />

                  <MenuItem color="red.600" fontSize="sm" onClick={resetFilters}>
                     <MenuIcon marginRight={2}>
                        <Cross2Icon />
                     </MenuIcon>
                     Reset filters
                  </MenuItem>
               </Box>
            </MenuList>
         </Menu>
      </Skeleton>
   );
};
