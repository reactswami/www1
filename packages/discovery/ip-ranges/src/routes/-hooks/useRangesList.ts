import { type ColumnDef } from '@statseeker/components/Legacy/SSDataTable';
import { useToast } from '@statseeker/hooks/useToast';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useMemo } from 'react';
import { bulkUpdateRanges } from '~/api/ip_range_config';
import { queryClient } from '~/lib/ReactQuery';
import { type getRangesQueryParams, type BulkUpdateIpRangeData, type IpRangeListEntry } from '~/types/ipRange';


const ipRangeColumns: ColumnDef[] = [
   { field: 'name', headerName: 'name', showTooltip: true },
   { field: 'includesCount', headerName: 'includes', columnSize: 'sm' },
   { field: 'excludesCount', headerName: 'excludes', columnSize: 'sm' },
];


type getRangesToggleActionReturn = {
   toggleLabel: 'Disable' | 'Enable';
   rangeIdsToModify: number[];
};


/**
 * Logic to enable or disable the selected ip ranges
 * Case 1: If the selected ranges are all disabled then its toggled to enable
 * Case 2: If the selected ranges are all enabled then its toggled to disable
 * Case 3: If there is a mix of enabled and disabled ranges in the selection,
 * then toggle the disables ranges to be enabled
 */
const getRangesToggleAction = (data: IpRangeListEntry[], selectedIds: number[] | undefined): getRangesToggleActionReturn => {
   const disableLabel = 'Disable';
   const enableLabel = 'Enable';
   if (selectedIds?.length === 0) {
      return {
         toggleLabel: disableLabel,
         rangeIdsToModify: [],
      };
   }
   const selectedRanges = data?.filter((range) => selectedIds?.includes(range.id));
   const disabledRanges = selectedRanges.filter((range) => range?.enabled === 0);
   // Case 1
   if (disabledRanges.length === selectedRanges.length) {
      return {
         toggleLabel: enableLabel,
         rangeIdsToModify: disabledRanges.map((range) => (range.id)),
      };
   }
   // Case 2
   if (disabledRanges.length === 0) {
      return {
         toggleLabel: disableLabel,
         rangeIdsToModify: selectedRanges.map((range) => (range.id)),
      };
   }
   // Case 3
   return {
      toggleLabel: disableLabel,
      rangeIdsToModify: selectedRanges.filter((range) => range?.enabled === 1).map((range) => range.id),
   };
};


type useRangesListParams = {
   getRangesToModifyParams: getRangesQueryParams & { selectedIds?: number[] };
   data: IpRangeListEntry[];
   selectedIds: number[] | undefined;
};


export default function useRangesList({ getRangesToModifyParams, data, selectedIds }: useRangesListParams) {
   const navigate = useNavigate();
   const toast = useToast();

   const { toggleLabel, useToggleRanges } = useMemo(() => {
      const { toggleLabel, rangeIdsToModify } = getRangesToggleAction(data, selectedIds);

      const useToggleRanges = () =>
         useMutation({
            mutationKey: ['toggleRanges', getRangesToModifyParams],
            mutationFn: () => {
               const newData: BulkUpdateIpRangeData = {
                  enabled: toggleLabel === 'Enable' ? 1 : 0
               };
               return bulkUpdateRanges(getRangesToModifyParams, rangeIdsToModify, newData);
            },
            onSuccess: () => {
               queryClient.invalidateQueries();
               navigate({
                  to: '/',
                  search: (prev) => ({
                     ...prev,
                     selectedIds: getRangesToModifyParams?.selectedIds,
                  }),
               });
               toast({
                  title: 'Success',
                  description: `${toggleLabel}d the selected ranges`,
                  status: 'success',
               });
            },
            onError: ({ message }) => {
               queryClient.invalidateQueries();
               toast({
                  title: 'Error',
                  description: message,
                  status: 'error',
               });
            },
         });

      return {
         toggleLabel,
         useToggleRanges,
      };
   }, [data, selectedIds, getRangesToModifyParams, navigate, toast]);

   return {
      /** The column definitions for the IP Address Ranges list */
      ipRangeColumns,
      /** The action to take for selectedIds if the toggle button is clicked */
      toggleLabel,
      /** Hook to get the mutation for toggling the selected ranges */
      useToggleRanges,
   };
}
