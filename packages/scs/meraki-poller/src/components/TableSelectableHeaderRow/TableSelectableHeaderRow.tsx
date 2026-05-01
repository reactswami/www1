import { Box, Flex, Th, Tr } from '@chakra-ui/react';
import { TriangleDownIcon, TriangleUpIcon } from '@radix-ui/react-icons';
import { type Header, flexRender } from '@tanstack/react-table';

interface Props<T> {
   headers: Header<T, any>[];
}

export const TableSelectableHeaderRow = <T,>({
   headers,
}: Props<T>) => {
   return (
      <Tr>
         {headers.map((header, idx) => {
            return (
               <Th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  cursor={header.column.getCanSort() ? 'pointer' : ''}
                  _hover={{
                     background: 'gray.50',
                  }}
                  paddingY={2}
                  width={`${header.getSize()}px`}
               >
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
                     <div className="border-bottom"></div>
               </Th>
            );
         })}
      </Tr>
   );
};
