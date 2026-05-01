import { Box, Flex, Th } from '@chakra-ui/react';
import { TriangleDownIcon, TriangleUpIcon } from '@radix-ui/react-icons';
import { type Header, flexRender } from '@tanstack/react-table';
import { type PingTableDeviceRow } from '~/components';

type Stringify<T extends {}> = Record<keyof T, string>;
type SortArg = [string, 'asc' | 'desc'];

export interface Props {
   header: Header<Stringify<PingTableDeviceRow>, unknown>;
   setSortBy: (arg: SortArg) => void;
   sortBy: SortArg;
   isCheckboxCell: boolean;
}

export const TableHeaderCell = ({
   setSortBy,
   sortBy,
   header,
}: Props) => {
   const toggleSort = () => {
      if(!header.getContext().column.getCanSort()){
            return;
      }
      const [currentSortHeader, currentSortDirection] = sortBy;
      // If the current sort is not this column, sort this column
      if(header.id !== currentSortHeader){
         setSortBy([header.id, 'asc']);
         return;
      }
      // The current column is already sorted: change the direction or remove the sorting (asc -> desc -> none)
      if(currentSortDirection === 'asc'){
         setSortBy([header.id, 'desc']);
         return;
      } else {
         setSortBy(['','asc']); // Not ideal, this is how we reset the sortby
         return;
      }
   };

   return (
      <Th
         key={header.id}
         onClick={toggleSort}
         cursor={header.column.getCanSort() ? 'pointer' : ''}
         _hover={{
            background: 'gray.50',
         }}
         paddingY={2}
         width={`${header.getSize()}px`}
      >
         <Flex alignItems={'center'} gap="sm">
            {flexRender(header.column.columnDef.header, header.getContext())}

            {header.column.getCanSort() ? (
               <Flex direction="column" justifyContent={'center'}>
                  <Box
                     color={
                        header.column.getIsSorted() === 'asc'
                           ? 'blue.500'
                           : 'gray.300'
                     }
                     marginBottom={-1}
                  >
                     <TriangleUpIcon aria-label="sorted ascending" />
                  </Box>
                  <Box
                     marginTop={-1}
                     color={
                        header.column.getIsSorted() === 'desc'
                           ? 'blue.500'
                           : 'gray.300'
                     }
                  >
                     <TriangleDownIcon aria-label="sorted descending" />
                  </Box>
               </Flex>
            ) : null}
         </Flex>
      </Th>
   );
};
