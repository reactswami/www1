import { Flex, Button, Box, } from '@chakra-ui/react';
import { ChevronLeftIcon } from '@radix-ui/react-icons';
import { type DiscoverExecuteOptions, type PollerListItem, type Task } from '@statseeker/api/internal_api/entities';
import { AdminLayout, AdminPage, ErrorBoundary } from '@statseeker/components';
import { FilterActions, type FilterGroup } from '@statseeker/components/FilterActions';
import EntityTypeAhead from '@statseeker/components/Legacy/EntityTypeAhead/EntityTypeAhead';
import GlobalFilterInput from '@statseeker/components/Legacy/GlobalFilterInput/GlobalFilterInput';
import { Pagination } from '@statseeker/components/Legacy/Pagination';
import { DEFAULT_PAGE_SIZE } from '@statseeker/components/Legacy/Pagination/defaults';
import { SSDataTable, type SortEventPayload } from '@statseeker/components/Legacy/SSDataTable';
import { MenuActions, type ActionGroupConfig, createAction } from '@statseeker/components/MenuActions';
import { useDebounce, useToast } from '@statseeker/hooks';
import { getAllPollers } from '@statseeker/utils/apiOptions';
import { useQuery } from '@tanstack/react-query';
import { Link, Outlet, createFileRoute, useNavigate } from '@tanstack/react-router';
import { type SelectionEventSourceType } from 'ag-grid-community';
import { useCallback, useEffect, useMemo } from 'react';
import * as z from 'zod';
import scheduleColDefs from './-components/schedule/components/scheduleColDefs';
import useDisableSchedule from './-components/schedule/hooks/useDisableSchedule';
import useFormActions from './-components/schedule/hooks/useFormActions';
import { getDiscoverTaskQuery } from '~/lib';
import { getModeRoute, validateDuplicateSchedule } from '~/utils';

const withErrorBoundary = (WrappedComponent: any) => {
   return () => {
      return (
         <ErrorBoundary errorMessage={'Failed to load schedules, contact the administrator'}>
            <WrappedComponent />
         </ErrorBoundary>
      );
   };
};

const ScheduleSchema = z.object({
   text_filter: z.string().optional(),
   name: z.string().optional(),
   mode: z.string().optional(),
   enabled: z.string().optional(),
   poller_status: z.string().optional(),
   poller_name: z.string().optional(),
   id: z.number().optional(),
   offset: z.number().optional(),
   limit: z.number().default(DEFAULT_PAGE_SIZE).optional(),
   sort: z.string().optional().default('name'),
   dir: z.enum(['asc', 'desc']).optional().default('asc'),
   selectedIds: z.union([z.array(z.number()), z.enum(['all'])]).optional(),
});

export const Route = createFileRoute('/schedule')({
   validateSearch: (search) => ScheduleSchema.parse(search),
   loaderDeps: ({
      search: { text_filter, offset, limit, sort = 'name', dir = 'asc', enabled, name, mode, poller_status, poller_name },
   }) => ({
      text_filter,
      offset,
      limit,
      sort,
      dir,
      enabled,
      name,
      mode,
      poller_status,
      poller_name
   }),
   //loader: (opts) => opts.context.queryClient.ensureQueryData(getDiscoverTaskQuery(opts.deps)),
   staleTime: 0,
   component: withErrorBoundary(DiscoverScheduleComponent),
});

