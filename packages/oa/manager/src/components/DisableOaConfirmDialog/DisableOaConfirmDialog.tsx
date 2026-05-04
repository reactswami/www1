import { SSAlertDialog } from '@statseeker/components/Layout/AlertDialog';
import { Text } from '@statseeker/components/Typography';

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
   const action = isDisabled ? 'Enable' : 'Disable';

   return (
      <SSAlertDialog
         isOpen={isOpen}
         onClose={onClose}
         isCentered
         size="xl"
         title={`${action} Observability Appliance`}
         confirmButton={{
            label: `${action} Observability Appliance`,
            variant: 'danger',
            onClick: onConfirm,
            isLoading: isPending,
         }}
         cancelButton={{ label: 'Cancel' }}
      >
         <Text paddingY={2}>
            Are you sure you want to {action.toLowerCase()} the Observability Appliance?
         </Text>
      </SSAlertDialog>
   );
};
