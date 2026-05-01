import {
   Box,
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
import { memo, useEffect, useRef, useState } from 'react';
import { useGetOrganizationsTableBulkActions } from '../OrganizationTableBulkActions';
import { type OrganizationRow, columns } from './columnsDef';
import { type generateData } from './data';
import { Loader } from '~/components/Loader';
import { ModalAssignToExisting } from '~/components/ModalAssignToExisting';
import { TableBulkActions } from '~/components/TableBulkActions';
import { TableColumnFilters } from '~/components/TableColumnFilters';
import { GlobalFilter } from '~/components/TableGlobalFilter';
import { Pagination } from '~/components/TablePagination';
import { TableSelectableHeaderRow } from '~/components/TableSelectableHeaderRow';
import { TableSelectableRow } from '~/components/TableSelectableRow';
import { TableViewSettings } from '~/components/TableViewSettings';
import { DEFAULT_PAGE_SIZES } from '~/config/defaults';
import { regexpFilteFn } from '~/utils/regexpSearch';

export type Props = ReturnType<typeof generateData>;

export const OrganizationTable = memo(
   ({ data, isRefetching, refetch, isLoading }: Props) => {
      const [globalFilter, setGlobalFilter] = useState('');
      const [viewMode, setViewMode] = useState<'sm' | 'md'>('md');
      const disclosure = useDisclosure();
      const tableInstance = useReactTable<OrganizationRow>({
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
            columnFilters: [{ id: 'api_enabled', value: [] }],
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
            {/*There is a funky bug with the order in which the hooks are rendered.
             * Ideally we woudl put a  skeleton-like loader here but it requires more refactoring so I might come back to it later */}
            {isLoading && (
               <Box
                  height={'100%'}
                  width={'100%'}
                  position="absolute"
                  zIndex={100}
               >
                  <Loader />
               </Box>
            )}

            <ModalAssignToExisting
               disclosure={disclosure}
               selectedRows={selectedRows}
               type="organizations"
            />
            <Flex
               position="sticky"
               top={0}
               background={'white'}
               zIndex={99}
               ref={headerRef}
               justifyContent="space-between"
               paddingY={2}
               alignItems="center"
            >
               <GlobalFilter
                  ref={headerRef}
                  globalFilter={globalFilter}
                  setGlobalFilter={setGlobalFilter}
               />
               <Flex flexWrap={'wrap'} gap="md" justifyContent={'flex-end'}>
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
                  <TableViewSettings
                     viewMode={viewMode}
                     setViewMode={setViewMode}
                  />
                  <TableColumnFilters
                     columnFilters={tableInstance.getState().columnFilters}
                     setColumnFilters={tableInstance.setColumnFilters}
                     filters={[
                        {
                           id: 'api_enabled',
                           type: 'checkbox',
                           title: 'api access',
                           options: [{ value: 'enabled', label: 'enabled' }],
                        },
                     ]}
                  />
                  <TableBulkActions
                     selectedRowsCount={selectedRows.length}
                     actions={useGetOrganizationsTableBulkActions({
                        selectedRows,
                        onOpen: disclosure.onOpen,
                     })}
                  />
               </Flex>
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
                     <TableSelectableHeaderRow<OrganizationRow>
                        key={headerGroup.id}
                        headers={headerGroup.headers}
                     />
                  ))}
               </Thead>
               <Tbody>
                  {tableInstance.getRowModel().rows.map((row) => (
                     <TableSelectableRow<OrganizationRow>
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
   }
);
