import {
   Heading,
   Modal,
   ModalBody,
   ModalCloseButton,
   ModalContent,
   ModalOverlay,
} from '@chakra-ui/react';
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
      onError: (
         {
            response: {
               // @ts-ignore
               data: {
                  result: { msg },
               },
            },
         },
         newNetwork
      ) => {
         toast(toastMessages.createEntity.error('Network', msg));
      },
   });

   function handleFormSubmit(data: NewNetwork) {
      networkMutation(data);
   }

   return (
      <Modal isOpen={isOpen} isCentered onClose={onClose} closeOnOverlayClick={false}>
         <ModalOverlay />
         <ModalContent maxWidth={'100vw'} width={'max-content'} padding={8}>
            <ModalCloseButton onClick={onClose} />
            <ModalBody padding={0}>
               <Heading>Add Network</Heading>
               <NetworkForm
                  onSubmit={handleFormSubmit}
                  isSubmitting={isMutating}
                  onCancel={onClose}
                  defaultValues={{ scannerNetworkType: 'RCC' }}
               />
            </ModalBody>
         </ModalContent>
      </Modal>
   );
}
