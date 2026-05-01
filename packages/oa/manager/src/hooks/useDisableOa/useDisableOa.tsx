import { useDisclosure } from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type TableRowData } from '../useFetchOaTableData';
import { toggleDisableOa } from '~/api/toggleDisableOa';
import { toastMessages } from '~/config/messages';
import { queryKeys, useToast } from '~/lib';

interface Props {
   oa: TableRowData;
}
export const useDisableOa = ({ oa }: Props) => {
   const queryClient = useQueryClient();
   const toast = useToast();
   const isDisabled = oa?.poll === 'off';
   const { onClose, isOpen, onOpen } = useDisclosure();

   const { isPending, mutate } = useMutation({
      mutationFn: ({ shouldEnable }: { shouldEnable: boolean }) =>
         toggleDisableOa(oa?.name, shouldEnable),
      // On success, invalidate any query in the cache for Oa (refetch the Oa list)
      onSuccess: (_, { shouldEnable }) => {
         queryClient.invalidateQueries({ queryKey: queryKeys.all });
         toast(toastMessages.toggleOa.success(oa.name, shouldEnable));
         onClose();
      },
      onError: ({ message }, { shouldEnable }) => {
         toast(toastMessages.toggleOa.error(shouldEnable, message));
         onClose();
      },
   });

   const handleClick = async () => {
      if (!isDisabled) {
         onOpen();
      } else {
         await mutate({ shouldEnable: isDisabled });
      }
   };

   const handleConfirm = async () => {
      await mutate({ shouldEnable: isDisabled });
      onClose();
   };

   return {
      isDisabled, isPending, mutate, handleClick, handleConfirm, isOpen, onClose
   };
};

