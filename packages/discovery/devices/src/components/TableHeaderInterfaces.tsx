import { Box, Flex, } from '@chakra-ui/react';
import { type PollerListItem } from '@statseeker/api/internal_api/entities';
import { GroupTypeahead } from '@statseeker/components';
import { FilterActions, type FilterGroup } from '@statseeker/components/FilterActions';
import { GlobalSearch } from '@statseeker/components/GlobalSearch';
import withLabelEntity from '@statseeker/components/Legacy/EntityTypeAhead/withLabelEntity';
import { MenuActions, type ActionGroupConfig, presetActions } from '@statseeker/components/MenuActions';
import { getAllPollers, isStatseekerServer } from '@statseeker/utils/apiOptions';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useCallback, type ChangeEvent } from 'react';

const PollerList = withLabelEntity<PollerListItem>();

export function TableHeaderInterfaces({
   totalRows,
   openEditInterfaceModal,
}: {
   totalRows: number;
   openEditInterfaceModal: () => void;
}) {
   const search = useSearch({
      from: '/interfaces',
   });

   const navigate = useNavigate({ from: '/interfaces' });

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
      function handleGroupFilterChange(value: number | undefined) {
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

   // Action Group Configuration   
   interface InterfaceActionContext {
      selectedIds: number[] | 'all' | undefined;
   }

   const actionContext: InterfaceActionContext = {
      selectedIds: search.selectedIds,
   };

   const actionGroups: ActionGroupConfig<InterfaceActionContext>[] = [
      {
         title: 'General',
         actions: [
            presetActions.edit(openEditInterfaceModal),
         ],
      },
   ];

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
            ifAdminStatus: undefined,
            ifOperStatus: undefined,
            poll: undefined,
         }),
         replace: true,
      });
   }, [navigate]);

   // Define filter groups configuration
   const filterGroups: FilterGroup[] = [
      {
         id: 'ifAdminStatus',
         title: 'Administration Status',
         type: 'radio',
         value: search.ifAdminStatus ?? '',
         options: [
            { label: 'up', value: 'up', },
            { label: 'down', value: 'down' },
            { label: 'disabled', value: 'disabled' },
         ],
      },
      {
         id: 'ifOperStatus',
         title: 'Operational Status',
         type: 'radio',
         value: search.ifOperStatus ?? '',
         options: [
            { label: 'up', value: 'up' },
            { label: 'down', value: 'down' },
            { label: 'disabled', value: 'disabled' },
         ],
      },
      {
         id: 'poll',
         title: 'SNMP Poll',
         type: 'radio',
         value: search.poll ?? '',
         options: [
            { label: 'on', value: 'on' },
            { label: 'off', value: 'off' },
            { label: 'exceeded', value: 'exceeded' },
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

   const appliedFiltersCount =
      Number(!!search.ifAdminStatus) +
      Number(!!search.ifOperStatus) +
      Number(!!search.poll);

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
                  placeholder='Search Interfaces'
                  label='Search Interfaces'
               />
               <Box>
                  <GroupTypeahead
                     object_type="cdt_port"
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
                  {search.selectedIds === 'all' ? totalRows : search.selectedIds?.length ?? 0}{' '}
                  selected of {totalRows}
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
               </Box>
            </Flex>
         </Flex>
      </Flex>
   );
}
