import { Box, Flex, Text } from '@statseeker/components/Layout';
import { Input } from '@statseeker/components/Layout/Form';
import {
   type PollerListItem,
   type Device,
   type DeviceFilter,
   type Group,
} from '@statseeker/api/internal_api/entities';
import { Panel } from '@statseeker/components/Disclosure/Panel';
import EntityTypeAhead from '@statseeker/components/Legacy/EntityTypeAhead/EntityTypeAhead';
import {
   type ColumnDef,
   type SortEventPayload,
   SSDataTable,
} from '@statseeker/components/Legacy/SSDataTable';
import { useDebounce } from '@statseeker/hooks/useDebounce';
import { getDeviceGroups, getAllPollers } from '@statseeker/utils/apiOptions';
import { useQuery } from '@tanstack/react-query';
import { type SelectionEventSourceType } from 'ag-grid-community';
import { type ChangeEvent, useCallback, useEffect, useState, useMemo } from 'react';
import { devicesQueryOptions } from '~/lib/ReactQuery/queryOptions/deviceQueries';

const deviceColumns: ColumnDef[] = [
   { field: 'name', headerName: 'name', showTooltip: true },
   { field: 'ipaddress', headerName: 'IP Address', showTooltip: true },
   { field: 'ping_state', headerName: 'Ping State', columnSize: 'sm' },
   { field: 'snmp_state', headerName: 'Snmp State', columnSize: 'sm' },
   { field: 'poller_name', headerName: 'Poller', columnSize: 'sm' },
];

type DevicePanelProps = {
   devices?: string[] | undefined;
   groups?: string[] | undefined;
   isEdit?: boolean;
   poller?: { pollerID: number | undefined };
   onPollerChange: ({ poller }: { poller: PollerListItem | null }) => void;
   onChange: ({
      devices,
      groups,
   }: {
      devices: string[] | undefined;
      groups: string[] | undefined;
   }) => void;
};

export function RewalkDevicesPanel({ onChange, poller, onPollerChange, devices, isEdit = false }: DevicePanelProps) {
   return (
      <Panel title="Devices" className="panel-devices">
         <Flex gap={4} flexDir={'column'}>
            <Text>The following Devices will be included in the current rewalk process.</Text>
            <SpecificDevices poller={poller} onPollerChange={onPollerChange} onChange={onChange} devices={devices} isEdit={isEdit} />
         </Flex>
      </Panel>
   );
}

function SpecificDevices({ onPollerChange, poller, onChange, devices, isEdit }: DevicePanelProps) {
   const [filters, setFilters] = useState<DeviceFilter & { group_name?: string }>({
      dir: 'asc',
      sort: 'name',
   });

   const [text_filter, setTextFilter] = useState("");
   const { data, isSuccess } = useQuery(devicesQueryOptions.get({ ...filters, text_filter }));
   const [selectedIds, setSelectedIds] = useState<number[] | undefined | 'all'>([]);

   const sortSelectedData = useMemo(() => {
      if (!data) return [];
      if (!selectedIds || selectedIds === 'all') return data;

      const selectedSet = new Set(selectedIds);
      const selectedData = data.filter(d => selectedSet.has(d.id));
      const unselectedData = data.filter(d => !selectedSet.has(d.id));

      return [...selectedData, ...unselectedData];
   }, [data, selectedIds]);

   useEffect(() => {
      if (devices) {
         setSelectedIds(data?.filter(d => devices?.includes(d.name))?.map(d => d.id));
      } else {
         setSelectedIds(data?.map(d => d.id));
      }
   }, [isSuccess, data, isEdit, devices]);

   useEffect(() => {
      if (text_filter) {
         setSelectedIds(data?.map(d => d.id));
      }
   }, [data, text_filter]);

   useEffect(() => {
      setFilters((prev) => ({
         ...prev,
         snmp_poller_id: poller?.pollerID ? [poller.pollerID] : undefined
      }));
   }, [poller?.pollerID]);


   const handleSearchChange = useDebounce((event: ChangeEvent<HTMLInputElement>) => {
      setTextFilter(event.target.value);
   }, 500);

   const handleOnSortChange = useCallback(
      (data: SortEventPayload) => {
         const newFilters: DeviceFilter = {
            ...filters,
            sort: data.column,
            dir: data.order,
         };
         setFilters(newFilters);
      },
      [filters]
   );


   const computeDeviceSelection = useCallback(
      (selectedDevices?: Device[]): { devices: string[]; groups: string[] } => {
         if (!selectedDevices || selectedDevices.length === 0) {
            return { devices: [], groups: [] };
         }

         if (text_filter) {
            return {
               devices: selectedDevices.map((device) => device.name),
               groups: [],
            };
         }

         if (filters.group_id_filter && filters.group_name) {
            const allDevicesSelected = data && selectedDevices.length === data.length;

            if (allDevicesSelected) {
               return {
                  devices: [],
                  groups: [filters.group_name],
               };
            } else {
               return {
                  devices: selectedDevices.map((device) => device.name),
                  groups: [],
               };
            }
         }

         return {
            devices: selectedDevices.map((device) => device.name),
            groups: [],
         };
      },
      [text_filter, filters.group_id_filter, filters.group_name, data]
   );

   const handleDeviceSelectionChange = useCallback(
      (selectedDevices: Device[] | undefined, source: SelectionEventSourceType) => {
         if (source !== 'rowDataChanged') {

            const ids = selectedDevices?.map((device) => device.id);
            setSelectedIds(ids);

            const selection = computeDeviceSelection(selectedDevices);
            onChange(selection);
         }
      },
      [onChange, computeDeviceSelection]
   );

   const handleGroupSelectionChange = useCallback(
      (e: Group | null) => {
         if (e) {
            setFilters((prev) => ({
               ...prev,
               group_id_filter: Number(e?.id),
               group_name: e?.name,
            }));

         } else {
            setFilters((prev) => ({
               ...prev,
               group_id_filter: undefined,
               group_name: undefined,
            }));
         }

         onChange({
            devices: [],
            groups: [e?.name ?? ''],
         });
      },
      [onChange]
   );

   return (
      <>
         <Text>Select one or more Devices or Groups. All of the selected devices will be rewalked</Text>

         <Flex gap={2} alignItems={'center'}>

            <Input
               placeholder="Search Devices"
               backgroundColor={'white.500'}
               onChange={handleSearchChange}
               width='30%'
            />

            <Box width={'200px'}>
               <EntityTypeAhead<Group> entityQueryOption={getDeviceGroups} onChange={handleGroupSelectionChange} placeholder='Select Groups' />
            </Box>
            <Box width={'200px'}>
               <EntityTypeAhead<PollerListItem, never> entityQueryOption={getAllPollers} onChange={(e) => {
                  onPollerChange?.({ poller: e });

               }} placeholder='Select Pollers' />
            </Box>
         </Flex>

         <SSDataTable<Device>
            height="200px"
            rowSelectMode="checkbox"
            columns={deviceColumns}
            rowData={sortSelectedData}
            selectedRows={selectedIds}
            onSort={handleOnSortChange}
            onChange={handleDeviceSelectionChange}
            emptyMessage={
               isSuccess
                  ? data.length === 0
                     ? 'No Devices found'
                     : undefined
                  : 'An unknown error occurred'
            }
            sortCol={filters.sort}
            sortDir={filters.dir}
            rowIdKey="id"
         />
      </>
   );
}
