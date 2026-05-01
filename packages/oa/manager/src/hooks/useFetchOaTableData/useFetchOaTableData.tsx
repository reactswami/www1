import { useQueries } from '@tanstack/react-query';
import { useMemo } from 'react';
import { type FetchAllOasResponse as FetchAllResponse, fetchAllOas, fetchAllOasInGroup } from '~/api/fetchAllOas';
import { POLLING_Oa_STATUS_INTERVAL_IN_MS } from '~/config/defaults';
import { queryKeys } from '~/lib';
import { type DeviceOa } from '~/types/models';

export interface TableRowData
   extends Omit<DeviceOa, 'title' | 'actions' | 'services' | 'latitude' | 'longitude'> {
   services: string[];
}

export const UseFetchOaTableData = (groupId?: number | null) => {
   const [allOas, oasIngroup] = useQueries({
      queries: [
         {
            queryKey: queryKeys.all,
            queryFn: fetchAllOas,
            refetchInterval: POLLING_Oa_STATUS_INTERVAL_IN_MS, // Polling the list of Oa
            select: (data: {
               data: FetchAllResponse;
            }) => formatDataForTableRow(data.data),
         },
         {
            // Use the dynamic groupId in the query key so it refetches when groupId changes
            queryKey: [...queryKeys.all, 'group', groupId],
            queryFn: () => fetchAllOasInGroup(groupId!),
            refetchInterval: POLLING_Oa_STATUS_INTERVAL_IN_MS, // Polling the list of Oa
            enabled: !!groupId // Only run this query when groupId is truthy
         }
      ]
   });

   const { data, isLoading, isError, isSuccess } = useMemo(() => {
      // When no groupId is selected, return all OAs
      if (!groupId) {
         return {
            data: allOas.data ?? [],
            isLoading: allOas.isLoading,
            isError: allOas.isError,
            isSuccess: allOas.isSuccess,
         };
      }

      // When groupId is selected, filter OAs by group
      const { data: groupData } = oasIngroup;

      const oas = allOas?.data?.filter(oa => groupData?.data?.some(e => e?.id === oa.id)) ?? [];

      return {
         data: oas,
         isLoading: allOas?.isLoading || oasIngroup?.isLoading,
         isError: allOas?.isError || oasIngroup?.isError,
         isSuccess: allOas?.isSuccess && oasIngroup?.isSuccess,
      };

   }, [allOas.data, allOas.isLoading, allOas.isError, allOas.isSuccess, oasIngroup.data, oasIngroup.isLoading, oasIngroup.isError, oasIngroup.isSuccess, groupId]);

   return { data, isLoading, isError, isSuccess };
};

const formatDataForTableRow = (rawOas: FetchAllResponse): TableRowData[] => {
   return rawOas.map((oa) => ({
      ...oa,
      services: oa?.services ? oa.services.split(',') : [], // Services are a comma separated list
   }));
};