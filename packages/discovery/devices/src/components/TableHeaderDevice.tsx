import { Box, Flex, } from '@chakra-ui/react';
import { type PollerListItem } from '@statseeker/api/internal_api/entities';
import { GroupTypeahead } from '@statseeker/components';
import { FilterActions, type FilterGroup } from '@statseeker/components/FilterActions';
import { GlobalSearch } from '@statseeker/components/GlobalSearch';
import withLabelEntity from '@statseeker/components/Legacy/EntityTypeAhead/withLabelEntity';
import { MenuActions, type ActionGroupConfig, createAction } from '@statseeker/components/MenuActions';
import { getAllPollers, isStatseekerServer } from '@statseeker/utils/apiOptions';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useCallback, type ChangeEvent } from 'react';
import { type DeviceListItem } from '~/types/general';

const PollerList = withLabelEntity<PollerListItem>();

export function TableHeaderDevice({
   data,
   totalRows,
   openRetireModal,
   openDeleteModal,
   openEditDeviceModal,
   openMoveDevicesModal
}: {
   data?: DeviceListItem[];
   totalRows: number;
   openRetireModal: () => void;
   openDeleteModal: () => void;
   openEditDeviceModal: () => void;
   openMoveDevicesModal: () => void;
}) {
   const search = useSearch({
      from: '/devices',
   });
   const navigate = useNavigate();

   const onTextFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
      navigate({
         search: (prev) => ({
            ...prev,
            text_filter: event.target.value ? event.target.value : undefined,
            selectedIds: undefined,
            offset: undefined,
         }),
         replace: true,
      });
   };

   const handleGroupFilterChange = useCallback(
      function handleStateChange(value: number | undefined) {
         navigate({
            search: (prev) => ({
               ...prev,
               group_id_filter: value ? value : undefined,
               selectedIds: undefined,
               offset: undefined,
            }),
            replace: true,
         });
      },
      [navigate]
   );

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
            ping_state: undefined,
            snmp_state: undefined,
         }),
         replace: true,
      });
   }, [navigate]);

   interface DeviceActionContext {
      selectedIds: number[] | 'all' | undefined;
   }

   const isSingleDevice = search.selectedIds?.length === 1;
   const device = data?.find((device) => {
      if (search.selectedIds && search.selectedIds?.length === 1) {
         return device.id === search.selectedIds[0];
      }
      return false;
   });
   const actionContext: DeviceActionContext = {
      selectedIds: search.selectedIds,
   };

   const actionGroups: ActionGroupConfig<DeviceActionContext>[] = [
      {
         title: 'General',
         actions: [
            createAction.menuItem({
               key: 'edit',
               label: 'Edit',
               onClick: openEditDeviceModal,
               disabled: (ctx) => !ctx.selectedIds || ctx.selectedIds.length === 0,
            }),
            createAction.menuItem({
               key: 'move',
               label: 'Assign Pollers',
               onClick: openMoveDevicesModal,
            }),
            createAction.menuItem({
               key: 'retire',
               label: 'Retire',
               onClick: openRetireModal,
               disabled: isSingleDevice && device?.retired === 'on',
            }),
            createAction.menuItem({
               key: 'delete',
               label: 'Delete',
               onClick: openDeleteModal,
               variant: 'danger',
            }),
         ],
      },
   ];

   // Define filter groups configuration
   const filterGroups: FilterGroup[] = [
      {
         id: 'ping_state',
         title: 'Ping State',
         type: 'radio',
         value: search.ping_state ?? '',
         options: [
            { label: 'up', value: 'up' },
            { label: 'down', value: 'down' },
            { label: 'disabled', value: 'disabled' },
            { label: 'poller down', value: 'poller_down' },
         ],
      },
      {
         id: 'snmp_state',
         title: 'SNMP State',
         type: 'radio',
         value: search.snmp_state ?? '',
         options: [
            { label: 'up', value: 'up' },
            { label: 'down', value: 'down' },
            { label: 'disabled', value: 'disabled' },
         ],
      },
      {
         id: 'snmp_poller_status',
         title: 'Poller State',
         type: 'radio',
         disabled: search?.isSelfPoller,
         value: search.snmp_poller_status ?? '',
         options: [
            { label: 'up', value: 'up' },
            { label: 'down', value: 'down' },
            { label: 'disabled', value: 'disabled' },
         ],
      },
   ];

   const appliedFiltersCount = Number(!!search.snmp_state) + Number(!!search.ping_state);

   const handlePollerChange = useCallback(
      (e: PollerListItem[] | null) => {
         navigate({
            search: (prev) => ({
               ...prev,
               snmp_poller_id: (e?.length ?? 0) > 0 ? e?.map(d => d.deviceid) : undefined,
               selectedIds: undefined,
               offset: undefined,
               isSelfPoller: e?.some(p => isStatseekerServer(p))
            }),
            replace: true,
         });
      },
      [navigate]
   );

   return (
      <Flex flexDir={'column'}>
         <Flex
            gap={2}
            justifyContent={'space-between'}
            alignItems={'flex-end'}
            position={'sticky'}
            top={'0'}
            zIndex={5}
            backgroundColor={'page.500'}
            paddingBottom="md"
         >
            <Flex alignItems={'center'} gap={2}>
               <GlobalSearch
                  onChange={onTextFilterChange}
                  defaultValue={search.text_filter}
                  placeholder='Search Devices'
                  label='Search Devices'
               />
               <Box>
                  <GroupTypeahead
                     object_type="cdt_device"
                     showLabel={true}
                     onChange={(groupId) => handleGroupFilterChange(groupId)}
                  />
               </Box>
               <Box width="200px">
                  <PollerList entityQueryOption={getAllPollers} isMulti={true}
                     onChange={handlePollerChange}
                  />
               </Box>
            </Flex>
            <Flex alignItems={'center'} gap={2}>
               <FilterActions
                  filterGroups={filterGroups}
                  onFilterChange={handleFilterChange}
                  onResetFilters={handleResetFilters}
                  appliedFiltersCount={appliedFiltersCount}
               />
               <Flex whiteSpace={'nowrap'}>
                  {`${search.selectedIds && search.selectedIds.length
                     ? search.selectedIds === 'all'
                        ? totalRows
                        : search.selectedIds.length
                     : 0
                     } devices selected`}
               </Flex>
               <Box>
                  <MenuActions
                     groups={actionGroups}
                     context={actionContext}
                     button={{
                        label: 'Actions',
                        disabled: (ctx) =>
                           ctx.selectedIds?.length === 0 || ctx.selectedIds?.length === undefined,
                     }}
                  />
               </Box >
            </Flex >
         </Flex >
      </Flex >
   );
}
