import { Box, Checkbox, Flex, Text } from '@chakra-ui/react';
import { type Cell, type ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { memo, useMemo } from 'react';
import { RowActionButtons } from '~/components/TableRowActionButtons';
import { StatusPill } from '~/components/TableStatusPill';

export type OrganizationRow = {
   id: string;
   name: string;
   network_count: number;
   rate_limit: number;
   poll_requests: number;
   poll_sent: number;
   poll_limit: number;
   api_enabled: string;
   rule_name?: string;
   rule_id?: string;
};

const columnHelper = createColumnHelper<OrganizationRow>();

export const columns: ColumnDef<OrganizationRow, any>[] = [
   columnHelper.display({
      id: 'select',
      size: 0,
      enableGlobalFilter: false,
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
      header: 'Organization name',
      size: 1000,
      cell: (info) => info.getValue(),
   }),
   columnHelper.accessor('network_count', {
      header: 'Network Count',
      size: 0,
      enableGlobalFilter: false,
      cell: (info) => (
         <Flex justifyContent="flex-end" alignItems="center">
            {info.getValue()}
         </Flex>
      ),
   }),
   columnHelper.accessor('api_enabled', {
      header: 'Api access',
      size: 0,
      enableSorting: false,
      enableGlobalFilter: false,
      filterFn: (row, columnId: string, filterValue: unknown[]) => {
         if (filterValue.length === 0) {
            return true;
         }
         return Boolean(row.getValue<unknown[]>(columnId)); // There's only one possibility: ['true']. So if the filter is not null, then we want to display all priority network
      },
      cell: (info) => (
         <StatusPill
            showTooltip={false}
            status={info.getValue().toLowerCase()}
         />
      ),
   }),
   columnHelper.accessor('rate_limit', {
      header: 'Rate Limit',
      enableGlobalFilter: false, // We can't filter on numbers yet
      size: 0,
      cell: (info) => <Text textAlign={'right'}>{info.getValue()}</Text>,
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
   columnHelper.accessor('poll_sent', {
      header: 'Requests Sent',
      size: 0,
      enableGlobalFilter: false,
      cell: (info) => (
         <Flex justifyContent="flex-end" alignItems="center">
            {info.getValue() || '-'}
         </Flex>
      ),
   }),
   columnHelper.accessor('poll_limit', {
      // Annoyingly, request_limit is an internal option. Don't use this, 'poll_limit' is correct
      header: 'Request Limit',
      size: 0,
      enableGlobalFilter: false,
      cell: (info) => (
         <Flex justifyContent="flex-end" alignItems="center">
            {info.getValue() || '-'}
         </Flex>
      ),
   }),
   columnHelper.accessor('rule_name', {
      header: 'Rule name',
      size: 1000,
      cell: (info) => <Box maxWidth={'80ch'}>{info.getValue() || '-'}</Box>,
   }),
   columnHelper.display({
      id: 'actions',
      header: 'Rule Actions',
      enableGlobalFilter: false,
      enableSorting: false,
      size: 0,
      cell: memo(({ cell }) => (
         <RowActionButtons
            cell={cell as Cell<OrganizationRow, unknown>}
            type="organizations"
         />
      )),
   }),
];
