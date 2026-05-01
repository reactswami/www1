import { Button, Flex } from '@chakra-ui/react';
import { useModal, type useModalProps } from '@statseeker/components/Legacy/Modal/Modal';
import { type ReactNode } from 'react';

export interface useConfirmDialogProps {
   isPending: boolean;
   onConfirm: () => void;
   title: string;
   body: ReactNode | string;
   labels: {
      confirm: string;
      cancel: string;
   };
   options?: {
      confirm: ButtonOptions;
      cancel: ButtonOptions;
   };
}

type ButtonOptions = {
   colorScheme: string;
   variant: string;
};

export const useConfirmDialog = ({
   isPending,
   onConfirm,
   title,
   body,
   labels: { confirm, cancel },
   options = {
      confirm: { colorScheme: 'primary', variant: 'solid' },
      cancel: { colorScheme: 'primary', variant: 'solid' },
   },
}: useConfirmDialogProps) => {
   const modalProps: useModalProps = {
      title,
      body,
      footer: (
         <Flex gap="sm">
            <Button onClick={onConfirm} {...options.confirm} isLoading={isPending}>
               {confirm}
            </Button>
            <Button onClick={onClose} {...options.cancel} isDisabled={isPending}>
               {cancel}
            </Button>
         </Flex>
      ),
   };

   const { Modal, open, close } = useModal(modalProps);

   function onClose() {
      close();
   }

   return { Modal, open, close };
};
