import {
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
import {
   type ColumnFilter,
   type ColumnFiltersState,
   type Updater,
} from '@tanstack/react-table';

import { type ReactNode } from 'react';
import { FilterIcon } from '~/components/icons';

interface Props {
   columnFilters: ColumnFilter[];
   setColumnFilters: (arg: Updater<ColumnFiltersState>) => void;
   filters: {
      type: 'checkbox' | 'radio';
      title: string;
      id: string;
      options: { value: string; label: ReactNode | string }[];
   }[];
}

export const TableColumnFilters = ({
   filters,
   columnFilters,
   setColumnFilters,
}: Props) => {
   const filtersAppliedCount = columnFilters.reduce(
      (previous, { value }) => (previous += (value as string[]).length),
      0
   );
   const resetFilters = () =>
      setColumnFilters(filters.map(({ id }) => ({ id, value: [] })));

   return (
      <Skeleton isLoaded={true} alignSelf="center">
         <Menu closeOnSelect={false}>
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
            <MenuList>
               <>
                  {filters.map(({ options, title, type, id: filterId }) => {
                     const currentFilter = columnFilters.find(
                        ({ id }) => id === filterId
                     );
                     if (!currentFilter) {
                        throw new Error(
                           `Unable to find the column with id ${filterId} to filter`
                        );
                     }
                     return (
                        <>
                           <MenuOptionGroup
                              key={filterId}
                              type={type}
                              textTransform={'capitalize'}
                              title={title}
                              value={currentFilter.value as string[]}
                           >
                              {options.map(
                                 ({ value: filterValue, label }, idx) => (
                                    <MenuItemOption
                                       value={filterValue}
                                       key={idx}
                                       onClick={() => {
                                          const currentFilter =
                                             columnFilters.find(
                                                ({ id }) => id === filterId
                                             );
                                          if (!currentFilter) {
                                             throw new Error(
                                                `Unable to find the column with id ${filterId} to filter`
                                             );
                                          }

                                          const currentValues =
                                             currentFilter.value as string[];
                                          const newCurrentFilter =
                                             currentValues.includes(filterValue)
                                                ? currentValues.filter(
                                                     (value) =>
                                                        value !== filterValue
                                                  )
                                                : [
                                                     ...currentValues,
                                                     filterValue,
                                                  ];

                                          setColumnFilters([
                                             ...columnFilters.filter(
                                                ({ id }) => id !== filterId
                                             ), // Don't change the others columns
                                             {
                                                id: filterId,
                                                value: newCurrentFilter,
                                             },
                                          ]);
                                       }}
                                       borderColor={'gray.300'}
                                       background={'white'}
                                       transition={'100ms ease-out background'}
                                       cursor="pointer"
                                       _hover={{
                                          background: 'blue.50',
                                       }}
                                       textTransform={'capitalize'}
                                       fontSize="sm"
                                    >
                                       {label}
                                    </MenuItemOption>
                                 )
                              )}
                           </MenuOptionGroup>
                           <MenuDivider />
                        </>
                     );
                  })}
               </>

               <MenuItem color="red.600" fontSize="sm" onClick={resetFilters}>
                  <MenuIcon marginRight={2}>
                     <Cross2Icon />
                  </MenuIcon>
                  Reset filters
               </MenuItem>
            </MenuList>
         </Menu>
      </Skeleton>
   );
};