function DiscoverScheduleComponent() {
   const scheduleResp = useQuery(getDiscoverTaskQuery(Route.useLoaderDeps()));
   const discoverSchedules = scheduleResp.data;

   const navigate = useNavigate();
   const search = Route.useSearch();

   const onTextFilterChange = useDebounce((text: string | undefined) => {
      navigate({
         search: (prev) => ({
            ...prev,
            text_filter: text ? text : undefined,
            selectedIds: undefined,
            offset: undefined,
            poller_status: undefined,
            enabled: undefined
         }),
         replace: true,
      });
   }, 500);

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

   const onPageChange = useCallback(
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

   const handleSelection = useCallback(
      function handleSelection(data: Task[] | undefined, eventSource: SelectionEventSourceType) {
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

   const selectedTask = useMemo(
      () => discoverSchedules?.data?.filter(task => task.id === search?.selectedIds?.[0])?.[0],
      [discoverSchedules?.data, search?.selectedIds]);


   const toast = useToast();
   const { disableScheduleMutation } = useDisableSchedule({ enabled: 1 });

   const handleEnableSchedule = useCallback(async () => {
      for (const id of search?.selectedIds as number[]) {
         const task = discoverSchedules?.data.find((task) => task.id === id);
         const msg = await validateDuplicateSchedule(id, task?.time);
         if (msg) {
            toast({
               title: 'Error',
               description: msg,
               status: 'error',
               duration: 5000,
               isClosable: true,
            });
            return;
         }
      }
      await disableScheduleMutation.mutate({ id: search?.selectedIds as number[] });
   }, [disableScheduleMutation, discoverSchedules, toast, search]);

   const {
      displayScheduleEditForm,
      displayDeleteScheduleForm,
      displayDisableScheduleForm,
      displayScheduleCopyForm,
      editDisclosure,
      copyDisclosure,
      deleteDisclosure,
      disableDisclosure,
   } = useFormActions();

   const handleFilterChange = useCallback(
      (filterId: string, value: string | string[]) => {
         navigate({
            search: (prev) => ({
               ...prev,
               [filterId]: value || undefined,
               selectedIds: undefined,
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
            poller_status: undefined,
            enabled: undefined
         }),
         replace: true,
      });
   }, [navigate]);

   const canEnable = useCallback(() => {
      const selectedTask =
         search?.selectedIds && search?.selectedIds.length > 0
            ? discoverSchedules?.data.filter(
               (data) =>
                  search?.selectedIds &&
                  search?.selectedIds.length > 0 &&
                  data.id === search?.selectedIds[0]
            )
            : undefined;
      return selectedTask !== undefined && selectedTask.length > 0
         ? selectedTask[0].enabled === 0
         : false;
   }, [search?.selectedIds, discoverSchedules]);

   useEffect(() => {
      if (scheduleResp.error) {
         toast({
            title: 'Error',
            description: scheduleResp.error.message,
            status: 'error',
            duration: 5000,
            isClosable: true,
         });
      }
   }, [scheduleResp.error, toast]);

   const pageSize = useMemo(() => search?.limit ?? DEFAULT_PAGE_SIZE, [search?.limit]);

   interface TaskActionContext {
      selectedIds: number[] | 'all' | undefined;
   }

   const actionContext: TaskActionContext = {
      selectedIds: search.selectedIds,
   };

   const actionGroups: ActionGroupConfig<TaskActionContext>[] = [
      {
         title: 'General',
         actions: [
            createAction.menuItem({
               key: 'copy',
               label: 'Copy',
               onClick: copyDisclosure.onOpen,
               disabled: (ctx) => ctx.selectedIds === 'all' || (ctx?.selectedIds?.length ?? 0) > 1,
            }),
            createAction.link({
               key: 'edit',
               label: 'Edit',
               to: getModeRoute({ config: selectedTask?.commands?.[0]?.options as DiscoverExecuteOptions }),
               from: '/schedule',
               search: { from: 'schedule', scheduleId: search?.selectedIds?.[0] },
               disabled: (ctx) => ctx.selectedIds === 'all' || (ctx?.selectedIds?.length ?? 0) > 1,
            }),
            createAction.menuItem({
               key: 'edit-schedule',
               label: 'Edit Schedule',
               onClick: editDisclosure.onOpen,
               disabled: (ctx) => ctx.selectedIds === 'all' || (ctx?.selectedIds?.length ?? 0) > 1,
            }),
            createAction.menuItem({
               key: 'enable',
               label: 'Enable Schedule',
               onClick: handleEnableSchedule,
               show: (ctx) => (ctx?.selectedIds?.length ?? 0) > 0 && canEnable(),
            }),
            createAction.menuItem({
               key: 'disable',
               label: 'Disable Schedule',
               onClick: disableDisclosure.onOpen,
               show: (ctx) => (ctx?.selectedIds?.length ?? 0) > 0 && !canEnable(),
            }),
            createAction.menuItem({
               key: 'delete',
               label: 'Delete',
               onClick: deleteDisclosure.onOpen,
               variant: 'danger',
            }),
         ],
      },
   ];

   // Define filter groups configuration
   const filterGroups: FilterGroup<Task>[] = [
      {
         id: 'enabled',
         title: 'Task State',
         type: 'radio',
         value: String(search?.enabled),
         options: [
            { label: 'Enabled', value: '1' },
            { label: 'Disabled', value: '0' },
         ],
      },
      {
         id: 'poller_status',
         title: 'Poller Status',
         type: 'radio',
         value: search?.poller_status,
         options: [{ state: 'up', color: 'green.500' }, { state: 'down', color: 'red.300' }, { state: 'disabled', color: 'orange.300' },].map(({ state, color }: { state: string; color: string }) => ({
            label: state,
            value: state,
            circleColor: color,
            textTransform: 'capitalize',
         })),
      },
   ];

   const appliedFiltersCount = Number(!!search.enabled) + Number(!!search.poller_status);

   const onPollerChange = useCallback((e: PollerListItem | null | undefined) => {
      navigate({
         search: (prev) => ({
            ...prev,
            poller_name: e?.name,
         }),
         replace: true,
      });
   }, [navigate]);


   return (
      <AdminLayout
         title={'Discover My Network'}
         subtitle="Discover Configurations"
         customBackButtonComponent={
            <Link
               to={'/'}
               search={(prev) => ({
                  ...prev,
                  sort: undefined,
                  selectedIds: undefined,
                  enabled: undefined,
                  limit: undefined,
                  name_filter: undefined,
                  offset: undefined,
                  task_enabled: undefined,
                  poller_name: undefined
               })}
            >
               <Button variant="link" leftIcon={<ChevronLeftIcon />}>
                  Back to main menu
               </Button>
            </Link>
         }
      >
         {displayScheduleCopyForm(search?.selectedIds as number[])}
         {displayScheduleEditForm(search?.selectedIds as number[])}
         {displayDeleteScheduleForm(search?.selectedIds)}
         {displayDisableScheduleForm(search?.selectedIds as number[])}
         <AdminPage className="discovery-schedules">
            <Flex
               className="header"
               paddingBottom="md"
               justifyContent="space-between"
               alignItems="flex-end"
               width="100%"
               gap={2}
               minW={600}
            >
               <Flex className="filters" gap={2} alignItems={'flex-end'}>
                  <GlobalFilterInput
                     label={'Search'}
                     defaultValue={search.text_filter}
                     onChange={onTextFilterChange}
                     width="30ch"
                  />
                  <Box width={'200px'}>
                     <EntityTypeAhead<PollerListItem> entityQueryOption={getAllPollers} onChange={onPollerChange} label='Pollers' placeholder='Select...' />
                  </Box>
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
                           ctx.selectedIds?.length === 0 || ctx.selectedIds?.length === undefined,
                     }}
                  />
               </Flex >
            </Flex>
            <Flex flexGrow={1} minHeight={0} flexShrink={1} flexDirection={'column'}>
               <SSDataTable<Task>
                  rowSelectMode="checkbox"
                  columns={scheduleColDefs}
                  sortCol={search.sort}
                  sortDir={search.dir}
                  rowData={
                     scheduleResp.isFetching
                        ? null
                        : scheduleResp.isError
                           ? []
                           : discoverSchedules?.data
                  }
                  height="100%"
                  onSort={onSort}
                  onChange={handleSelection}
                  rowIdKey="id"
                  selectedRows={search.selectedIds}
                  emptyMessage={
                     scheduleResp.isError
                        ? 'Failed to find discover schedules'
                        : 'No discover schedules found'
                  }
               />
            </Flex>
            <Pagination
               totalCount={discoverSchedules?.data_total ?? 0}
               limit={pageSize}
               offset={search.offset}
               onPageChange={onPageChange}
               onLimitChange={handleLimitChange}
            />
            <Outlet />
         </AdminPage>
      </AdminLayout>
   );
}
