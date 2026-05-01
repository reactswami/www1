import {
   type ChakraProps,
   Skeleton,

} from '@chakra-ui/react';
import { FilterActions, type FilterGroup } from '@statseeker/components/FilterActions';
import { getStatusProps, useOaTableContext } from '~/features/Table';
export type StatusFilter = 'up' | 'down' | 'disabled';

export const TableStatusFilter = () => {
   const { isLoading, table } = useOaTableContext();
   const { setColumnFilters } = table;
   const { columnFilters } = table.getState();

   const status = (columnFilters.find(({ id }) => id === 'status')?.value ??
      []) as StatusFilter[];
   const services = (columnFilters.find(({ id }) => id === 'services')?.value ??
      []) as string[];
   const allStatus = ['up', 'down', 'disabled'] as StatusFilter[];

   const allServices = ['LTM', 'Ping', 'SNMP'] as unknown as StatusFilter[];

   const filtersAppliedCount = columnFilters
      .map(({ value }) => value)
      .flat().length;

   const getCircleColor = (status: StatusFilter): ChakraProps['color'] =>
      getStatusProps(status).circleColor;

   // Define filter groups configuration
   const filterGroups: FilterGroup[] = [
      {
         id: 'status',
         title: 'Status',
         type: 'checkbox',
         value: status,
         options: allStatus.map((option) => ({
            label: option,
            value: option,
            circleColor: getCircleColor(option),
            textTransform: 'capitalize',
         })),
      },
      {
         id: 'services',
         title: 'Services',
         type: 'checkbox',
         value: services,
         options: allServices.map((option) => ({
            label: option,
            value: option.toLowerCase(),
         })),
      },
   ];

   // Handle filter changes
   const handleFilterChange = (filterId: string, value: string | string[]) => {
      setColumnFilters([
         ...columnFilters.filter(({ id }) => id !== filterId),
         {
            id: filterId,
            value: value,
         },
      ]);
   };

   // Handle reset filters
   const handleResetFilters = () => {
      setColumnFilters([]);
   };

   return (
      <Skeleton isLoaded={!isLoading} alignSelf="flex-end">
         <FilterActions
            filterGroups={filterGroups}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            appliedFiltersCount={filtersAppliedCount}
            isLoading={isLoading}
         />
      </Skeleton>
   );
};
