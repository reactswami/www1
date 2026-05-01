import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import {
   type FetchDevicePingPollersPayload,
   type FetchDevicePingPollersResponse,
   requests,
} from '~/api';
import { useToast } from '~/lib';
import * as ReactQuery from '~/lib/ReactQuery';

export const useFetchPingTableData = (
   params: FetchDevicePingPollersPayload,
   onSuccess: (data: FetchDevicePingPollersResponse) => void
) => {
   const toast = useToast();
   const query = useQuery({
      queryKey: ReactQuery.queryKeys.device,
      queryFn: async () => requests.getDevicesWithPingEnabled(params),
      select: (data) => ({
         data: data.data ?? [],
         total: data.data_total,
      }),
   });
   useEffect(() => {
      if (query.isSuccess) {
         onSuccess(query.data);
      }
   }, [query.isSuccess]);

   useEffect(() => {
      if (query.isError) {
         toast({
            status: 'error',
            title: 'Error',
            description: `We were unable to load the data. Please contact the support team if the problem persists.\n ${
               query.error?.message ?? ''
            }`,
         });
      }
   }, [query.isError]);

   return query;
};
