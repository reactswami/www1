import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { type FetchOAsWithPingServiceEnabledResponse, requests, updatePingPoller } from '~/api';
import { queryKeys, useToast } from '~/lib';

interface Props {
   isOpen: boolean;
   deviceSelectedCount: number;
   onClose: () => void;
   isAllSelected: boolean;
}

type Poller = FetchOAsWithPingServiceEnabledResponse['data'][number];

export const useAssignPingPoller = ({
   isOpen,
   deviceSelectedCount,
   onClose,
   isAllSelected,
}: Props) => {
   const toast = useToast();
   const [selectedPollers, setSelectedPollers] = useState<Poller[]>([]);
   const [defaultPoller, setDefaultPoller] = useState<Poller>({
      name: '',
      id: '',
   });

   const addPoller = (oa: Poller) => {
      const newPollers = [...selectedPollers, oa];
      setSelectedPollers([...selectedPollers, oa]);
      if (newPollers.length === 1) {
         setDefaultPoller(oa);
      }
   };

   const removePoller = (oa: Poller) => {
      const newPollers = selectedPollers.filter(({ name }) => name !== oa.name);
      setSelectedPollers(newPollers);
      if (newPollers.length === 0) {
         setDefaultPoller({ name: '', id: '' });
      }
   };

   const setPollerAsDefault = (oa: Poller) => {
      setDefaultPoller(oa);
   };

   const isPollerSelected = (oa: Poller) =>
      selectedPollers.map(({ name }) => name).includes(oa.name);

   const { data, isLoading, isError, isSuccess } = useQuery({
      queryKey: queryKeys.oa,
      queryFn: requests.getOAsWithPingEnabled,
      enabled: isOpen,
      select: (data) => data.data.filter(({ name }) => name), // Sometimes, the backend sends back corrupted data. We filter out the null values
   });

   const queryClient = useQueryClient();
   const { mutate: save, isPending: isSaving } = useMutation({
      mutationFn: updatePingPoller,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: queryKeys.device });
         toast({
            status: 'success',
            title: 'Pollers updated',
            description: 'The poller has been updated for the devices selected',
         });
         onClose();
      },
      onError: (err: Error) => {
         toast({
            status: 'error',
            title: 'Error',
            description: `We could not update the pollers for the selected devices. If the problem persists, please contact the support team.\n${err.message}`,
         });
      },
   });

   const getSelectedDeviceCountSentence = () => {
      const firstPart = isAllSelected
         ? 'All devices'
         : deviceSelectedCount > 1
         ? `The ${deviceSelectedCount} selected devices`
         : 'The device';
      return firstPart + ` will be ping-polled from the pollers that are selected below.`;
   };

   const sortedOasList = [...(data?.sort((a, b) => (a.name! < b.name ? 1 : -1)) ?? [])];

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
      getSelectedDeviceCountSentence,
   };
};
