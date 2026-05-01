import { Alert, AlertDescription, AlertIcon, Box, Flex, useDisclosure } from '@chakra-ui/react';
import { ChevronLeftIcon } from '@radix-ui/react-icons';
import { AdminLayout, AdminPage, Pagination, Button } from '@statseeker/components';
import OnlineIcon from '@statseeker/components/Legacy/OnlineIcon/OnlineIcon';
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
import { InterfaceFormModal } from '~/components/InterfaceFormModal/InterfaceFormModal';
import { TableHeaderInterfaces } from '~/components/TableHeaderInterfaces';
import { portQueryOptions } from '~/lib';
import { type PortListItem } from '~/types/general';

const InterfaceSchema = z.object({
   text_filter: z.string().optional(),
   sort: z.string().default('name').optional(),
   dir: z.enum(['asc', 'desc']).default('asc').optional(),
   selectedIds: z.union([z.array(z.number()), z.enum(['all'])]).optional(),
   ifAdminStatus: z.string().optional(),
   ifOperStatus: z.string().optional(),
   poller_state: z.string().optional(),
   poll: z.string().optional(),
   snmp_poller_id: z.array(z.number()).optional(),
   snmp_poller_status: z.string().optional(),
   isSelfPoller: z.boolean().optional(),
   group_id_filter: z.number().optional(),
   offset: z.number().optional(),
   limit: z.number().default(DEFAULT_PAGE_SIZE).optional(),
});

function pretty_speed(bps: number): string {
   let speed = bps;
   const valid_units = ['bps', 'Kbps', 'Mbps', 'Gbps', 'Tbps'];
   for (const units of valid_units) {
      if (speed < 1000 || units === valid_units[valid_units.length - 1]) {
         return `${parseFloat(speed.toFixed(2))} ${units}`;
      }
      speed /= 1000;
   }
   return `${bps} bps`;
}

const columns: ColumnDef[] = [
   {
      field: 'deviceName',
      headerName: 'Device Name',
      headerDescription: 'Name of the device that owns this interface',
      showTooltip: true,
   },
   {
      field: 'name',
      headerName: 'Interface Name',
      headerDescription: 'Name of the interface',
      showTooltip: true,
   },
   {
      field: 'ifTitle',
      headerName: 'Interface Title',
      showTooltip: true,
      headerDescription: 'Interface Title',
   },
   {
      field: 'ifDescr',
      headerName: 'Interface Description',
      showTooltip: true,
      headerDescription: 'Interface Description',
      minWidth: 180,
   },
   {
      field: 'ifSpeed',
      headerName: 'Speed',
      cellRenderer: (cell) => pretty_speed(cell.value),
      headerDescription: 'Interface Speed (based on ifSpeed or ifHighSpeed)',
      minWidth: 120,
   },
   {
      field: 'ifOutSpeed',
      headerName: 'Tx Speed',
      cellRenderer: (cell) => pretty_speed(cell.value),
      headerDescription: 'Interface Output Speed',
      minWidth: 120,
   },
   {
      field: 'ifInSpeed',
      headerName: 'Rx Speed',
      cellRenderer: (cell) => pretty_speed(cell.value),
      headerDescription: 'Interface Input Speed',
      minWidth: 120,
   },
   {
      field: 'poll',
      headerName: 'SNMP Poll',
      headerDescription: 'Whether SNMP polling is enabled for this interface',
      minWidth: 110,
   },
   {
      field: 'ifOperStatusPoll',
      headerName: 'Operational Status Poll',
      columnSize: 'lg',
      headerDescription: 'Whether operational status polling is enabled for this interface',
   },
   {
      field: 'ifOperStatus',
      headerName: 'Operational Status',
      columnSize: 'lg',
      cellRenderer: (cell) =>
         !cell.value || cell.data.ifOperStatusPoll === 'off' ? 'disabled' : cell.value,
      headerDescription: 'The current operational status',
   },
   {
      field: 'ifAdminStatusPoll',
      headerName: 'Administration Status Poll',
      headerDescription: 'Whether administration status polling is enabled for this interface',
      minWidth: 220,
   },
   {
      field: 'ifAdminStatus',
      headerName: 'Administration Status',
      cellRenderer: (cell) =>
         !cell.value || cell.data.ifAdminStatusPoll === 'off' ? 'disabled' : cell.value,
      headerDescription: 'The current administration status',
      minWidth: 220,
   },
   {
      field: 'ifNonUnicast',
      headerName: 'Non-Unicast Poll',
      columnSize: 'lg',
      cellRenderer: (cell) => (cell.value === 'global' ? 'default' : cell.value),
      headerDescription: 'NonUnicast Polling status of the port',
      minWidth: 160,
   },
   {
      field: 'idx',
      headerName: 'Interface Index',
      headerDescription: 'SNMP Index of the interface',
      showTooltip: true,
   },
   {
      field: 'if90day',
      headerName: 'Used',
      cellRenderer: (cell) => (
         <Box
            display={'flex'}
            alignItems={'center'}
            width={'100%'}
            height={'100%'}
            color={cell.value === 0 ? 'red.300' : 'green.500'}
         >
            <OnlineIcon />
         </Box>
      ),
      headerDescription: 'Status of port usage over 90 days',
      minWidth: 70,
   },
];

