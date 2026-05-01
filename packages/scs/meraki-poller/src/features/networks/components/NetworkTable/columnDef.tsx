import { Box, Center, Checkbox, Flex } from '@chakra-ui/react';
import { CheckIcon } from '@radix-ui/react-icons';
import { type ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { memo, useMemo } from 'react';
import { DisableDatatypeCell } from '../DisabledDatatypePill';
import { RowActionButtons } from '~/components/TableRowActionButtons';
import { StatusPill } from '~/components/TableStatusPill';
import { type ApiDatatype } from '~/types/api';

export type NetworkRow = {
   id: string;
   name: string;
   organization_name: string;
   device_count: number;
   port_count: number;
   poll_requests: number;
   enabled: string;
   priority: boolean;
   disabled_datatypes?: ApiDatatype[];
   rule_id?: string;
   rule_name?: string;
};

const columnHelper = createColumnHelper<NetworkRow>();

export const columns: ColumnDef<NetworkRow, any>[] = [
   columnHelper.display({
      id: 'select',
      enableGlobalFilter: false,
      size: 0,
      cell: ({ row }) =>
         /* Note that the pointer events here is super important to avoid toggle/untoggle the checkbox (react-table tries to be smart, and detect changes on the checkbox, we don't want that since we handle the selection when clicking on the row) */
         // eslint-disable-next-line react-hooks/rules-of-hooks
         useMemo(
            () => (
               <Checkbox
                  width={'10px'}
                  isChecked={row.getIsSelected()}
                  pointerEvents={'none'}
               />
            ),
            // This is needed to avoid a bug with the checkbox selection being immediately cleared
            // eslint-disable-next-line react-hooks/exhaustive-deps
            [row.getIsSelected()]
         ),
      header: ({ table }) => (
         // Again, we use the pointer events to dissuade react table from being over smart and trying to guess the table state
         // There might be a less hacky way, but in case of refactoring make sure that the performance is not degraded. Right now, we sit at around 10-30ms when selecting a row.
         <Box
            onClick={() => {
               table.toggleAllRowsSelected();
            }}
            cursor="pointer"
         >
            <Checkbox
               isIndeterminate={table.getIsSomePageRowsSelected()}
               isChecked={table.getIsAllRowsSelected()}
               pointerEvents={'none'}
            />
         </Box>
      ),
   }),
   columnHelper.accessor('name', {
      header: 'Name',
      size: 500,
      cell: (info) => info.getValue(),
   }),
   columnHelper.accessor('organization_name', {
      header: 'organization',
      size: 500,
      cell: (info) => info.getValue(),
   }),
   columnHelper.accessor('device_count', {
      header: 'Device Count',
      size: 0,
      enableGlobalFilter: false,
      cell: (info) => (
         <Flex justifyContent="flex-end" alignItems="center">
            {info.getValue()}
         </Flex>
      ),
   }),
   columnHelper.accessor('port_count', {
      header: 'Port Count',
      size: 0,
      enableGlobalFilter: false,
      cell: (info) => (
         <Flex justifyContent="flex-end" alignItems="center">
            {info.getValue()}
         </Flex>
      ),
   }),
   columnHelper.accessor('poll_requests', {
      header: 'Requests Needed',
      size: 0,
      enableGlobalFilter: false,
      cell: (info) => (
         <Flex justifyContent="flex-end" alignItems="center">
            {info.getValue() || '-'}
         </Flex>
      ),
   }),
   columnHelper.accessor('enabled', {
      header: 'status',
      size: 0,
      enableSorting: false,
      enableGlobalFilter: false,
      filterFn: (row, columnId: string, filterValue: unknown[]) => {
         if (filterValue.length === 0) {
            return true;
         }
         return filterValue.some((val) =>
            row.getValue<unknown[]>(columnId)?.includes(val)
         );
      },
      cell: (info) => <StatusPill status={info.getValue()} />,
   }),
   columnHelper.accessor('priority', {
      header: () => <Center>Priority</Center>,
      size: 0,
      enableSorting: false,
      enableGlobalFilter: false,
      filterFn: (row, columnId: string, filterValue: unknown[]) => {
         if (filterValue.length === 0) {
            return true;
         }
         return Boolean(row.getValue<unknown[]>(columnId)); // There's only one possibility: ['true']. So if the filter is not null, then we want to display all priority network
      },
      cell: (info) =>
         info.getValue() ? (
            <Center color="green.500">
               <CheckIcon fontSize={'2rem'} />
            </Center>
         ) : null,
   }),
   columnHelper.accessor('disabled_datatypes', {
      id: 'disabled_datatypes',
      header: 'Disabled Datatypes',
      enableGlobalFilter: false,
      filterFn: (row, columnId: string, filterValue: unknown[]) => {
         if (filterValue.length === 0) {
            return true;
         }
         return filterValue.every((val) =>
            row.getValue<unknown[]>(columnId)?.includes(val)
         );
      },
      enableSorting: false,
      size: 2000,
      cell: (info) => {
         const listDatatype = info.getValue() ?? ([] as string[]);
         return <DisableDatatypeCell cellValue={listDatatype.sort()} />;
      },
   }),
   columnHelper.accessor('rule_name', {
      header: 'Rule name',
      cell: (info) => <Box maxWidth={'80ch'}>{info.getValue() || '-'}</Box>,
   }),
   columnHelper.display({
      id: 'actions',
      header: 'Rule Actions',
      enableGlobalFilter: false,
      enableSorting: false,
      cell: memo(({ cell }) => (
         <RowActionButtons cell={cell} type="networks" />
      )),
   }),
];
