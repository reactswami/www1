import { type Device } from '@statseeker/api/internal_api/entities';
import { SSAlertDialog, SSAlertDialogAlert } from '@statseeker/components/Layout/AlertDialog';
import { Text } from '@statseeker/components/Typography';
import { useToast } from '@statseeker/hooks';
import { useMutation } from '@tanstack/react-query';
import { useSearch, useNavigate } from '@tanstack/react-router';
import { deleteRetireCgi } from '~/api/device';
import { queryClient } from '~/lib';

export function ConfirmModal({
   isOpen,
   onClose,
   mode,
   selectedDevices,
}: {
   isOpen: boolean;
   onClose: () => void;
   mode: 'retire' | 'delete';
   selectedDevices: Device['id'][];
}) {
   const search = useSearch({ from: '/devices' });
   const navigate = useNavigate();
   const toast = useToast();

   const mutation = useMutation({
      mutationFn: () =>
         deleteRetireCgi(mode, {
            ...search,
            selectedIds: search.selectedIds === 'all' ? undefined : search.selectedIds,
         }),
      onSuccess: () => {
         toast({
            status: 'success',
            title: 'Success',
            description: `The devices have been successfully ${mode}d.`,
         });
         queryClient.invalidateQueries();
         onClose();
         navigate({ search: (prev) => ({ ...prev, selectedIds: undefined }) });
      },
      onError: (resp) => {
         toast({
            status: 'error',
            title: 'Error',
            description:
               resp.message ||
               'An error has occurred. If the problem persists, contact the support team.',
         });
      },
   });

   const count = selectedDevices.length || 'all';
   const suffix = count === 1 ? '' : 's';
   const note =
      mode === 'delete'
         ? `All historical data will be removed for the device${suffix}`
         : `All polling will stop for the device${suffix}, but historical data will be retained`;
   const confirmation = `Are you sure you want to ${mode} ${count} device${suffix}? This action cannot be undone.`;

   return (
      <SSAlertDialog
         isOpen={isOpen}
         onClose={onClose}
         isCentered
         size="xl"
         title={`${mode} devices`}
         confirmButton={{
            label: mode,
            variant: 'danger',
            onClick: () => mutation.mutate(),
            isLoading: mutation.isPending,
         }}
         cancelButton={{ label: 'Cancel' }}
         bodyProps={{ gap: 'md', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
      >
         <SSAlertDialogAlert
            status="info"
            title="Note"
            descriptions={[note]}
         />
         <Text paddingY={2}>{confirmation}</Text>
      </SSAlertDialog>
   );
}
