import { SSAlertDialog } from '@statseeker/components/Layout/AlertDialog';
import { useDisclosure } from '@chakra-ui/react';
import { type ReactNode } from 'react';

export interface useConfirmDialogProps {
   /** Whether the confirm button should show a loading spinner and disable both buttons. */
   isPending: boolean;
   /** Called when the confirm button is clicked. */
   onConfirm: () => void;
   /** Dialog header title. */
   title: string;
   /**
    * Content rendered inside the dialog body.
    * Can be a string, JSX, or any ReactNode.
    */
   body: ReactNode | string;
   /** Labels for the confirm and cancel buttons. */
   labels: {
      confirm: string;
      cancel: string;
   };
   /**
    * Optional button variant overrides.
    * Defaults to `{ confirm: { variant: 'danger' }, cancel: { variant: 'tertiary' } }`.
    */
   options?: {
      confirm?: { variant?: string };
      cancel?: { variant?: string };
   };
}

/**
 * **useConfirmDialog** (meraki-poller local) — hook that returns a
 * pre-configured `SSAlertDialog` component and imperative `open`/`close`
 * helpers.
 *
 * Rewrites the legacy `useModal` + raw Chakra `Button`/`Flex` implementation
 * with `SSAlertDialog` (renders `role="alertdialog"`).
 *
 * The returned `{ Modal, open, close }` API is unchanged.
 */
export const useConfirmDialog = ({
   isPending,
   onConfirm,
   title,
   body,
   labels: { confirm, cancel },
   options = {
      confirm: { variant: 'danger' },
      cancel: { variant: 'tertiary' },
   },
}: useConfirmDialogProps) => {
   const { isOpen, onOpen, onClose } = useDisclosure();

   const Modal = () => (
      <SSAlertDialog
         isOpen={isOpen}
         onClose={onClose}
         isCentered
         size="xl"
         title={title}
         confirmButton={{
            label: confirm,
            variant: (options.confirm?.variant ?? 'danger') as any,
            onClick: onConfirm,
            isLoading: isPending,
         }}
         cancelButton={{
            label: cancel,
            variant: (options.cancel?.variant ?? 'tertiary') as any,
            isDisabled: isPending,
            onClick: onClose,
         }}
      >
         {body}
      </SSAlertDialog>
   );

   return { Modal, open: onOpen, close: onClose };
};
