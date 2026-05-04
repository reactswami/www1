import { SSAlertDialog, SSAlertDialogAlert } from '@statseeker/components/Layout/AlertDialog';
import { Text } from '@statseeker/components/Typography';
import { Link } from '@chakra-ui/react';
import { Button } from '@statseeker/components/Form/Button';

interface Props {
   name: string;
   isOpen: boolean;
   onClose: () => void;
   isLoadingOrphanCount: boolean;
   count: number;
   isPending: boolean;
   handleConfirm: () => void;
}

export const DeleteOaConfirmDialog = ({
   name,
   isOpen,
   onClose,
   isLoadingOrphanCount,
   count,
   isPending,
   handleConfirm,
}: Props) => {
   const isLoading = isPending || isLoadingOrphanCount;

   return (
      <SSAlertDialog
         isOpen={isOpen}
         onClose={onClose}
         isCentered
         size="xl"
         title={`Delete Appliance - ${name}`}
         confirmButton={{
            label: 'Delete',
            variant: 'danger',
            onClick: handleConfirm,
            isLoading,
         }}
         cancelButton={{
            label: 'Cancel',
            isDisabled: isLoading,
         }}
         bodyProps={{
            gap: 'sm',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
         }}
      >
         {/* Loading state — verifying orphan devices */}
         {isLoadingOrphanCount && (
            <Text>Verifying the devices polled by {name}, please wait.</Text>
         )}

         {/* Loaded: orphaned devices found — show warning + re-assign link */}
         {!isLoadingOrphanCount && count > 0 && (
            <SSAlertDialogAlert
               status="error"
               title="Warning"
               descriptions={[
                  `There ${count > 1 ? 'are' : 'is'} ${count} device${
                     count > 1 ? 's' : ''
                  } that are only polled from ${name}. Proceeding with this action will permanently remove ${
                     count > 1 ? 'them' : 'it'
                  } from Statseeker.`,
                  'If you want to continue monitoring these devices, please assign them to another poller first.',
               ]}
               footer={
                  <Link href={`${window.location.origin}/cgi/oa_ping_manager`}>
                     <Button alignSelf="flex-end" variant="danger-light">
                        Re-assign pollers
                     </Button>
                  </Link>
               }
            />
         )}

         {/* Loaded: no orphaned devices — show standard info note */}
         {!isLoadingOrphanCount && count === 0 && (
            <SSAlertDialogAlert
               status="info"
               title="Note"
               descriptions={[
                  `This will delete all ping data collected from ${name}.`,
                  'Deleting an Observability Appliance will only remove the configuration from Statseeker and will not remove the deployed Observability Appliance.',
               ]}
            />
         )}

         {/* Confirmation text — shown once orphan check is done */}
         {!isLoadingOrphanCount && (
            <Text paddingY={2}>
               Are you sure you wish to delete {name}? This action can't be undone.
            </Text>
         )}
      </SSAlertDialog>
   );
};
