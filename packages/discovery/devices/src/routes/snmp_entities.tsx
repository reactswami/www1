import { Alert, AlertDescription, AlertIcon, Box, Flex, useDisclosure } from '@chakra-ui/react';
import { type SNMPEntityFilter } from '@statseeker/api/internal_api/entities';
import { AdminLayout, AdminPage, Pagination } from '@statseeker/components';
import { DEFAULT_PAGE_SIZE } from '@statseeker/components/Legacy/Pagination/defaults';
import {
   ROWS_PER_PAGE,
   type SortEventPayload,
   SSDataTable,
} from '@statseeker/components/Legacy/SSDataTable';
import { useToast } from '@statseeker/hooks';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { type SelectionEventSourceType } from 'ag-grid-community';
import { useCallback, useEffect } from 'react';
import * as z from 'zod';
import { TableHeaderSNMPEntity, ConfirmModalSNMPEntities } from '~/components';
import { SNMPEntityQueryOptions } from '~/lib';
import { type SNMPEntityListItem } from '~/types/general';

const SNMPEntitySchema = z.object({
   data_type: z.string().optional(),
   data_type_title: z.string().optional(),
   text_filter: z.string().optional(),
   sort: z.string().default('device').optional(),
   dir: z.enum(['asc', 'desc']).default('asc').optional(),
   selectedIds: z.union([z.array(z.number()), z.enum(['all'])]).optional(),
   poller_state: z.string().optional(),
   snmp_poller_id: z.array(z.number()).optional(),
   snmp_poller_status: z.string().optional(),
   isSelfPoller: z.boolean().optional(),
   poll: z.string().optional(),
   group_id_filter: z.number().optional(),
   offset: z.number().optional(),
   limit: z.number().default(ROWS_PER_PAGE).optional(),
});

export const Route = createFileRoute('/snmp_entities')({
   validateSearch: (search) => SNMPEntitySchema.parse(search),
   loaderDeps: ({
      search: {
         data_type,
         data_type_title,
         text_filter,
         dir = 'asc',
         sort = 'device',
         poll,
         snmp_poller_status,
         snmp_poller_id,
         isSelfPoller,
         group_id_filter,
         offset = 0,
         limit = ROWS_PER_PAGE,
      },
   }) => ({
      data_type,
      data_type_title,
      text_filter,
      dir,
      sort,
      poll,
      snmp_poller_status,
      snmp_poller_id,
      isSelfPoller,
      group_id_filter,
      offset,
      limit,
   }),
   component: SNMPEntity,
});

