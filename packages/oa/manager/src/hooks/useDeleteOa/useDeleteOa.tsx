import { useDisclosure } from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useFetchOrphanDevicesCount } from '../useFetchOrphanDevicesCount';
import { deleteOa } from '~/api';
import { toastMessages } from '~/config/messages';
import { queryKeys, useToast } from '~/lib';

interface Props {
   id: string;
   name: string;
}
export const useDeleteOa = (oa: Props) => {
   let name = '', id = '0';
   if (oa) {
      name = oa.name;
      id = oa.id;
   }
   const queryClient = useQueryClient();
   const toast = useToast();
   const { onClose, isOpen, onOpen } = useDisclosure();

   const {
      data: count,
      isLoading: isLoadingOrphanCount,
      refetch,
   } = useFetchOrphanDevicesCount({ oaName: name });

   const handleConfirm = async () => {
      await mutate();
      onClose();
   };

   useEffect(() => {
      if (!isOpen) {
         return;
      }
      refetch(); // Refetch every time it opens (unless cached)
   }, [isOpen, refetch]);

   const { isPending, mutate } = useMutation({
      mutationFn: () => deleteOa({ id: id }),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: queryKeys.all });
         toast(toastMessages.deleteOa.success(name));
      },
      onError: ({
         message
      }) => {
         toast(toastMessages.deleteOa.error(name, message));
      },
   });

   return {
      isPending,
      mutate,
      count,
      isLoadingOrphanCount,
      onClose,
      isOpen,
      onOpen,
      handleConfirm
   };
};
