import {
   Button,
   Table as ChakraTable,
   Flex,
   Tbody,
   Thead,
   Tr,
   useDisclosure,
} from '@chakra-ui/react';
import { UpdateIcon } from '@radix-ui/react-icons';
import {
   getCoreRowModel,
   getFilteredRowModel,
   getPaginationRowModel,
   getSortedRowModel,
   useReactTable,
} from '@tanstack/react-table';
import { useEffect, useRef, useState } from 'react';
import { type NetworkRow, columns } from './columnDef';
import { generateData } from './data';
import {
   GlobalFilter,
   Pagination,
   getDisplayNameForDatatype,
} from '~/components';

import { ModalAssignToExisting } from '~/components/ModalAssignToExisting';
import { TableBulkActions } from '~/components/TableBulkActions';
import { TableColumnFilters } from '~/components/TableColumnFilters';
import { TableSelectableHeaderRow } from '~/components/TableSelectableHeaderRow';
import { TableSelectableRow } from '~/components/TableSelectableRow';
import { TableViewSettings } from '~/components/TableViewSettings';
import { DEFAULT_PAGE_SIZES } from '~/config/defaults';
import { NetworkTableBulkActions } from '~/features/networks/components/NetworkTableBulkActions';
import { ApiDatatype } from '~/types/api';
import { regexpFilteFn } from '~/utils/regexpSearch';

export const NetworkTable = () => {
   const [globalFilter, setGlobalFilter] = useState('');
   const { data, refetch, isRefetching, isLoading } = generateData();
   const [viewMode, setViewMode] = useState<'sm' | 'md'>('md');
   const disclosure = useDisclosure();
   const tableInstance = useReactTable<NetworkRow>({
      data,
      columns,
      enableRowSelection: true,
      enableMultiSort: false,
      getRowId: (row) => row.id,
      globalFilterFn: regexpFilteFn,
      getSortedRowModel: getSortedRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getCoreRowModel: getCoreRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      state: {
         globalFilter,
      },
      initialState: {
         pagination: {
            pageSize: DEFAULT_PAGE_SIZES[0],
         },
         columnFilters: [
            { id: 'enabled', value: [] },
            { id: 'disabled_datatypes', value: [] },
            { id: 'priority', value: [] },
         ],
      },
   });

   useEffect(() => {
      if (!tableInstance.getIsAllRowsSelected()) {
         return;
      }
      tableInstance.setRowSelection(
         tableInstance
            .getFilteredRowModel()
            .rows.map(({ id }) => ({ [id]: true }))
            .reduce((previous, current) => ({ ...previous, ...current }), {})
      );
   }, [globalFilter]);

   const headerRef = useRef<HTMLDivElement>(null);

   const selectedRows = tableInstance
      .getSelectedRowModel()
      .rows.map(({ original }) => original);
   return (
      <Flex
         direction={'column'}
         padding={4}
         shadow="sm"
         borderRadius="sm"
         background="white"
         paddingBottom={0}
         flexGrow={1}
         border="1px"
         borderColor={'gray.100'}
      >
         <ModalAssignToExisting
            disclosure={disclosure}
            selectedRows={selectedRows}
            type="networks"
         />
         <Flex
            position="sticky"
            top={0}
            background={'white'}
            zIndex={99}
            ref={headerRef}
            justifyContent="space-between"
            alignItems={'center'}
            paddingY={2}
            gap="md"
         >
            <GlobalFilter
               globalFilter={globalFilter}
               setGlobalFilter={setGlobalFilter}
            />
            <Button
               leftIcon={<UpdateIcon />}
               aria-label="refresh table data"
               variant="ghost"
               alignSelf="center"
               isLoading={isRefetching}
               onClick={() => refetch()}
            >
               Refresh data
            </Button>

            <TableViewSettings viewMode={viewMode} setViewMode={setViewMode} />
            <TableColumnFilters
               columnFilters={tableInstance.getState().columnFilters}
               setColumnFilters={tableInstance.setColumnFilters}
               filters={[
                  {
                     id: 'enabled',
                     type: 'checkbox',
                     title: 'status',
                     options: [
                        { value: 'polling', label: 'polling' },
                        { value: 'incomplete', label: 'incomplete' },
                        { value: 'rate_limit', label: 'rate limit exceeded' },
                        { value: 'disabled', label: 'disabled' },
                     ],
                  },
                  {
                     id: 'disabled_datatypes',
                     type: 'checkbox',
                     title: 'disabled datatypes',
                     options: Object.values(ApiDatatype).map((datatype) => ({
                        value: datatype,
                        label: getDisplayNameForDatatype(datatype),
                     })),
                  },
                  {
                     id: 'priority',
                     type: 'checkbox',
                     title: 'priority',
                     options: [
                        {
                           value: 'true',
                           label: 'Priority',
                        },
                     ],
                  },
               ]}
            />
            <TableBulkActions
               selectedRowsCount={selectedRows.length}
               actions={NetworkTableBulkActions({
                  selectedRows,
                  onOpen: disclosure.onOpen,
               })}
            />
         </Flex>
         <ChakraTable size={viewMode} paddingTop={2} flexGrow={1}>
            <Thead
               position="sticky"
               top={`${headerRef.current?.getBoundingClientRect().height}px`}
               background={'white'}
               zIndex="2"
               _after={{
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  width: '100%',
                  height: '2px',
                  backgroundColor: 'gray.500',
               }}
            >
               {tableInstance.getHeaderGroups().map((headerGroup) => (
                  <TableSelectableHeaderRow<NetworkRow>
                     key={headerGroup.id}
                     headers={headerGroup.headers}
                  />
               ))}
            </Thead>
            <Tbody>
               {tableInstance.getRowModel().rows.map((row) => (
                  <TableSelectableRow<NetworkRow>
                     key={row.id}
                     row={row}
                     isChecked={row.getIsSelected()}
                  />
               ))}
               <Tr height={'100%'} />
               {/* This row prevent the rows from expanding when there is only a few row matching the query */}
            </Tbody>
         </ChakraTable>
         <Pagination
            pageSizes={DEFAULT_PAGE_SIZES}
            canNextPage={tableInstance.getCanNextPage()}
            canPreviousPage={tableInstance.getCanPreviousPage()}
            pageIndex={tableInstance.getState().pagination.pageIndex}
            pageSize={tableInstance.getState().pagination.pageSize}
            gotoPage={tableInstance.setPageIndex}
            previousPage={tableInstance.previousPage}
            nextPage={tableInstance.nextPage}
            pageOptions={tableInstance.getPageOptions()}
            pageCount={tableInstance.getPageCount()}
            setPageSize={tableInstance.setPageSize}
         />
      </Flex>
   );
};
