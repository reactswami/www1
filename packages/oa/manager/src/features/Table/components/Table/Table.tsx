import {
   Box,
   Table as ChakraTable,
   Tbody,
   Thead,
   Tr,
} from '@chakra-ui/react';
import { AdminPage } from '@statseeker/components';
import { TablePagination, TableRowSkeleton } from '@statseeker/components/Legacy/react-table';
import { memo, useState } from 'react';
import { TABLE_PAGE_SIZES } from '~/config/defaults';
import {
   TableActionHeader,
   TableEmptyState,
   TableErrorState,
   TableHeader,
   TableRow,
   useOaContext,
   useOaTableContext,
} from '~/features/Table';


const Table = () => {
   const [headerActionHeight, setHeaderActionHeight] = useState(0); // We have to dynamically set the sticky height for the table header based on the OaTableActionHeader's height
   const { table, isLoading, isError, isSuccess, globalFilter } =
      useOaTableContext();
   const { groupId } = useOaContext();
   const isEmpty: boolean = table?.getRowModel().rows.length === 0;
   const hasFilters: boolean =
      globalFilter.length > 0 ||
      Object.values(table.getState().columnFilters).some(
         ({ value }) => (value as any[]).length > 0
      ) || !!groupId;

   return (
      <AdminPage className='oa-manager' paddingY='0'>
         <TableActionHeader setElementHeight={setHeaderActionHeight} />
         <ChakraTable size={'md'} flexGrow={1}>
            <Thead
               position="sticky"
               top={`${headerActionHeight}px`}
               background={'page.500'}
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
               {isError && <TableErrorState />}
               {isLoading &&
                  table
                     .getRowModel()
                     .rows.map((row) => (
                        <TableRowSkeleton key={row.id} row={row} />
                     ))}
               {isSuccess && isEmpty && (
                  <TableEmptyState hasFilters={hasFilters} />
               )}
               {isSuccess &&
                  table
                     .getRowModel()
                     .rows.map((row, id) => <TableRow key={row.id} row={row} index={id} />)}
               {/* This empty row expands when there are not enough rows */}
               <Tr height={'100%'} />
            </Tbody>
         </ChakraTable>
         {isSuccess && (
            <Box
               position={'sticky'}
               bottom={'0'}
               pointerEvents={isEmpty ? 'none' : 'all'}
               opacity={isEmpty ? '0.5' : '1'}
               cursor={isEmpty ? 'not-allowed' : undefined}
            >
               <TablePagination pageSizes={TABLE_PAGE_SIZES} table={table} />
            </Box>
         )}
      </AdminPage>
   );
};

export const MemoizedTable = Table;
