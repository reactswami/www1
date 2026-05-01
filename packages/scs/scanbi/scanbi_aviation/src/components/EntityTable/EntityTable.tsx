import {
   Box,
   Table as ChakraTable,
   Flex,
   Tbody,
   Thead,
   Tr
} from '@chakra-ui/react';
import { TablePagination, TableRowSkeleton } from '@statseeker/components/Legacy/react-table';
import { memo, useState } from 'react';
import {
   TableEmptyState,
   TableErrorState,
   TableHeader,
   TableRow,
   useTableContext,
} from '~/components/Table';
import { TableActionHeader } from '~/components/TableActionHeader';
import { DEFAULT_TABLE_PAGE_SIZE, TABLE_PAGE_SIZES } from '~/config/defaults';
import { type EntityType } from '~/types/models';

export interface EntityTableProps {
   entity: EntityType;
   errorTitle: string;
   errorDescription: string;
   noDataError: string;
   noFilteredDataError: string;
   emptyStateAction: string;
}

const Table = ({
   entity,
   errorTitle,
   errorDescription,
   noDataError,
   noFilteredDataError,
   emptyStateAction,
}: EntityTableProps) => {
   const [headerActionHeight, setHeaderActionHeight] = useState(0); // We have to dynamically set the sticky height for the table header based on the TableActionHeader's height
   const { table, isLoading, isError, isSuccess, viewMode, globalFilter, addDisclosure } =
      useTableContext();
   const isEmpty: boolean = table?.getRowModel().rows.length === 0;
   const hasFilters: boolean =
      globalFilter.length > 0 ||
      Object.values(table.getState().columnFilters).some(
         ({ value }) => (value as any[]).length > 0
      );

   return (
      <Flex
         flexGrow={1}
         direction="column"
         paddingX={4}
         paddingTop="0px"
         marginTop={4}
         paddingBottom="0px"
         borderRadius="sm"
         background="white"
         border="1px"
         borderColor={'gray.100'}
         shadow="sm"
         flex="0px"
         overflowY="hidden"
      >
         <TableActionHeader setElementHeight={setHeaderActionHeight} entityType={entity} />
         <Flex flexGrow={1} overflowY={'auto'} flexDirection={'column'}>
            <ChakraTable size={isLoading ? 'md' : viewMode}>
               <Thead
                  position="sticky"
                  top="0"
                  background={'white'}
                  zIndex="1"
                  _after={{
                     content: '""',
                     position: 'absolute',
                     bottom: 0,
                     width: '100%',
                     height: '2px',
                     backgroundColor: 'gray.500',
                  }}
               >
                  <TableHeader table={table} />
               </Thead>
               <Tbody flexGrow={1} position="relative">
                  {isLoading &&
                     table
                        .getRowModel()
                        .rows.map((row) => <TableRowSkeleton key={row.id} row={row} />)}

                  {isSuccess &&
                     table.getRowModel().rows.map((row) => <TableRow key={row.id} row={row} />)}
                  {/* This empty row expands when there are not enough rows */}
                  <Tr height={'100%'} />
               </Tbody>
            </ChakraTable>
            {isError && <TableErrorState title={errorTitle} description={errorDescription} />}
            {isSuccess && isEmpty && (
               <TableEmptyState
                  disclosure={addDisclosure}
                  hasFilters={hasFilters}
                  noDataError={noDataError}
                  noFilteredDataError={noFilteredDataError}
                  actionTitle={emptyStateAction}
               />
            )}
         </Flex>
         {isSuccess && (
            <Box
               position={'sticky'}
               bottom={'0'}
               pointerEvents={isEmpty ? 'none' : 'all'}
               opacity={isEmpty ? '0.5' : '1'}
               cursor={isEmpty ? 'not-allowed' : undefined}
            >
               <TablePagination
                  pageSizes={TABLE_PAGE_SIZES}
                  table={table}
                  defaultPageSize={DEFAULT_TABLE_PAGE_SIZE}
               />
            </Box>
         )}
      </Flex>
   );
};

export const EntityTable = memo(Table);
