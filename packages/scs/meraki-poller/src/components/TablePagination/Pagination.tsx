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

interface Props {
   gotoPage: (page: number) => void;
   previousPage: () => void;
   nextPage: () => void;
   pageIndex: number;
   pageOptions: unknown[];
   pageCount: number;
   pageSize: number;
   setPageSize: (arg: number) => void;
   canNextPage: boolean;
   canPreviousPage: boolean;
   pageSizes: number[];
}

export const Pagination = ({
   pageSizes,
   gotoPage,
   previousPage,
   nextPage,
   pageIndex,
   pageOptions,
   pageCount,
   pageSize,
   setPageSize,
   canNextPage,
   canPreviousPage,
}: Props) => {
   return (
      <Flex
         alignItems="center"
         gap="md"
         justifyContent={'space-between'}
         paddingY={2}
         position={'sticky'}
         bottom={0}
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
               value={pageSize}
               onChange={(e) => {
                  setPageSize(Number(e.target.value));
               }}
            >
               {pageSizes.map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                     {pageSize}
                  </option>
               ))}
            </Select>
         </Flex>
         <Flex alignItems="center" gap="sm">
            <Button
               variant={'outline'}
               onClick={() => gotoPage(0)}
               isDisabled={!canPreviousPage}
            >
               <DoubleArrowLeftIcon />
            </Button>
            <Button
               variant={'outline'}
               onClick={() => previousPage()}
               isDisabled={!canPreviousPage}
            >
               <ChevronLeftIcon />
            </Button>

            <Button
               variant={'outline'}
               onClick={nextPage}
               isDisabled={!canNextPage}
            >
               <ChevronRightIcon />
            </Button>
            <Button
               variant={'outline'}
               onClick={() => gotoPage(pageCount - 1)}
               isDisabled={!canNextPage}
            >
               <DoubleArrowRightIcon />
            </Button>
         </Flex>

         <Flex gap="xs" alignItems="center">
            <Text>Page</Text>
            <Text as="b">{pageIndex + 1}</Text> of{' '}
            <Text as="b">{pageOptions.length || '-'}</Text>
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
                  min={1}
                  max={pageCount + 1}
                  type="number"
                  onBlur={(e: any) => {
                     gotoPage(
                        getPageWithinBoundaries(e.target.value - 1, pageCount)
                     );
                  }}
               />
            </FormControl>
         </Flex>
      </Flex>
   );
};

const getPageWithinBoundaries = (pageDesired: number, maxPage: number) => {
   return Math.min(Math.max(pageDesired, 0), maxPage - 1);
};
