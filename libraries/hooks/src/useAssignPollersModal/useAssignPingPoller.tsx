import { createApiFilter } from '@statseeker/api/internal_api';
import { useToast } from '@statseeker/hooks';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLayoutEffect, useState } from 'react';
import {
   type FetchOAsWithPingServiceEnabledResponse,
   type UpdatePingPollerPayload,
   fetchOAsWithPingServiceEnabled,
   updatePingPoller,
} from './api';

export interface Props {
   isOpen: boolean;
   selectedDevices: number[];
   onClose: () => void;
   isAllSelected: boolean;
   queryKey?: string[];
   globalFilter?: string;
   groupFilter?: number;
   preselectedPollers?: (Poller & { isDefault?: boolean; isExceeded?: boolean })[];
   pollerFilter?: string[];
   exceedFilter?: boolean;
}

export type Poller = FetchOAsWithPingServiceEnabledResponse['data'][number];

/* This hook contains the business logic to fetch the list of pollers, (un)select pollers and finally save the configuration */
export const useAssignPingPoller = ({
   isOpen,
   onClose,
   selectedDevices,
   isAllSelected,
   queryKey = [],
   groupFilter,
   globalFilter,
   preselectedPollers = [],
   exceedFilter,
   pollerFilter,
}: Props) => {
   useLayoutEffect(() => {
      setSelectedPollers(preselectedPollers);
      const defaultPoller = preselectedPollers.find(({ isDefault }) => isDefault);
      return defaultPoller && setDefaultPoller(defaultPoller);
   }, [preselectedPollers]);

   const toast = useToast();
   const queryClient = useQueryClient();
   const [selectedPollers, setSelectedPollers] = useState<Poller[]>([]);
   const [defaultPoller, setDefaultPoller] = useState<Poller>({
      poll: 'off',
      name: '',
      id: '',
   });

   /* Add a poller (to device(s)) */
   const addPoller = (oa: Poller) => {
      const newPollers = [...selectedPollers, oa];
      setSelectedPollers(newPollers);
      // If it's the only poller, set is as the default poller
      if (newPollers.length === 1) {
         setDefaultPoller(oa);
      }
   };

   /* Remove a poller (from device(s))*/
   const removePoller = (oa: Poller) => {
      const newPollers = selectedPollers.filter(({ name }) => name !== oa.name);
      setSelectedPollers(newPollers);
      if (newPollers.length === 0) {
         // If the poller list is empty, set the default poller to 'null'
         setDefaultPoller({ name: '', id: '', poll: 'off' });
      } else if (oa.id === defaultPoller.id) {
         // If the poller removed was the default poller, set the default poller to the next one in line.
         setDefaultPoller(newPollers[0]);
      }
   };

   /* Set the default poller */
   const setPollerAsDefault = (oa: Poller) => {
      setDefaultPoller(oa);
   };

   /* Utility to check if a poller is selected */
   const isPollerSelected = (oa: Poller) =>
      selectedPollers.map(({ name }) => name).includes(oa.name);

   /* Fetching the list of available pollers */
   const { data, isLoading, isError, isSuccess } = useQuery({
      queryKey,
      queryFn: fetchOAsWithPingServiceEnabled,
      enabled: isOpen,
      select: (response) => response.data.filter(({ name }) => name), // In under certain conditions, the backend sends back corrupted data. We filter out the null values
   });

   /* API call to save the new pollers configuration (for the device(s)) */
   const { mutate, isPending: isSaving } = useMutation({
      mutationFn: updatePingPoller,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey });
         toast({
            status: 'success',
            title: 'Pollers updated',
            description:
               'The poller has been updated for the devices selected. It can take up to a minute to appear in the list',
         });
         onClose();
      },
      onError: (response: any) => {
         toast({
            status: 'error',
            title: 'Error',
            description: `We could not update the pollers for the selected devices. If the problem persists, please contact the support team.
               \n ${response?.data?.message ?? ''}`,
         });
      },
   });

   /* Wrapper around the API call to build the right payload (depending on filters, selection) */
   const save = () => {
      const payload: UpdatePingPollerPayload = isAllSelected
         ? {
              devices: [],
              pollers: selectedPollers.map((poller) => poller.name),
              default_poller: defaultPoller.name,
              search_query: globalFilter,
              post_filter: buildPostFilter(),
              group_filter: groupFilter,
              use_filters: 1,
           }
         : {
              devices: selectedDevices,
              pollers: selectedPollers.map((poller) => poller.name),
              default_poller: defaultPoller.name,
              use_filters: 0,
           };
      mutate(payload);
   };

   function buildPostFilter() {
      const postFilters: string[] | undefined = [];
      if (exceedFilter) {
         postFilters.push('{hasExceeded} = 1');
      }
      if (pollerFilter && pollerFilter.length > 0) {
         const filters = pollerFilter
            .map((filter) => createApiFilter('enabledPollersName', 'REGEXP', `(^|,)${filter}(,|$)`))
            .join(' AND ');
         postFilters.push(filters);
      }
      if (postFilters.length > 0) {
        return postFilters.join(' AND ');
      }

      return undefined;
   }

   const sortedOasList = [...(data?.sort((a, b) => (a.name < b.name ? 1 : -1)) ?? [])];

   return {
      isLoading,
      isError,
      isSuccess,
      defaultPoller,
      setPollerAsDefault,
      oaList: sortedOasList,
      selectedPollers,
      addPoller,
      removePoller,
      isPollerSelected,
      isSaving,
      save,
   };
};
