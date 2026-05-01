import { Box, Flex, } from '@chakra-ui/react';
import { type PollerListItem, type SNMPEntityFilter } from '@statseeker/api/internal_api/entities';
import { GroupTypeahead, ObjectTypeahead } from '@statseeker/components';
import { FilterActions, type FilterGroup, type FilterContext } from '@statseeker/components/FilterActions';
import { GlobalSearch } from '@statseeker/components/GlobalSearch';
import withLabelEntity from '@statseeker/components/Legacy/EntityTypeAhead/withLabelEntity';
import { MenuActions, type ActionGroupConfig, createAction } from '@statseeker/components/MenuActions';
import { getAllPollers, isStatseekerServer } from '@statseeker/utils/apiOptions';

import { useNavigate, useSearch } from '@tanstack/react-router';
import { type ChangeEvent, useCallback } from 'react';
import { type SNMPEntityListItem } from '~/types/general';

// Define context type for SNMP entity filters
interface SNMPEntityFilterContext extends FilterContext {
   dataType: string;
}
const PollerList = withLabelEntity<PollerListItem>();

export function TableHeaderSNMPEntity({
   data,
   totalRows,
   openDisableModal,
   openEnableModal,
   openDeleteModal,
}: {
   data?: SNMPEntityListItem[];
   totalRows: number;
   openDisableModal: () => void;
   openEnableModal: () => void;
   openDeleteModal: () => void;
}) {
   const search = useSearch({ from: '/snmp_entities' });
   const navigate = useNavigate();

   const onTextFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
      navigate({
         search: (prev: SNMPEntityListItem) => ({
            ...prev,
            text_filter: event.target.value ? event.target.value : undefined,
            selectedIds: undefined,
            offset: undefined,
         }),
         replace: true,
      });
   };

   const handleGroupFilterChange = useCallback(
      (value: number | undefined) => {
         navigate({
            search: (prev: SNMPEntityListItem) => ({
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

   const handleDataTypeChange = useCallback(
      (dataType: string, title: string) => {
         navigate({
            search: (prev: SNMPEntityFilter) => ({
               ...prev,
               data_type: dataType,
               data_type_title: title,
               selectedIds: undefined,
               offset: undefined,
               poll: undefined,
               group_id_filter: undefined,
               text_filter: undefined,
               sort: undefined,
               dir: undefined,
            }),
            replace: true,
         });
      },
      [navigate]
   );

   const singleSelectedEntity = data?.filter((entity) => {
      if (search.selectedIds && search.selectedIds?.length === 1) {
         return entity.id === search.selectedIds[0];
      }
      return false;
   })[0];


   // Action Group Configuration   
   interface SNMPEntityActionContext {
      selectedIds: number[] | 'all' | undefined;
      entities: SNMPEntityListItem[] | undefined;
      singleEntity: SNMPEntityListItem | undefined;
   }

   const actionContext: SNMPEntityActionContext = {
      selectedIds: search.selectedIds,
      entities: data,
      singleEntity: singleSelectedEntity,
   };

   const actionGroups: ActionGroupConfig<SNMPEntityActionContext>[] = [
      {
         title: 'General',
         actions: [
            createAction.menuItem({
               key: 'enable',
               label: 'Enable',
               onClick: openEnableModal,
               // Show Enable only if single entity is NOT 'on' (i.e., it's 'off' or other status)
               show: (ctx) => {
                  const hasSelection = ctx.selectedIds && ctx.selectedIds.length > 0;
                  if (!hasSelection) return false;

                  // If single entity, check its poll status
                  if (ctx.singleEntity) {
                     return ctx.singleEntity.poll !== 'on';
                  }

                  // For multiple selections, always show
                  return true;
               },
            }),
            createAction.menuItem({
               key: 'disable',
               label: 'Disable',
               onClick: openDisableModal,
               // Show Disable only if single entity is NOT 'off' (i.e., it's 'on' or other status)
               show: (ctx) => {
                  const hasSelection = ctx.selectedIds && ctx.selectedIds.length > 0;
                  if (!hasSelection) return false;

                  // If single entity, check its poll status
                  if (ctx.singleEntity) {
                     return ctx.singleEntity.poll !== 'off';
                  }

                  // For multiple selections, always show
                  return true;
               },
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

   const handleFilterChange = useCallback(
      (filterId: string, value: string | string[]) => {
         navigate({
            search: (prev: SNMPEntityFilter) => ({
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
         search: (prev: SNMPEntityFilter) => ({
            ...prev,
            poll: undefined,
         }),
         replace: true,
      });
   }, [navigate]);

   // Create context for filter logic
   const filterContext: SNMPEntityFilterContext = {
      dataType: search.data_type || '',
   };

   // Define filter groups configuration
   const filterGroups: FilterGroup<SNMPEntityFilterContext>[] = [
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
         // Disable filter until data type is selected
         disabled: (ctx) => !ctx.dataType,
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

   const appliedFiltersCount = Number(!!search.poll);

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
               <Box>
                  <ObjectTypeahead
                     filter={(data) =>
                        data.filter(
                           (obj) =>
                              obj.poller === 'snmp' &&
                              !obj.inherits &&
                              !['cdt_device', 'cdt_port'].includes(obj.name)
                        )
                     }
                     showLabel={true}
                     onChange={handleDataTypeChange}
                     defaultValue={search.data_type}
                  />
               </Box>
               <GlobalSearch
                  resetKey={search.data_type}
                  onChange={onTextFilterChange}
                  defaultValue={search.text_filter}
                  disabled={!search.data_type}
                  placeholder='Search SNMP Entities'
                  label='Search SNMP Entities'
               />
               <Box>
                  <GroupTypeahead
                     key={search.data_type}
                     object_type={search.data_type}
                     showLabel={true}
                     onChange={handleGroupFilterChange}
                     disabled={!search.data_type}
                  />
               </Box>
               <Box width="200px">
                  <PollerList isDisabled={!search.data_type} entityQueryOption={getAllPollers} isMulti={true}
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
                  context={filterContext}
               />
               <Flex whiteSpace={'nowrap'}>
                  {`${search.selectedIds && search.selectedIds.length
                     ? search.selectedIds === 'all'
                        ? totalRows
                        : search.selectedIds.length
                     : 0
                     } entities selected`}
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
