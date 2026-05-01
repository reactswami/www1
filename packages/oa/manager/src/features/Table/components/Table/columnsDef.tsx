import { Box, Center, Checkbox, Text } from '@chakra-ui/react';
import { convertSecondsToTimeString } from '@statseeker/utils/date';
import { createColumnHelper } from '@tanstack/react-table';
import React from 'react';
import { TableServiceTag } from '../TableServiceTag';
import { TableStatusTag } from '../TableStatusTag';
import { type TableRowData } from '~/hooks/useFetchOaTableData';

const columnHelper = createColumnHelper<TableRowData>();

const EmptyCell = () => <Center>-</Center>;

export const columns = [
   columnHelper.display({
      id: 'select',
      size: 50,
      cell: ({ row }) => (
         <Box onClick={(e) => e.stopPropagation()}>
            <Checkbox
               isChecked={row.getIsSelected()}
               isDisabled={!row.getCanSelect()}
               onChange={row.getToggleSelectedHandler()}
               colorScheme="blue"
               sx={{
                  '& .chakra-checkbox__control': {
                     borderRadius: '4px',
                     borderWidth: '2px',
                     borderColor: 'gray.300',
                     _checked: {
                        bg: 'blue.500',
                        borderColor: 'blue.500',
                     },
                     _focus: {
                        boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.6)',
                     },
                  },
               }}
            />
         </Box>
      ),
   }),
   columnHelper.accessor('status', {
      size: 0,
      header: '',
      enableSorting: false,
      enableColumnFilter: true,
      filterFn: (row, columnId: string, filterValue: string[]) => {
         if (filterValue.length === 0) {
            return true;
         }
         return filterValue.some((val) => {
            // Note: to check if an oa is disabled we have to check the 'poll' field.
            const realValue: string =
               row.original.poll === 'off'
                  ? 'disabled'
                  : row.getValue(columnId);

            return realValue.toLowerCase() === val.toLowerCase();
         });
      },
      enableGlobalFilter: false,
      cell: (info) => {
         return (
            <TableStatusTag
               isDisabled={info.row.original.poll === 'off'}
               status={info.getValue() as 'up' | 'down'}
            />
         );
      },
   }),
   columnHelper.accessor('name', {
      enableColumnFilter: false,
      cell: (info) => (
         <Text whiteSpace={'nowrap'}>{info.getValue() ?? '-'}</Text>
      ),
   }),
   columnHelper.accessor('uptime', {
      enableColumnFilter: false,
      size: 0,
      cell: (info) =>
         convertSecondsToTimeString(Number(info.getValue())) || '-',
      sortingFn: (a, b) => (a.original.uptime < b.original.uptime ? 1 : -1),
   }),
   columnHelper.accessor('hostname', {
      enableColumnFilter: false,
      cell: (info) => (
         <Text whiteSpace={'nowrap'}>{info.getValue() ?? '-'}</Text>
      ),
   }),
   columnHelper.accessor('ipaddress', {
      header: 'Ip Address',
      enableColumnFilter: false,
      cell: (info) => info.getValue() ?? <EmptyCell />,
   }),
   columnHelper.accessor('ipv6address', {
      header: 'Ipv6 Address',
      enableColumnFilter: false,
      cell: (info) => info.getValue() ?? <EmptyCell />,
   }),
   columnHelper.accessor('version', {
      size: 0,
      enableColumnFilter: false,
      cell: (info) => info.getValue() ?? <EmptyCell />,
   }),
   columnHelper.accessor('region', {
      enableColumnFilter: false,
      cell: (info) => info.getValue() ?? <EmptyCell />,
   }),
   columnHelper.accessor('site', {
      enableColumnFilter: false,
      cell: (info) => info.getValue() ?? <EmptyCell />,
   }),
   columnHelper.accessor('location', {
      enableColumnFilter: false,
      cell: (info) => info.getValue() ?? <EmptyCell />,
   }),
   columnHelper.accessor('timeout', {
      enableColumnFilter: false,
      cell: (info) => info.getValue() ?? <EmptyCell />,
   }),
   columnHelper.accessor('services', {
      enableColumnFilter: true,
      filterFn: (row, columnId: string, filterValue: unknown[]) => {
         if (filterValue.length === 0) {
            return true;
         }
         return filterValue.some((val) =>
            row.getValue<unknown[]>(columnId)?.includes(val)
         );
      },
      enableSorting: false,
      enableGlobalFilter: false,
      cell: (info) => (
         <TableServiceTag
            servicesString={info.getValue().join(',')}
         />
      ),
   }),
];
