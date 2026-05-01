import {
   Button,
   Flex,
   FormControl,
   FormLabel,
   Input,
   Text,
} from '@chakra-ui/react';
import {
   ChevronLeftIcon,
   ChevronRightIcon,
   DoubleArrowLeftIcon,
   DoubleArrowRightIcon,
} from '@radix-ui/react-icons';
import { useDebounceValue } from '@statseeker/hooks';
import { type ReactElement, useEffect, useState } from 'react';
import { usePingTableContext } from '~/contexts';
import { type UsePagination } from '~/hooks';

export const PingTablePaginationFooter = () => {
   const {
      pagination,
      data: { total },
      table,
   } = usePingTableContext();

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

   const paginationButtons = generatePaginationButtons(pagination);
   return (
      <Flex
         alignItems="center"
         gap="md"
         justifyContent={'space-between'}
         paddingY={2}
         position={'sticky'}
         bottom={'0'}
         background={'page.500'}
         borderTop={'2px'}
         borderColor={'blue.800'}
         marginBottom={-6}
      >
         <Flex gap="sm" alignItems="center">
            <Text size="sm" whiteSpace={'nowrap'}>
               Rows per page: 100
            </Text>
            <Text as="b">|</Text>
            <Flex>
               <Text marginRight={1} whiteSpace={'nowrap'}>
                  Total row count:
               </Text>
               <Text>{total}</Text>
            </Flex>
         </Flex>
         <Flex alignItems="center" gap="sm">
            {paginationButtons.map(({ icon, onClick, isDisabled }, key) => (
               <Button
                  key={key}
                  variant={'outline'}
                  isDisabled={isDisabled}
                  onClick={onClick}
               >
                  {icon}
               </Button>
            ))}
         </Flex>
         <Flex gap="xs" alignItems="center">
            <Text>Page</Text>
            <Text as="b">{pagination.offset / 100 + 1}</Text> of{' '}
            <Text as="b">
               {pagination.pageCount === 0 ? '-' : pagination.pageCount}
            </Text>
            <Text as="b">|</Text>
            <FormControl
               display="flex"
               alignItems={'center'}
               gap="sm"
               width={44}
            >
               <FormLabel whiteSpace={'nowrap'} margin={0}>
                  Go to page
               </FormLabel>
               <Input
                  size="sm"
                  flexGrow={0}
                  flexBasis={'8ch'}
                  value={currentPage}
                  onChange={(e) => {
                     if (isNaN(Number(e.target.value))) {
                        return;
                     }
                     setCurrentPage(e.target.value);
                  }}
               />
            </FormControl>
         </Flex>
      </Flex>
   );
};

function generatePaginationButtons(
   pagination: ReturnType<typeof UsePagination>
): { isDisabled: boolean; onClick: () => void; icon: ReactElement }[] {
   return [
      {
         isDisabled: !pagination.canPreviousPage,
         onClick: pagination.goToFirstPage,
         icon: <DoubleArrowLeftIcon />,
      },
      {
         isDisabled: !pagination.canPreviousPage,
         onClick: pagination.previousPage,
         icon: <ChevronLeftIcon />,
      },
      {
         onClick: pagination.nextPage,
         isDisabled: !pagination.canNextPage,

         icon: <ChevronRightIcon />,
      },
      {
         onClick: pagination.goToLastPage,
         isDisabled: !pagination.canNextPage,
         icon: <DoubleArrowRightIcon />,
      },
   ];
}
