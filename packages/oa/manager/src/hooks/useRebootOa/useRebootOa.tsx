import { type ToastId } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { useRef } from 'react';
import { type TableRowData } from '..';
import { rebootOa } from '~/api/rebootOa';
import { toastMessages } from '~/config/messages';
import { useToast } from '~/lib';

interface Props {
   oa: TableRowData;
}

export const useRebootOa = (oaProp: Props) => {
   let oa = oaProp?.oa;

   const toast = useToast();
   const toastIdRef = useRef<ToastId>();
   const { mutate } = useMutation({
      mutationFn: () => rebootOa({ name: oa?.name }),
      onMutate: () => {
         // @ts-ignore
         toastIdRef.current = toast(toastMessages.rebootOa.initial(oa?.name));
      },
      onError: ({ message }) => {
         if (toastIdRef.current) {
            toast.update(toastIdRef.current, toastMessages.rebootOa.error(oa?.name, message));
         } else {
            toast.closeAll();
            toast(toastMessages.rebootOa.error(oa?.name, message));
         }
      },
      onSuccess: () => {
         if (toastIdRef.current) {
            toast.update(toastIdRef.current, toastMessages.rebootOa.success(oa?.name));
         } else {
            toast.closeAll();
            toast(toastMessages.rebootOa.success(oa?.name));
         }
      },
   });
   return {
      reboot: mutate,
   };
};
