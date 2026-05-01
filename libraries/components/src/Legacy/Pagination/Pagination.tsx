import { Button, Flex, Select, Text } from '@chakra-ui/react';
import {
   ChevronLeftIcon,
   ChevronRightIcon,
   DoubleArrowLeftIcon,
   DoubleArrowRightIcon,
} from '@radix-ui/react-icons';
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from './defaults';

type PageSizeValue = (typeof PAGE_SIZE_OPTIONS)[number];

export type PaginationProps = {
   offset?: number;
   limit: number;
   totalCount: number;
   onPageChange: (newOffset: number) => void;
   onLimitChange: (newLimit: PageSizeValue) => void;
};

export function Pagination({
   totalCount,
   limit = DEFAULT_PAGE_SIZE,
   offset = 0,
   onPageChange,
   onLimitChange,
}: PaginationProps) {
   const currentPage = totalCount === 0 ? totalCount : Math.floor(offset / limit) + 1;
   const totalPages = Math.ceil(totalCount / limit);
   const handleFirstPage = () => onPageChange(0);
   const handleLastPage = () => onPageChange((totalPages - 1) * limit);
   const handlePrevPage = () => onPageChange(Math.max(0, offset - limit));
   const handleNextPage = () => onPageChange(Math.min((totalPages - 1) * limit, offset + limit));

   return (
      <Flex
         alignItems="center"
         gap="md"
         justifyContent={'space-between'}
         paddingY={2}
         bottom={'0'}
         background={'page.500'}
         borderTop={'2px'}
         borderColor={'gray.500'}
         position={'sticky'}
      >
         <Flex gap="sm" alignItems="center">
            <Text size="sm" whiteSpace={'nowrap'}>
               Rows per page
            </Text>
            <Select
               size="sm"
               borderRadius="sm"
               onChange={(e) => {
                  const newPageSize = Number(e.target.value) as PageSizeValue;
                  onLimitChange(newPageSize);
               }}
               defaultValue={limit}
            >
               {PAGE_SIZE_OPTIONS.map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                     {pageSize}
                  </option>
               ))}
            </Select>
            <Text as="b">|</Text>
            <Text size="sm" whiteSpace={'nowrap'}>
               Total row count: {totalCount}
            </Text>
         </Flex>
         <Flex alignItems="center" gap="sm">
            <Button
               variant={'outline'}
               isDisabled={currentPage === 1 || totalPages === 0}
               onClick={handleFirstPage}
               className="pg-first"
            >
               <DoubleArrowLeftIcon />
            </Button>
            <Button
               variant={'outline'}
               isDisabled={currentPage === 1 || totalPages === 0}
               onClick={handlePrevPage}
               className="pg-prev"
            >
               <ChevronLeftIcon />
            </Button>
            <Button
               variant={'outline'}
               isDisabled={currentPage === totalPages || totalPages === 0}
               onClick={handleNextPage}
               className="pg-next"
            >
               <ChevronRightIcon />
            </Button>
            <Button
               variant={'outline'}
               isDisabled={currentPage === totalPages || totalPages === 0}
               onClick={handleLastPage}
               className="pg-last"
            >
               <DoubleArrowRightIcon />
            </Button>
         </Flex>
         <Flex gap="xs" alignItems="center">
            <Text>Page</Text>
            <Text as="b">{currentPage}</Text> of
            <Text as="b">{totalPages}</Text>
         </Flex>
      </Flex>
   );
}
