import {
   Alert,
   AlertDescription,
   AlertIcon,
   Box,
   Flex,
   HStack,
   Tag,
   Tooltip,
   useDisclosure,
} from '@chakra-ui/react';
import { ChevronLeftIcon } from '@radix-ui/react-icons';
import { AdminLayout, AdminPage, Button, Pagination } from '@statseeker/components';
import { DEFAULT_PAGE_SIZE } from '@statseeker/components/Legacy/Pagination/defaults';

import {
   type ColumnDef,
   ROWS_PER_PAGE,
   type SortEventPayload,
   SSDataTable,
} from '@statseeker/components/Legacy/SSDataTable';
import { useToast } from '@statseeker/hooks';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { type SelectionEventSourceType } from 'ag-grid-community';
import { useCallback, useEffect } from 'react';
import * as z from 'zod';
import { ConfirmModal, AssignPollerModal, TableHeaderDevice } from '~/components';
import { DynamicDeviceFormModal } from '~/components/DynamicDeviceFormModal/DynamicDeviceFormModal';
import { deviceQueryOptions } from '~/lib';
import { type DeviceListItem } from '~/types/general';

declare global {
   interface Window {
      change_page: (url: string, name: string) => void;
   }
}

const DeviceSchema = z.object({
   text_filter: z.string().optional(),
   sort: z.string().default('name').optional(),
   dir: z.enum(['asc', 'desc']).default('asc').optional(),
   selectedIds: z.union([z.array(z.number()), z.enum(['all'])]).optional(),
   ping_state: z.string().optional(),
   snmp_state: z.string().optional(),
   snmp_poller_id: z.array(z.number()).optional(),
   snmp_poller_status: z.string().optional(),
   group_id_filter: z.number().optional(),
   isSelfPoller: z.boolean().optional(),
   offset: z.number().optional(),
   limit: z.number().default(DEFAULT_PAGE_SIZE).optional(),
});
const columns: ColumnDef[] = [
   {
      field: 'name',
      headerName: 'Device Name',
      headerDescription: 'The name of the device',
      showTooltip: true,
   },
   {
      field: 'hostname',
      headerName: 'Host Name',
      headerDescription: 'The hostname of the device',
      showTooltip: true,
   },
   {
      field: 'ipaddress',
      headerName: 'IP Address',
      headerDescription: 'The IP address of the device',
      showTooltip: true,
   },
   {
      field: 'region',
      headerName: 'Region',
      headerDescription: 'The region of the device',
      showTooltip: true,
   },
   {
      field: 'site',
      headerName: 'Site',
      headerDescription: 'The site location of the device',
      showTooltip: true,
   },
   {
      field: 'sysLocation',
      headerName: 'Location',
      headerDescription: 'The physical location of the device',
      showTooltip: true,
   },
   {
      field: 'latitude',
      headerName: 'Latitude',
      cellRenderer: (cell) => cell.value || '',
      headerDescription: 'The latitude of the device',
      minWidth: 110,
   },
   {
      field: 'longitude',
      headerName: 'Longitude',
      cellRenderer: (cell) => cell.value || '',
      headerDescription: 'The longitude of the device',
      minWidth: 110,
   },
   {
      field: 'ping_state.state',
      headerName: 'Ping State',
      cellRenderer: (cell) =>
         !cell.value || cell.data.ping_poll === 'off' ? 'disabled' : cell.value,
      headerDescription: 'The current ping state of the device from the default poller',
      minWidth: 110,
   },
   {
      field: 'ping_poll',
      headerName: 'Ping Poll',
      headerDescription: 'Whether ping polling is enabled for this device',
      minWidth: 110,
   },
   {
      field: 'lastPingStateChange.state_time',
      headerName: 'Last Ping Change',
      headerDescription: 'The last time the ping state changed',
      columnSize: 'lg',
   },
   {
      field: 'snmp_state.state',
      headerName: 'SNMP State',
      cellRenderer: (cell) =>
         !cell.value || cell.data.snmp_poll === 'off' ? 'disabled' : cell.value,
      headerDescription: 'The current SNMP state of the device from the default poller',
      minWidth: 110,
   },
   {
      field: 'snmp_poll',
      headerName: 'SNMP Poll',
      headerDescription: 'Whether SNMP polling is enabled for this device',
      minWidth: 110,
   },
   {
      field: 'lastSNMPStateChange.state_time',
      headerName: 'Last SNMP Change',
      headerDescription: 'The last time the SNMP state changed',
      columnSize: 'lg',
   },
   {
      field: 'snmp_maxoid',
      headerName: 'SNMP Max OIDs',
      headerDescription: 'Maximum number of oids to poll in a single request',
      minWidth: 140,
   },
   {
      field: 'snmp_credential_name',
      headerName: 'SNMP Credential',
      headerDescription: 'The SNMP credentials currently used to poll the device',
      showTooltip: true,
   },
   {
      field: 'sysDescr',
      headerName: 'Description',
      minWidth: 300,
      flex: 1,
      showTooltip: true,
      headerDescription: 'Full system description of the device',
   },
   {
      field: 'snmp_poller',
      headerName: 'SNMP Poller',
      headerDescription: 'The name of the SNMP poller for this device',
      minWidth: 170,
      showTooltip: true,
   },
   {
      field: 'default_poller',
      headerName: 'Default Ping Poller',
      headerDescription: 'The name of the default ping poller for this device',
      minWidth: 170,
      showTooltip: true,
   },
   {
      field: 'pollers',
      headerName: 'Ping Pollers',
      minWidth: 300,
      cellRenderer: (cell) => {
         return (
            <Box display={'flex'} alignItems={'center'} width={'100%'} height={'100%'}>
               <HStack gap="xxs">
                  {cell.value?.split(',').length > 0 ? (
                     cell.value.split(',').length > 3 || cell.value.length > 24 ? (
                        <Tooltip label={cell.value.split(',').join(', ')}>
                           {`${cell.value.split(',').length} Pollers`}
                        </Tooltip>
                     ) : (
                        cell.value.split(',').map((poller: string) => (
                           <Tag key={poller} size="sm">
                              {poller}
                           </Tag>
                        ))
                     )
                  ) : (
                     '-'
                  )}
               </HStack>
            </Box>
         );
      },
      headerDescription: 'The list of ping pollers for this device',
   },
];

