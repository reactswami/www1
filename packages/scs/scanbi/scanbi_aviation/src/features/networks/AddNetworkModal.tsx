import { Heading } from '@chakra-ui/react';
import { SSModal } from '@statseeker/components/Layout/Modal';
import { useToast } from '@statseeker/hooks';
import { useMutation } from '@tanstack/react-query';
import { type AxiosError, type AxiosResponse } from 'axios';
import { createNetwork } from '~/api/networks/api';
import { NetworkForm } from '~/components';
import { toastMessages } from '~/config';
import { queryClient, queryKeys } from '~/lib';
import { type NewNetwork } from '~/types';

export function AddNetworkModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
   const toast = useToast();

   const { mutate: networkMutation, isPending: isMutating } = useMutation<
      AxiosResponse<unknown>,
      AxiosError,
      NewNetwork
   >({
      mutationFn: (newNetwork: NewNetwork) => createNetwork(newNetwork),
      onSuccess: (response, network) => {
         queryClient.invalidateQueries({ queryKey: queryKeys.scanner_network });
         onClose();
         toast(toastMessages.createEntity.success('Network', network.scannerNetworkTitle));
      },
      onError: ({ response: { data: { result: { msg } } } }: any, newNetwork) => {
         toast(toastMessages.createEntity.error('Network', msg));
      },
   });

   return (
      <SSModal
         isOpen={isOpen}
         onClose={onClose}
         isCentered
         closeOnOverlayClick={false}
         contentProps={{ maxWidth: '100vw', width: 'max-content', padding: 8 }}
         bodyProps={{ padding: 0 }}
      >
         <Heading>Add Network</Heading>
         <NetworkForm
            onSubmit={(data) => networkMutation(data)}
            isSubmitting={isMutating}
            onCancel={onClose}
            defaultValues={{ scannerNetworkType: 'RCC' }}
         />
      </SSModal>
   );
}
