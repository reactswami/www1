import { SSAlertDialog } from '@statseeker/components/Layout/AlertDialog';
import { useDisclosure } from '@chakra-ui/react';
import { type ReactNode } from 'react';

export interface useConfirmDialogProps {
   /** Whether the confirm button should show a loading spinner and disable both buttons. */
   isLoading: boolean;
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
    * Defaults to `{ confirm: 'primary', cancel: 'tertiary' }`.
    */
   options?: {
      confirm: { variant?: string };
      cancel: { variant?: string };
   };
}

/**
 * **useConfirmDialog** — hook that returns a pre-configured `SSAlertDialog`
 * component and imperative `open` / `close` helpers.
 *
 * Internally uses `SSAlertDialog` (which renders with `role="alertdialog"`)
 * instead of the legacy `useModal` wrapper.
 *
 * The returned `{ Modal, open, close }` API is unchanged, so all existing
 * callsites work without modification.
 *
 * @example
 * ```tsx
 * const { Modal, open } = useConfirmDialog({
 *   title: 'Delete item',
 *   body: 'Are you sure? This action cannot be undone.',
 *   labels: { confirm: 'Delete', cancel: 'Cancel' },
 *   isLoading: mutation.isPending,
 *   onConfirm: () => mutation.mutate(),
 *   options: { confirm: { variant: 'danger' }, cancel: { variant: 'tertiary' } },
 * });
 *
 * return (
 *   <>
 *     <Button onClick={open}>Delete</Button>
 *     <Modal />
 *   </>
 * );
 * ```
 */
export const useConfirmDialog = ({
   isLoading,
   onConfirm,
   title,
   body,
   labels: { confirm, cancel },
   options = {
      confirm: { variant: 'primary' },
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
            variant: (options.confirm?.variant ?? 'primary') as any,
            onClick: onConfirm,
            isLoading,
         }}
         cancelButton={{
            label: cancel,
            variant: (options.cancel?.variant ?? 'tertiary') as any,
            isDisabled: isLoading,
            onClick: onClose,
         }}
      >
         {body}
      </SSAlertDialog>
   );

   return { Modal, open: onOpen, close: onClose };
};
