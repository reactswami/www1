import {
   Button,
   Flex,
   FormControl,
   FormLabel,
   Input,
   Select,
   Text,
} from '@chakra-ui/react';
import {
   ChevronLeftIcon,
   ChevronRightIcon,
   DoubleArrowLeftIcon,
   DoubleArrowRightIcon,
} from '@radix-ui/react-icons';
import { useDebounceValue } from '@statseeker/hooks';
import { type Table } from '@tanstack/react-table';
import { useEffect, useState } from 'react';

export interface Props {
   table: Table<any>;
   pageSizes: number[];
   defaultPageSize?: number;
}

/*
 * Client side pagination footer
 */
export const TablePagination = ({ table, pageSizes, defaultPageSize }: Props) => {
   // Local pagination state
   const [currentPage, setCurrentPage] = useState<string>(() =>
      (table.getState().pagination.pageIndex + 1).toString()
   );
   // If the table state changes, update the local state
   useEffect(() => {
      const tableCurrentPage = table.getState().pagination.pageIndex;
      if (currentPage !== (tableCurrentPage + 1).toString()) {
         setCurrentPage((table.getState().pagination.pageIndex + 1).toString());
      }
   }, [table.getState().pagination.pageIndex]);

   // Debouncing the local pagination state before updating the table state
   const debouncedCurrentPage = useDebounceValue(Number(currentPage) - 1, 300);
   useEffect(() => {
      if (currentPage === '') {
         return;
      }
      const targetPage = getCurrentPageWithinLimits(debouncedCurrentPage);
      if (targetPage === table.getState().pagination.pageIndex) {
         return;
      }
      table.setPageIndex(targetPage);
   }, [debouncedCurrentPage]);

   // Helper to set the page within the boundaries of the pagination
   const getCurrentPageWithinLimits = (targetPage: number) => {
      const max = table.getPageCount() - 1;
      const min = 0;
      const newPageTarget = Math.min(Math.max(targetPage, min), max);
      return newPageTarget;
   };

   return (
      <Flex
         alignItems="center"
         gap="md"
         justifyContent={'space-between'}
         paddingY={2}
         position={'sticky'}
         bottom={'0'}
         background={'white'}
         borderTop={'2px'}
         borderColor={'blue.800'}
      >
         <Flex gap="sm" alignItems="center">
            <Text size="sm" whiteSpace={'nowrap'}>
               Rows per page
            </Text>
            <Select
               size="sm"
               borderRadius="sm"
               onChange={(e) => {
                  table.setPageSize(Number(e.target.value));
               }}
               defaultValue={defaultPageSize}
            >
               {pageSizes.map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                     {pageSize}
                  </option>
               ))}
            </Select>
            <Text as="b">|</Text>
            <Flex>
               <Text marginRight={1} whiteSpace={'nowrap'}>
                  Total row count:
               </Text>
               <Text>{table.getFilteredRowModel().rows.length}</Text>
            </Flex>
         </Flex>
         <Flex alignItems="center" gap="sm">
            <Button
               variant={'outline'}
               onClick={() => table.setPageIndex(0)}
               isDisabled={!table.getCanPreviousPage()}
               title="First page"
            >
               <DoubleArrowLeftIcon />
            </Button>
            <Button
               variant={'outline'}
               onClick={table.previousPage}
               isDisabled={!table.getCanPreviousPage()}
               title="Previous page"
            >
               <ChevronLeftIcon />
            </Button>

            <Button
               variant={'outline'}
               onClick={table.nextPage}
               isDisabled={!table.getCanNextPage()}
               title="Next page"
            >
               <ChevronRightIcon />
            </Button>
            <Button
               variant={'outline'}
               onClick={() => table.setPageIndex(table.getPageCount() - 1)}
               isDisabled={!table.getCanNextPage()}
               title="Last page"
            >
               <DoubleArrowRightIcon />
            </Button>
         </Flex>

         <Flex gap="xs" alignItems="center">
            <Text>Page</Text>
            <Text as="b">{table.getState().pagination.pageIndex + 1}</Text> of
            <Text as="b">
               {table.getPageCount() > 0 ? table.getPageCount() : '-'}
            </Text>
         </Flex>
      </Flex>
   );
};
