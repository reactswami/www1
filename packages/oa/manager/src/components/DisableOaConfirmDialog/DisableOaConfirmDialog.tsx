import ConfirmationDialog from "@statseeker/components/Legacy/ConfirmDialog/ConfirmDialog";

export interface DisableOaConfirmDialogProps {
   isOpen: boolean;
   onClose: () => void;
   onConfirm: () => void;
   isDisabled: boolean;
   isPending: boolean;
}

export const DisableOaConfirmDialog = ({
   isOpen,
   onClose,
   onConfirm,
   isDisabled,
   isPending,
}: DisableOaConfirmDialogProps) => {
   return (
      <ConfirmationDialog
         title={`${isDisabled ? 'Enable' : 'Disable'} Observability Appliance`}
         confirmation={`Are you sure you want to ${isDisabled ? 'enable' : 'disable'} the Observability Appliance?`}
         isOpen={isOpen}
         onClose={onClose}
         isPending={isPending}
         action={isDisabled ? 'Enable Observability Appliance' : 'Disable Observability Appliance'}
         onAction={onConfirm}
      />
   );
};