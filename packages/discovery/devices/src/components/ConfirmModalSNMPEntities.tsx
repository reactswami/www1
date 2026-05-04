import { SSAlertDialog, SSAlertDialogAlert } from '@statseeker/components/Layout/AlertDialog';
import { Text } from '@statseeker/components/Typography';
import { useToast } from '@statseeker/hooks';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { enableSNMPEntities, disableSNMPEntities, deleteSNMPEntities } from '~/api/snmp_entity';
import { queryClient } from '~/lib';

export function ConfirmModalSNMPEntities({
   isOpen,
   onClose,
   mode,
   selectedCount,
}: {
   isOpen: boolean;
   onClose: () => void;
   mode: 'enable' | 'disable' | 'delete';
   selectedCount?: number;
}) {
   const navigate = useNavigate();
   const search = useSearch({ from: '/snmp_entities' });
   const toast = useToast();

   const mutation = useMutation({
      mutationFn: () => {
         const fn =
            mode === 'delete'
               ? deleteSNMPEntities
               : mode === 'enable'
               ? enableSNMPEntities
               : mode === 'disable'
               ? disableSNMPEntities
               : null;
         if (!fn || !search.data_type) {
            return Promise.reject(new Error('Invalid operation'));
         }
         return fn({
            ...search,
            data_type: search.data_type,
            selectedIds: search.selectedIds === 'all' ? undefined : search.selectedIds,
         });
      },
      onSuccess: () => {
         toast({
            status: 'success',
            title: 'Success',
            description: `The entities have been successfully ${mode}d.`,
         });
         queryClient.invalidateQueries();
         onClose();
         navigate({ search: (prev) => ({ ...prev, selectedIds: undefined }) });
      },
      onError: () => {
         toast({
            status: 'error',
            title: 'Error',
            description: 'An error has occurred. If the problem persists, contact the support team.',
         });
      },
   });

   const count = selectedCount ?? 'all';
   const suffix = count === 1 ? 'y' : 'ies';
   const note =
      mode === 'delete'
         ? `All historical data will be removed for the entit${suffix}`
         : mode === 'disable'
         ? `All polling will stop for the entit${suffix}, but historical data will be retained`
         : '';
   const confirmation =
      `Are you sure you want to ${mode} ${count} ${search.data_type_title} entit${suffix}?` +
      (mode === 'delete' ? ' This action cannot be undone.' : '');

   return (
      <SSAlertDialog
         isOpen={isOpen}
         onClose={onClose}
         isCentered
         size="xl"
         title={`${mode} Entities`}
         confirmButton={{
            label: mode,
            variant: 'danger',
            onClick: () => mutation.mutate(),
            isLoading: mutation.isPending,
         }}
         cancelButton={{ label: 'Cancel' }}
         bodyProps={{ gap: 'md', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
      >
         {note ? (
            <SSAlertDialogAlert
               status="info"
               title="Note"
               descriptions={[note]}
            />
         ) : null}
         <Text paddingY={2}>{confirmation}</Text>
      </SSAlertDialog>
   );
}