export const Route = createFileRoute('/interfaces')({
   validateSearch: (search) => InterfaceSchema.parse(search),
   loaderDeps: ({
      search: {
         text_filter,
         dir = 'asc',
         sort = 'deviceName',
         ifAdminStatus,
         ifOperStatus,
         poller_state,
         poll,
         snmp_poller_id,
         snmp_poller_status,
         isSelfPoller,
         group_id_filter,
         offset = 0,
         limit = ROWS_PER_PAGE,
      },
   }) => ({
      text_filter,
      dir,
      sort,
      ifAdminStatus,
      ifOperStatus,
      poller_state,
      poll,
      snmp_poller_id,
      snmp_poller_status,
      isSelfPoller,
      group_id_filter,
      offset,
      limit,
   }),
   component: InterfacesRoute,
});

function InterfacesRoute() {
   const {
      isOpen: showEditInterfaceModal,
      onOpen: openEditInterfaceModal,
      onClose: closeEditInterfaceModal,
   } = useDisclosure();
   const portData = useQuery(portQueryOptions.get(Route.useLoaderDeps()));
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
         data: PortListItem[] | undefined,
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
            navigate({
               search: (prev) => ({
                  ...prev,
                  selectedIds: selectedIds?.length
                     ? selectedIds
                     : search?.selectedIds?.length && eventSource === 'rowDataChanged'
                        ? search.selectedIds
                        : undefined,
               }),
               replace: true,
            });
         }
      },
      [navigate, search.selectedIds]
   );

   const toast = useToast();
   useEffect(() => {
      if (portData.error) {
         const msg = portData.error?.message.replace(
            /.*{text_filter_field} REGEXPI '(.*)'.*/,
            'Invalid regular expression: $1'
         );
         toast({ status: 'error', title: 'Error', description: msg });
      }
   }, [portData.error, toast]);

   const pageSize = () => search?.limit ?? DEFAULT_PAGE_SIZE;

   return (
      <AdminLayout
         title="Manage Devices"
         subtitle="Interfaces"
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
                  if (params.get('selected-ports')) {
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
         <AdminPage className="interfaces">
            <TableHeaderInterfaces
               totalRows={portData.data?.data_total ?? 0}
               openEditInterfaceModal={openEditInterfaceModal}
            />
            <Box position="relative" mb={4}>
               {(search &&
                  search.selectedIds &&
                  search.selectedIds.length === portData.data?.data.length &&
                  search.selectedIds.length < portData.data.data_total) ||
                  (search && search.selectedIds === 'all') ? (
                  <Alert status="info" justifyContent={'center'}>
                     <AlertIcon />
                     <AlertDescription>
                        All{' '}
                        {search.selectedIds === 'all'
                           ? `${portData.data?.data_total} rows are selected.`
                           : `${search.selectedIds.length} rows on this page are selected.`}{' '}
                        {search.selectedIds === 'all' ? (
                           <Link
                              className="select-all-link"
                              search={(prev) => ({ ...prev, selectedIds: undefined })}
                              replace
                           >
                              Clear selection
                           </Link>
                        ) : (portData.data?.data_total ?? 0) <= pageSize() ? null : (
                           <Link
                              className="select-all-link"
                              search={(prev) => ({ ...prev, selectedIds: 'all' })}
                              replace
                           >
                              Select all {portData.data?.data_total}
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
               <SSDataTable<PortListItem>
                  columns={columns}
                  rowData={portData.isFetching ? null : portData.error ? [] : portData.data?.data}
                  rowSelectMode="checkbox"
                  height="100%"
                  sortCol={search.sort}
                  sortDir={search.dir}
                  onSort={onSort}
                  emptyMessage={
                     portData.error ? 'Failed to find interfaces' : 'No interfaces found'
                  }
                  selectedRows={search.selectedIds}
                  rowIdKey="id"
                  rowClassRules={{
                     disabled: ({ data }: { data: PortListItem }) => data?.poll === 'off',
                  }}
                  onChange={handleSelection}
                  overflowY={'auto'}
               />
            </Flex>
            <Pagination
               limit={pageSize()}
               totalCount={portData.data?.data_total ?? 0}
               onPageChange={handlePageChange}
               offset={search.offset}
               onLimitChange={handleLimitChange}
            />
            <InterfaceFormModal
               isOpen={showEditInterfaceModal && Boolean(search.selectedIds)}
               onClose={closeEditInterfaceModal}
               selectedCount={
                  search.selectedIds === 'all'
                     ? portData.data?.data_total
                     : search.selectedIds?.length
               }
               selectedPorts={
                  search.selectedIds === 'all'
                     ? undefined
                     : portData.data?.data.filter(
                        (p) =>
                           Array.isArray(search.selectedIds) && search.selectedIds?.includes(p.id)
                     )
               }
               row={
                  Array.isArray(search.selectedIds) && search.selectedIds?.length === 1
                     ? portData.data?.data.find((port) => port.id === search.selectedIds?.[0])
                     : undefined
               }
            />
         </AdminPage>
      </AdminLayout>
   );
}
