import { Box, Flex, FormControl, Select, Button } from '@statseeker/components/Layout';
import { ChevronLeftIcon } from '@radix-ui/react-icons';
import { useEnumFields } from '@statseeker/api/internal_api';
import { type DiscoverExecuteOptions, executeDiscover } from '@statseeker/api/internal_api/entities';
import { AdminLayout, AdminPage } from '@statseeker/components';
import { FilterActions, type FilterGroup } from '@statseeker/components/FilterActions';
import { FormLabel } from '@statseeker/components/Legacy/Input/Label/Label';
import { Pagination } from '@statseeker/components/Legacy/Pagination';
import {
   type ColumnDef,
   ROWS_PER_PAGE,
   SSDataTable,
   type SortEventPayload,
} from '@statseeker/components/Legacy/SSDataTable';
import UserTypeahead from '@statseeker/components/Legacy/UserTypeAhead/UserTypeahead';
import { type ActionGroupConfig, createAction, MenuActions } from '@statseeker/components/MenuActions';
import { useToast } from '@statseeker/hooks';
import { useMutation, useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { Link, Outlet, createFileRoute, useNavigate } from '@tanstack/react-router';
import { type SelectionEventSourceType } from 'ag-grid-community';
import { useCallback, useEffect, useMemo, useRef, type ChangeEvent } from 'react';
import * as z from 'zod';
import { useStopDiscovery } from '~/hooks';
import { describeDiscoverHistoryQuery, discoverQueryOptions, getDiscoverHistoryByIdQuery, getDiscoverHistoryQuery } from '~/lib';
import { getDiscoverTaskQuery } from '~/lib/ReactQuery/queryOptions/discoverSchedule';
import { type DiscoveryHistoryList } from '~/types';
import { getModeDisplayName, getModeRoute } from '~/utils';

const HistorySchema = z.object({
   text_filter: z.string().optional(),
   selectedIds: z.union([z.array(z.number()), z.enum(['all'])]).optional(),
   discoverMode: z.array(z.string()).optional(),
   status: z.string().optional(),
   user: z.string().optional(),
   duration: z.string().optional(),
   finish: z.string().optional(),
   id: z.number().optional(),
   offset: z.number().optional(),
   limit: z.number().default(ROWS_PER_PAGE).optional(),
   sort: z.string().optional().default('finish'),
   dir: z.enum(['asc', 'desc']).optional().default('desc'),
   device: z.string().optional(),
   task_type: z.array(z.string()).optional(),
   task_name: z.string().optional(),
});

export const Route = createFileRoute('/history')({
   validateSearch: (search) => HistorySchema.parse(search),
   loaderDeps: ({
      search: {
         text_filter,
         offset,
         limit,
         sort = 'finish',
         dir = 'desc',
         discoverMode,
         status,
         user,
         finish,
         duration,
         device,
         task_type,
         task_name,
      },
   }) => ({
      discoverMode,
      status,
      user,
      finish,
      duration,
      text_filter,
      offset,
      limit,
      sort,
      dir,
      device,
      task_type,
      task_name,
   }),
   loader: (opts) => opts.context.queryClient.ensureQueryData(getDiscoverHistoryQuery(opts.deps)),
   staleTime: 0,
   component: DiscoverHistoryComponent,
});

const colDefs: ColumnDef[] = [
   { field: 'finish', headerName: 'Date', columnSize: 'lg' },
   {
      field: 'task_type',
      headerName: 'Type',
      columnSize: 'sm'
   },
   {
      field: 'task_name',
      headerName: 'Schedule Name',
      columnSize: 'sm'
   },
   {
      field: 'mode',
      columnSize: 'sm',
      valueFormatter: (item) => getModeDisplayName(item.value),
   },
   {
      field: 'duration',
      columnSize: 'sm',
   },
   {
      field: 'status',
      columnSize: 'sm',
      showTooltip: true,
   },
   {
      field: 'user',
   },
];

function DiscoverHistoryComponent() {
   const navigate = useNavigate();
   const search = Route.useSearch();
   const currentDiscover = useSuspenseQuery(
      discoverQueryOptions.currentDiscoverQueryOptions({ refetchInterval: 15000 })
   ).data;
   const discoveryInProgress = currentDiscover && Object.keys(currentDiscover).length > 0;

   const { data: discoverHistory } = useQuery(
      getDiscoverHistoryByIdQuery({ id: search?.selectedIds?.[0] as number, staleTime: discoveryInProgress ? 0 : Infinity })
   );

   const isDiscoverRunning = useMemo(() => discoverHistory?.data ? ['Failed', 'Success'].every(s => !discoverHistory?.data?.[0].status.startsWith(s)) : false, [discoverHistory?.data]);
   const discoveryHasSchedule = useMemo(() => Boolean(discoverHistory?.data?.[0]?.config?.api_task_id), [discoverHistory?.data]);
   const isModeManual = useMemo(() => Boolean(discoverHistory?.data?.[0]?.config?.mode === 'Manual'), [discoverHistory?.data]);
   const params = Route.useLoaderDeps();
   const { data: devicesWithCredentials } = useSuspenseQuery(
      getDiscoverHistoryQuery(params, isDiscoverRunning || discoveryInProgress ? 5000 : false)
   );
   const toast = useToast();
   const discoveryStarted = useRef(false);

   useEffect(() => {
      if (discoveryInProgress) {
         discoveryStarted.current = true;
      }

      if (!discoveryInProgress) {
         if (discoveryStarted.current === true) {
            navigate({
               search: (prev) => ({
                  ...prev,
                  selectedIds: undefined,
               }),
            });
            discoveryStarted.current = false;
         }
      }

   }, [discoveryInProgress, navigate]);

   const { stopDiscovery, isStopping } = useStopDiscovery(params);

   const {
      mutate: runNowMutation,
      isPending,
   } = useMutation({
      mutationFn: (options: DiscoverExecuteOptions) => executeDiscover(options),
      onSuccess: () => {
         navigate({
            to: '/current',
            search: true,
         });
      },
      onError: () => {
         toast({
            title: 'Error',
            description: 'Failed to start discovery',
            status: 'error',
         });
      },
   });

   const { data: describeData } = useQuery(describeDiscoverHistoryQuery());
   const dropdownFields = useEnumFields(describeData?.describe);
   const deviceName = search?.device;
   const scheduleResp = useQuery(getDiscoverTaskQuery({}));
   const discoverSchedules = scheduleResp.data;

   const onSort = useCallback(
      ({ column, order }: SortEventPayload) => {
         navigate({
            search: (prev) => ({
               ...prev,
               sort: column,
               dir: order,
            }),
         });
      },
      [navigate]
   );

   const onChangeUser = useCallback(
      (discoverUser: string) => {
         navigate({
            from: '/history',
            search: (prev) => ({
               ...prev,
               user: discoverUser ? discoverUser : undefined,
            }),
         });
      },
      [navigate]
   );

   const onTaskNameChange = useCallback(
      (event: ChangeEvent<HTMLSelectElement>) => {
         navigate({
            search: (prev) => ({
               ...prev,
               task_name: event.target.value ? event.target.value : undefined,
            }),
         });
      },
      [navigate]
   );

   const onPageChange = useCallback(
      (newOffSet: number) => {
         navigate({
            search: (prev) => ({
               ...prev,
               offset: newOffSet,
            }),
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
               selectedIds: undefined,
            }),
            replace: true,
         });
      },
      [navigate]
   );

   const title = `Discover My Network`;
   const discoveryTitle = deviceName ? `${title} - ${deviceName}` : title;
   const modes = useMemo(() => dropdownFields?.['mode']
      ?.filter((mode) => mode.label !== 'Hosts')
      ?.map((option) => ({
         label: getModeDisplayName(option.label),
         value: option?.label,
      })), [dropdownFields]);
   const filterGroups = useMemo<FilterGroup[]>(() => [
      {
         id: 'task_type',
         title: 'Discover Type',
         value: search?.task_type ?? [],
         options: [
            { label: 'Scheduled', value: 'Scheduled' },
            { label: 'Manual', value: 'Manual' },
         ],
      },
      {
         id: 'status',
         title: 'Discover Status',
         value: search?.status,
         options: [
            { label: 'Success', value: 'Success' },
            { label: 'Failed', value: 'Failed' },
         ],
      },
      {
         id: 'discoverMode',
         title: 'Discover Mode',
         value: search?.discoverMode ?? [],
         options: modes ?? [],
         visible: Boolean(dropdownFields && !deviceName),
      },
   ], [search?.task_type, search?.status, search?.discoverMode, dropdownFields, deviceName, modes]);

   const handleFilterChange = useCallback(
      (filterId: string, value: string | string[]) => {
         navigate({
            search: (prev) => ({
               ...prev,
               [filterId]: Array.isArray(value) && value?.length === 0 ? undefined : value || undefined,
               offset: undefined,
            }),
            replace: true,
         });
      },
      [navigate]
   );

   const handleResetFilters = useCallback(() => {
      navigate({
         search: (prev) => ({
            ...prev,
            task_type: undefined,
            status: undefined,
            discoverMode: undefined
         }),
         replace: true,
      });
   }, [navigate]);


   const appliedFiltersCount = [search.task_type?.length, search.status, search.discoverMode?.length].filter(Boolean).length;
   interface TaskActionContext {
      selectedIds: number[] | 'all' | undefined;
   }

   const actionContext = useMemo<TaskActionContext>(() => ({
      selectedIds: search?.selectedIds,
   }), [search.selectedIds]);

   const actionGroups = useMemo<ActionGroupConfig<TaskActionContext>[]>(() => [
      {
         title: 'General',
         actions: [
            createAction.link({
               key: 'view',
               label: 'View',
               from: '/history',
               to: '/progress/$id',
               params: { id: String(search?.selectedIds?.[0] ?? '') },
               search: { from: 'history' },
               disabled: (ctx) => ctx?.selectedIds === 'all' || (ctx?.selectedIds?.length ?? 0) > 1,
            }),
            createAction.menuItem({
               key: 'runNow',
               label: 'Run Now',
               onClick: () => {
                  if (!isPending && discoverHistory?.data?.[0]?.config) {
                     const options = { ...discoverHistory?.data?.[0]?.config };
                     if (options.api_task_id) {
                        options.api_task_id = Number(options.api_task_id);
                     }
                     runNowMutation(options);
                  }
               },
               disabled: (ctx) => ctx?.selectedIds === 'all' || (ctx?.selectedIds?.length ?? 0) > 1 || isModeManual,
               show: !discoveryInProgress,
            }),
            createAction.menuItem({
               key: 'stopDiscovery',
               label: isStopping ? 'Stopping' : 'Stop Discovery',
               variant: 'danger',
               loading: true,
               onClick: () => {
                  if (!isStopping) {
                     stopDiscovery();
                  }
               },
               disabled: (ctx) => ctx?.selectedIds === 'all' || (ctx?.selectedIds?.length ?? 0) > 1,
               show: discoveryInProgress,
            }),
            createAction.link({
               key: 'customize',
               label: 'Customize',
               to: getModeRoute({ config: discoverHistory?.data?.[0]?.config }),
               search: { from: 'history', hasSchedule: discoveryHasSchedule, scheduleId: discoverHistory?.data?.[0]?.config?.api_task_id ? Number(discoverHistory?.data?.[0]?.config?.api_task_id) : undefined },
               disabled: (ctx) => ctx.selectedIds === 'all' || (ctx?.selectedIds?.length ?? 0) > 1 || isDiscoverRunning || isModeManual,
            }),
         ],
      },
   ], [search?.selectedIds, discoveryInProgress, isStopping, isPending, stopDiscovery, runNowMutation, discoverHistory?.data, isDiscoverRunning, discoveryHasSchedule, isModeManual]);

   const handleSelection = useCallback(
      function handleSelection(data: DiscoveryHistoryList[] | undefined, eventSource: SelectionEventSourceType) {
         const selectedIds = data?.map((data) => data.id);
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
      },
      [navigate, search.selectedIds]
   );

   return (
      <AdminLayout
         title={discoveryTitle}
         subtitle="Recent Discoveries"
         customBackButtonComponent={
            <Link
               to={'/'}
               search={(prev) => ({
                  ...prev,
                  sort: undefined,
                  search: undefined,
                  selectedIds: undefined,
                  limit: undefined,
                  text_filter: undefined,
               })}
            >
               <Button variant="link" leftIcon={<ChevronLeftIcon />}>
                  Back to main menu
               </Button>
            </Link>
         }
      >
         <AdminPage className="discovery-history">
            <Flex
               className="header"
               paddingBottom="md"
               justifyContent="space-between"
               alignItems="flex-end"
               width="100%"
               gap={2}
               minW={600}
            >
               <Flex className="filters" gap={2}>
                  <Box mt={'3px'}>
                     <UserTypeahead onChange={onChangeUser} includeSystemUser onlyAdmins />
                  </Box>
                  {discoverSchedules && (
                     <Box>
                        <FormControl>
                           <FormLabel label="Schedule Name" whiteSpace="nowrap">
                              <Select
                                 defaultValue={search.task_name}
                                 size={'md'}
                                 minWidth={'100%'}
                                 onChange={onTaskNameChange}
                                 placeholder="Select..."
                              >
                                 {discoverSchedules?.data?.map((option) => (
                                    <option key={option.name} value={option.name}>
                                       {option.name}
                                    </option>
                                 ))}
                              </Select>
                           </FormLabel>
                        </FormControl>
                     </Box>
                  )}
               </Flex>
               <Flex alignItems={'center'} gap={2}>
                  <FilterActions
                     filterGroups={filterGroups}
                     onFilterChange={handleFilterChange}
                     onResetFilters={handleResetFilters}
                     appliedFiltersCount={appliedFiltersCount}
                  />
                  <MenuActions
                     groups={actionGroups}
                     context={actionContext}
                     button={{
                        label: 'Actions',
                        disabled: (ctx) =>
                           ctx?.selectedIds?.length === 0 || ctx?.selectedIds?.length === undefined,
                     }}
                  />
               </Flex >
            </Flex>
            <Flex flexGrow={1} minHeight={0} flexShrink={1} flexDirection={'column'}>
               <SSDataTable<DiscoveryHistoryList>
                  rowSelectMode="single"
                  columns={colDefs}
                  sortCol={search.sort}
                  sortDir={search.dir}
                  rowData={devicesWithCredentials.data}
                  selectedRows={search.selectedIds}
                  onChange={handleSelection}
                  height="100%"
                  onSort={onSort}
                  rowIdKey="id"
                  emptyMessage={
                     devicesWithCredentials.data.length === 0
                        ? 'No discover history found'
                        : 'Failed to find discover history'
                  }
               />
            </Flex>
            <Pagination
               totalCount={devicesWithCredentials?.data_total ?? 0}
               limit={search.limit !== undefined ? search.limit : ROWS_PER_PAGE}
               offset={search.offset}
               onPageChange={onPageChange}
               onLimitChange={handleLimitChange}
            />
            <Outlet />
         </AdminPage>
      </AdminLayout>
   );
}
