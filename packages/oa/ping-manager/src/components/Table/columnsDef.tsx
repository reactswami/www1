/* eslint-disable react-hooks/rules-of-hooks */
import { Box, Checkbox, Text } from '@chakra-ui/react';
import { sortByIpAddress } from '@statseeker/components/Legacy/react-table';
import { createColumnHelper } from '@tanstack/react-table';
import { useMemo } from 'react';
import { PingTablePingTags } from '~/components';

const columnHelper = createColumnHelper<PingTableDeviceRow>();

export interface PingTableDeviceRow {
   device: string;
   deviceid: string;
   ipaddress: string;
   default_poller: string;
   pollersName: string;
   enabledStatus: string;
   hasExceeded: 1 | 0;
}

export const columns = [
   columnHelper.display({
      id: 'select',
      size: 0,
      cell: ({ row }) =>
         /* Note that the pointer events here is super important to avoid toggle/untoggle the checkbox (react-table tries to be smart, and detect changes on the checkbox, we don't want that since we handle the selection when clicking on the row) */
         useMemo(() => <Checkbox isChecked={row.getIsSelected()} pointerEvents={'none'} />, [row]),
      header: ({ table }) => (
         // Again, we use the pointer events to dissuade react table from being over smart and trying to guess the table state
         // There might be a less hacky way, but in case of refactoring make sure that the performance is not degraded. Right now, we sit at around 10-30ms when selecting a row.
         <Box
            onClick={() => {
               table.toggleAllRowsSelected();
            }}
         >
            <Checkbox
               isIndeterminate={table.getIsSomePageRowsSelected()}
               isChecked={table.getIsAllRowsSelected()}
               pointerEvents={'none'}
            />
         </Box>
      ),
   }),
   columnHelper.accessor('device', {
      size: 300,
      header: 'name',
      cell: (info) => info.getValue(),
   }),
   columnHelper.accessor('ipaddress', {
      size: 300,
      cell: (info) => (info.getValue() ? info.getValue().toString() : ''),
      header: 'IP Address',
      sortingFn: (
         { original: { ipaddress: ipaddressA } },
         { original: { ipaddress: ipaddressB } }
      ) => sortByIpAddress(ipaddressA, ipaddressB),
   }),
   columnHelper.accessor('default_poller', {
      size: 200,
      header: () => 'Default Poller',
      cell: (info) => <Text>{info.getValue() ?? '-'}</Text>,
   }),
   columnHelper.accessor((row) => row.enabledStatus + '|' + row.pollersName, {
      size: 1200,
      header: 'Pollers',
      cell: (info) => {
         let data = info.getValue().split('|');
         return <PingTablePingTags pingPollerList={data[1]} enabledList={data[0]} />;
      },
      enableSorting: false,
      enableGlobalFilter: false,
   }),
];
