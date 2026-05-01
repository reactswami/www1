import { Card, Heading } from '@chakra-ui/react';
import {
   type DeviceWithCredentialName,
   type DeviceFilter,
} from '@statseeker/api/internal_api/entities/device/type';
import { Pagination } from '@statseeker/components';
import {
   type ColumnDef,
   ROWS_PER_PAGE,
   SSDataTable,
   type SortEventPayload,
} from '@statseeker/components/Legacy/SSDataTable';
import { useQuery } from '@tanstack/react-query';
import { memo, useCallback, useState } from 'react';
import { CredentialDevicesFilters } from './CredentialDevicesFilters';
import { getDevicesWithCredentialQuery } from '~/lib/ReactQuery';

const columnDefs: ColumnDef[] = [
   { field: 'name' },
   { field: 'ipaddress', headerName: 'IP Address' },
   {
      field: 'ping_state.state',
      headerName: 'Ping State',
      columnSize: 'sm',
   },
   {
      field: 'snmp_state.state',
      headerName: 'SNMP State',
      columnSize: 'sm',
   },
   {
      field: 'lastPingStateChange.state_time',
      headerName: 'Last Ping Change',
      columnSize: 'lg',
   },
   {
      field: 'lastSNMPStateChange.state_time',
      headerName: 'Last SNMP Change',
      columnSize: 'lg',
   },
];

const defaultDevicesOpts: DeviceFilter = {
   limit: ROWS_PER_PAGE,
   sort: 'name',
   dir: 'asc',
};

export const CredentialDevicesTable = memo(function CredentialDevicesTable({
   credentialId,
}: {
   credentialId: number;
}) {
   const [devicesOpts, setDevicesOpts] = useState<DeviceFilter>(defaultDevicesOpts);

   const { isSuccess, data: devicesData } = useQuery(
      getDevicesWithCredentialQuery(devicesOpts, credentialId)
   );

   const onDevicesSort = useCallback(
      function ({ column, order }: SortEventPayload) {
         setDevicesOpts({
            ...devicesOpts,
            sort: column,
            dir: order,
         });
      },
      [devicesOpts]
   );

   const onDevicesPageChange = useCallback(
      function (newOffset: number) {
         setDevicesOpts({
            ...devicesOpts,
            offset: newOffset,
         });
      },
      [devicesOpts]
   );

   const onSearchChange = useCallback(
      function (newText: string | undefined) {
         setDevicesOpts({
            ...devicesOpts,
            text_filter: newText,
         });
      },
      [devicesOpts]
   );

   const onGroupChange = useCallback(
      function (newGroup: number | undefined) {
         setDevicesOpts({
            ...devicesOpts,
            group_id_filter: newGroup,
         });
      },
      [devicesOpts]
   );

   const onPingChange = useCallback(
      function (newPing: string | undefined) {
         setDevicesOpts({
            ...devicesOpts,
            ping_state: newPing,
         });
      },
      [devicesOpts]
   );

   const onSNMPChange = useCallback(
      function (newSNMP: string | undefined) {
         setDevicesOpts({
            ...devicesOpts,
            snmp_state: newSNMP,
         });
      },
      [devicesOpts]
   );

   const handleLimitChange = useCallback(
      function handleLimitChange(newLimit: number) {
         setDevicesOpts({
            ...devicesOpts,
            limit: newLimit,
         });
      },
      [devicesOpts]
   );

   return (
      <Card
         display={'flex'}
         flexDirection="column"
         paddingX={4}
         paddingY={2}
         marginTop={2}
         background="card.500"
         border="1px"
         borderColor={'gray.200'}
         borderRadius={'sm'}
         shadow="md"
         gap={2}
         minH={'300px'}
         flexShrink={1}
      >
         <Heading size="md">Devices using this SNMP Credential</Heading>
         {
            <CredentialDevicesFilters
               group={devicesOpts.group_id_filter}
               ping_state={devicesOpts.ping_state}
               snmp_state={devicesOpts.snmp_state}
               text_filter={devicesOpts.text_filter}
               showCredential={false}
               onGroupChange={onGroupChange}
               onPingChange={onPingChange}
               onSearch={onSearchChange}
               onSNMPChange={onSNMPChange}
            />
         }
         {
            <SSDataTable<DeviceWithCredentialName>
               columns={columnDefs}
               sortCol={devicesOpts.sort}
               sortDir={devicesOpts.dir as 'asc' | 'desc' | undefined}
               rowData={devicesData?.data || []}
               height="100%"
               onSort={onDevicesSort}
               rowIdKey="id"
               emptyMessage={
                  !isSuccess
                     ? 'Loading...'
                     : devicesData.data.length === 0
                     ? 'No devices using this SNMP Credential found'
                     : 'Failed to fetch devices'
               }
            />
         }
         {isSuccess && (
            <Pagination
               totalCount={devicesData.data_total}
               limit={devicesOpts.limit !== undefined ? devicesOpts.limit : ROWS_PER_PAGE}
               offset={devicesOpts.offset}
               onPageChange={onDevicesPageChange}
               onLimitChange={handleLimitChange}
            />
         )}
      </Card>
   );
});
