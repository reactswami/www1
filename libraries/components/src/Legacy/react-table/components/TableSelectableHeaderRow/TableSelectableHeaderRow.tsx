import { Box, Flex, Th, Tr } from '@chakra-ui/react';
import { TriangleDownIcon, TriangleUpIcon } from '@radix-ui/react-icons';
import { type Header, flexRender } from '@tanstack/react-table';

interface Props<T> {
   headers: Header<T, any>[];
}

/*
 * Header row for selectable table
 */
export const TableSelectableHeaderRow = <T,>({ headers }: Props<T>) => {
   return (
      <Tr>
         {headers.map((header, idx) => {
            const isSelectAllCheckbox = idx === 0; // The first header is where the select all checkbox is
            return (
               <Th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  cursor={
                     header.column.getCanSort() || isSelectAllCheckbox
                        ? 'pointer'
                        : ''
                  }

                  paddingY={2}
                  width={`${header.getSize()}px`}
               >
                  <Flex direction={'column'}>
                     <Flex alignItems={'center'} gap="sm">
                        {flexRender(
                           header.column.columnDef.header,
                           header.getContext()
                        )}

                        {header.column.getCanSort() ? (
                           <Flex direction="column" justifyContent={'center'}>
                              <Box
                                 color={
                                    header.column.getIsSorted() === 'asc'
                                       ? 'primary.500'
                                       : 'gray.200'
                                 }
                                 marginBottom={-1}
                              >
                                 <TriangleUpIcon aria-label="sorted ascending" />
                              </Box>
                              <Box
                                 marginTop={-1}
                                 color={
                                    header.column.getIsSorted() === 'desc'
                                       ? 'primary.500'
                                       : 'gray.200'
                                 }
                              >
                                 <TriangleDownIcon aria-label="sorted descending" />
                              </Box>
                           </Flex>
                        ) : null}
                     </Flex>
                  </Flex>
               </Th>
            );
         })}
      </Tr>
   );
};