function SNMPEntity() {
   const disableModal = useDisclosure();
   const enableModal = useDisclosure();
   const deleteModal = useDisclosure();
   const entityResp = useQuery(SNMPEntityQueryOptions.get(Route.useLoaderDeps()));
   const search = Route.useSearch();
   const columnResp = useQuery(SNMPEntityQueryOptions.getColumns(search?.data_type));
   const navigate = useNavigate();
   const toast = useToast();

   const isLoading = entityResp.isFetching || columnResp.isFetching;
   const isError = entityResp.isError || columnResp.isError;
   const entities = entityResp.data;
   const columns = columnResp.data ?? [];

   const checkOpenModal = useCallback(
      (fn: () => void) => {
         const selectedEntities = entities?.data.filter(
            (entity) => Array.isArray(search.selectedIds) && search.selectedIds?.includes(entity.id)
         );
         if (selectedEntities?.find((entity) => entity.deviceRetired === 'on')) {
            toast({
               status: 'error',
               title: 'Error',
               description: `Cannot enable ${search.data_type_title} entities on retired devices.`,
            });
         } else if (selectedEntities?.find((entity) => entity.devicePoll === 'off')) {
            toast({
               status: 'error',
               title: 'Error',
               description: `Cannot enable ${search.data_type_title} entities on disabled devices.`,
            });
         } else if (selectedEntities?.find((entity) => String(entity.idx).endsWith('~'))) {
            toast({
               status: 'error',
               title: 'Error',
               description: `Cannot enable ${search.data_type_title} entities where entity has been disabled via Custom Data Ranges.`,
            });

         } else {
            fn();
         }
      },
      [entities, toast, search]
   );

   const onSort = useCallback(
      ({ column, order }: SortEventPayload) => {
         navigate({
            search: (prev: SNMPEntityFilter) => ({
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
            search: (prev: SNMPEntityFilter) => ({
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
         data: SNMPEntityListItem[] | undefined,
         eventSource: SelectionEventSourceType
      ) {
         const selectedIds = data?.map((data) => data.id);
         if (eventSource === 'apiSelectAll' || eventSource === 'uiSelectAll') {
            navigate({
               search: (prev: SNMPEntityFilter) => ({
                  ...prev,
                  selectedIds: selectedIds?.length ? 'all' : undefined,
               }),
               replace: true,
            });
         } else {
            navigate({
               search: (prev: SNMPEntityFilter) => ({
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

   useEffect(() => {
      if (entityResp.error) {
         const msg = entityResp.error?.message.replace(
            /.*{text_filter_field} REGEXPI '(.*)'.*/,
            'Invalid regular expression: $1'
         );
         toast({ status: 'error', title: 'Error', description: msg });
      }
      if (columnResp.error) {
         toast({
            status: 'error',
            title: 'Error',
            description: 'Error fetching data. See logs for details',
         });
      }
   }, [columnResp.error, entityResp.error, toast]);
   const pageSize = () => search?.limit ?? DEFAULT_PAGE_SIZE;

   return (
      <AdminLayout title="Manage Devices" subtitle="SNMP Entity Management" backButtonLink="/">
         <AdminPage className="manageDevices">
            <TableHeaderSNMPEntity
               data={entities?.data}
               totalRows={entities?.data_total ?? 0}
               openDisableModal={disableModal.onOpen}
               openEnableModal={() => checkOpenModal(enableModal.onOpen)}
               openDeleteModal={deleteModal.onOpen}
            />
            <Box position="relative" mb={4}>
               {(search &&
                  search.selectedIds &&
                  search.selectedIds.length === entities?.data.length &&
                  search.selectedIds.length < entities.data_total) ||
                  (search && search.selectedIds === 'all') ? (
                  <Alert status="info" justifyContent={'center'}>
                     <AlertIcon />
                     <AlertDescription>
                        All{' '}
                        {search.selectedIds === 'all'
                           ? `${entities?.data_total} rows are selected.`
                           : `${search.selectedIds.length} rows on this page are selected.`}{' '}
                        {search.selectedIds === 'all' ? (
                           <Link
                              className="select-all-link"
                              search={(prev: SNMPEntityFilter) => ({
                                 ...prev,
                                 selectedIds: undefined,
                              })}
                              replace
                           >
                              Clear selection
                           </Link>
                        ) : (entities?.data_total ?? 0) <= pageSize() ? null : (
                           <Link
                              className="select-all-link"
                              search={(prev: SNMPEntityFilter) => ({ ...prev, selectedIds: 'all' })}
                              replace
                           >
                              Select all {entities?.data_total}
                           </Link>
                        )}
                     </AlertDescription>
                  </Alert>
               ) : null}
            </Box>
            <Flex flexGrow={1} minHeight={0} flexShrink={1} flexDirection={'column'}>
               <SSDataTable<SNMPEntityListItem>
                  columns={columns}
                  rowData={isLoading ? null : isError ? [] : entities?.data}
                  rowSelectMode="checkbox"
                  height="100%"
                  sortCol={search.sort}
                  sortDir={search.dir}
                  onSort={onSort}
                  emptyMessage={
                     search.data_type
                        ? isError
                           ? 'Failed to find entities'
                           : 'No entities found'
                        : 'Select a data type'
                  }
                  selectedRows={search.selectedIds}
                  rowIdKey="id"
                  rowClassRules={{
                     disabled: ({ data }: { data: SNMPEntityListItem }) => data?.poll === 'off',
                  }}
                  onChange={handleSelection}
                  overflowY={'auto'}
               />
            </Flex>
            <Pagination
               limit={pageSize()}
               totalCount={entities?.data_total ?? 0}
               onPageChange={handlePageChange}
               offset={search.offset}
               onLimitChange={handleLimitChange}
            />
            {search.data_type && search.data_type_title && (
               <>
                  <ConfirmModalSNMPEntities
                     isOpen={disableModal.isOpen}
                     onClose={disableModal.onClose}
                     mode="disable"
                     selectedCount={
                        search.selectedIds === 'all'
                           ? entities?.data_total
                           : search.selectedIds?.length
                     }
                  />
                  <ConfirmModalSNMPEntities
                     isOpen={enableModal.isOpen}
                     onClose={enableModal.onClose}
                     mode="enable"
                     selectedCount={
                        search.selectedIds === 'all'
                           ? entities?.data_total
                           : search.selectedIds?.length
                     }
                  />
                  <ConfirmModalSNMPEntities
                     isOpen={deleteModal.isOpen}
                     onClose={deleteModal.onClose}
                     mode="delete"
                     selectedCount={
                        search.selectedIds === 'all'
                           ? entities?.data_total
                           : search.selectedIds?.length
                     }
                  />
               </>
            )}
         </AdminPage>
      </AdminLayout>
   );
}
