import { Table as ChakraTable, Tbody, Tr } from '@chakra-ui/react';
import { AdminPage } from '@statseeker/components';
import { TableSelectableRow } from '@statseeker/components/Legacy/react-table';
import { useDimensions } from '@statseeker/hooks';
import {
   PingTableActionsHeader,
   PingTableEmptyState,
   PingTablePaginationFooter,
} from '~/components';
import { TableHeader } from '~/components/TableHeader';
import { usePingTableContext } from '~/contexts';

export const PingTable = () => {
   const { ref: headerRef, dimensions } = useDimensions<HTMLDivElement>();
   const {
      table,
      viewMode,
      isSuccess,
      isLoading,
      isRefetching,
      data: { total },
   } = usePingTableContext();
   return (
      <AdminPage className='oa-ping-manager' paddingY='0'>
         <PingTableActionsHeader ref={headerRef} />
         <ChakraTable size={viewMode} flexGrow={1}>
            {/* Table header */}
            <TableHeader dimensions={dimensions} getHeaderGroups={table.getHeaderGroups} />
            <Tbody position="relative" height={'100%'}>
               {isSuccess && total < 1 ? (
                  <PingTableEmptyState />
               ) : (
                  <>
                     {table.getRowModel().rows.map((row, idx) => (
                        <TableSelectableRow
                           isLoading={isLoading || isRefetching}
                           isChecked={
                              row.getIsSelected() ||
                              table.getIsAllRowsSelected()
                           }
                           row={row}
                           key={idx}
                        />
                     ))}
                  </>
               )}
               {/* This row prevent the rows from expanding when there is only a few row matching the query */}
               <Tr height={'100%'} />
            </Tbody>
         </ChakraTable>
         <PingTablePaginationFooter />
      </AdminPage>
   );
};