export const Route = createFileRoute('/devices')({
   validateSearch: (search) => DeviceSchema.parse(search),
   loaderDeps: ({
      search: {
         text_filter,
         dir = 'asc',
         sort = 'name',
         ping_state,
         snmp_poller_status,
         snmp_poller_id,
         isSelfPoller,
         snmp_state,
         group_id_filter,
         offset = 0,
         limit = ROWS_PER_PAGE,
      },
   }) => ({
      text_filter,
      dir,
      sort,
      ping_state,
      snmp_state,
      snmp_poller_status,
      snmp_poller_id,
      isSelfPoller,
      group_id_filter,
      offset,
      limit,
   }),
   component: DevicesRoute,
});

function DevicesRoute() {
   const {
      isOpen: showRetireModal,
      onOpen: openRetireModal,
      onClose: closeRetireModal,
   } = useDisclosure();
   const {
      isOpen: showDeleteModal,
      onOpen: openDeleteModal,
      onClose: closeDeleteModal,
   } = useDisclosure();
   const {
      isOpen: showEditDeviceModal,
      onOpen: openEditDeviceModal,
      onClose: closeEditDeviceModal,
   } = useDisclosure();
   const {
      isOpen: showMoveDevicesModal,
      onOpen: openMoveDevicesModal,
      onClose: closeMoveDevicesModal,
   } = useDisclosure();
   const deviceData = useQuery(deviceQueryOptions.get(Route.useLoaderDeps()));
   const search = Route.useSearch();
   const navigate = useNavigate();

   const onSort = useCallback(
      ({ column, order }: SortEventPayload) => {
         navigate({
            search: (prev) => ({
               ...prev,
               sort: column,
               dir: order ?? 'asc',
               selectedIds: undefined,
            }),
            replace: true,
         });
      },
      [navigate]
   );

   const handlePageChange = useCallback(
      function handlePageChange(newOffset: number) {
         navigate({
            search: (prev) => ({
               ...prev,
               offset: newOffset,
               selectedIds: undefined,
            }),
            replace: true,
         });
      },
      [navigate]
   );

   const handleLimitChange = useCallback(
      function handleLimitChange(newLimit: number) {
         navigate({
            search: (prev) => ({
               ...prev,
               limit: newLimit,
               offset: 0,
               selectedIds: undefined,
            }),
            replace: true,
         });
      },
      [navigate]
   );

   const handleSelection = useCallback(
      function handleSelection(
         data: DeviceListItem[] | undefined,
         eventSource: SelectionEventSourceType
      ) {
         const selectedIds = data?.map((data) => data.id);
         if (eventSource === 'apiSelectAll' || eventSource === 'uiSelectAll') {
            navigate({
               search: (prev) => ({
                  ...prev,
                  selectedIds: selectedIds?.length ? 'all' : undefined,
               }),
               replace: true,
            });
         } else {
            if (eventSource !== 'rowDataChanged') {
               navigate({
                  search: (prev) => ({
                     ...prev,
                     selectedIds: selectedIds?.length ? selectedIds : undefined,
                  }),
                  replace: true,
               });
            }
         }
      },
      [navigate]
   );

   const toast = useToast();
   useEffect(() => {
      if (deviceData.error) {
         const msg = deviceData.error?.message.replace(
            /.*{text_filter_field} REGEXPI '(.*)'.*/,
            'Invalid regular expression: $1'
         );
         toast({ status: 'error', title: 'Error', description: msg });
      }
   }, [deviceData.error, toast]);
   const pageSize = () => search?.limit ?? DEFAULT_PAGE_SIZE;

   return (
      <AdminLayout
         title="Manage Devices"
         subtitle="Devices"
         customBackButtonComponent={
            <Button
               variant="link"
               leftIcon={<ChevronLeftIcon />}
               onClick={() => {
                  const url =
                     window?.parent.parent.document.querySelectorAll('iframe')[0]?.contentDocument
                        ?.documentURI ?? '';

                  const parsedUrl = new URL(url);
                  const params = new URLSearchParams(parsedUrl.search);
                  if (params.get('selected-devices')) {
                     window.parent.change_page(
                        '/cgi/admin_tool?mode=html&page=discovery-devices',
                        'Manage Devices'
                     );
                  } else {
                     navigate({ to: '/', search: true });
                  }
               }}
            >
               {'Back to Main Menu'}
            </Button>
         }
      >
         <AdminPage className="deleteRetiredDevices">
            <TableHeaderDevice
               data={deviceData.data?.data}
               totalRows={deviceData.data?.data_total ?? 0}
               openDeleteModal={openDeleteModal}
               openRetireModal={openRetireModal}
               openEditDeviceModal={openEditDeviceModal}
               openMoveDevicesModal={openMoveDevicesModal}
            />
            <Box position="relative" mb={4}>
               {(search &&
                  search.selectedIds &&
                  search.selectedIds.length === deviceData.data?.data.length &&
                  search.selectedIds.length < deviceData.data?.data_total) ||
                  (search && search.selectedIds === 'all') ? (
                  <Alert status="info" justifyContent={'center'}>
                     <AlertIcon />
                     <AlertDescription>
                        All{' '}
                        {search.selectedIds === 'all'
                           ? `${deviceData.data?.data_total} rows are selected.`
                           : `${search.selectedIds.length} rows on this page are selected.`}{' '}
                        {search.selectedIds === 'all' ? (
                           <Link
                              className="select-all-link"
                              search={(prev) => ({ ...prev, selectedIds: undefined })}
                              replace
                           >
                              Clear selection
                           </Link>
                        ) : (deviceData.data?.data_total ?? 0) <= pageSize() ? null : (
                           <Link
                              className="select-all-link"
                              search={(prev) => ({ ...prev, selectedIds: 'all' })}
                              replace
                           >
                              Select all {deviceData.data?.data_total}
                           </Link>
                        )}
                     </AlertDescription>
                  </Alert>
               ) : null}
            </Box>
            <Flex
               flexGrow={1}
               minHeight={0}
               flexShrink={1}
               flexDirection={'column'}
               pos={'relative'}
            >
               <SSDataTable<DeviceListItem>
                  columns={columns}
                  rowData={
                     deviceData.isFetching ? null : deviceData.isError ? [] : deviceData.data?.data
                  }
                  rowSelectMode="checkbox"
                  height="100%"
                  sortCol={search.sort}
                  sortDir={search.dir}
                  onSort={onSort}
                  emptyMessage={deviceData.isError ? 'Failed to find devices' : 'No devices found'}
                  selectedRows={search.selectedIds}
                  rowIdKey="id"
                  onChange={handleSelection}
                  rowClassRules={{
                     disabled: ({ data }: { data: DeviceListItem }) => data?.retired !== 'off',
                  }}
                  overflowY={'auto'}
               />
            </Flex>
            <Pagination
               limit={pageSize()}
               totalCount={deviceData.data?.data_total ?? 0}
               onPageChange={handlePageChange}
               offset={search.offset}
               onLimitChange={handleLimitChange}
            />
            <ConfirmModal
               isOpen={showDeleteModal}
               onClose={closeDeleteModal}
               mode="delete"
               selectedDevices={
                  search.selectedIds === 'all' || search.selectedIds === undefined
                     ? []
                     : search.selectedIds
               }
            />
            <ConfirmModal
               isOpen={showRetireModal}
               onClose={closeRetireModal}
               mode="retire"
               selectedDevices={
                  search.selectedIds === 'all' || search.selectedIds === undefined
                     ? []
                     : search.selectedIds
               }
            />

            <AssignPollerModal isOpen={showMoveDevicesModal && Boolean(search.selectedIds)}
               onClose={closeMoveDevicesModal}
               selectedCount={
                  search.selectedIds === 'all'
                     ? deviceData.data?.data_total
                     : search.selectedIds?.length
               }
               row={
                  Array.isArray(search.selectedIds) && search.selectedIds?.length === 1
                     ? deviceData.data?.data.find((device) => device.id === search.selectedIds?.[0])
                     : undefined
               } />

            <DynamicDeviceFormModal
               isOpen={showEditDeviceModal && Boolean(search.selectedIds)}
               onClose={closeEditDeviceModal}
               selectedCount={
                  search.selectedIds === 'all'
                     ? deviceData.data?.data_total
                     : search.selectedIds?.length
               }
               selectedDevices={
                  search.selectedIds === 'all'
                     ? undefined
                     : deviceData.data?.data.filter(
                        (dev) =>
                           Array.isArray(search.selectedIds) &&
                           search.selectedIds?.includes(dev.id)
                     )
               }
               row={
                  Array.isArray(search.selectedIds) && search.selectedIds?.length === 1
                     ? deviceData.data?.data.find((device) => device.id === search.selectedIds?.[0])
                     : undefined
               }
            />
         </AdminPage>
      </AdminLayout>
   );
}
