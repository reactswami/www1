import { type Device } from '@statseeker/api/internal_api/entities';
import ConfirmDialog from '@statseeker/components/Legacy/ConfirmDialog/ConfirmDialog';
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
            title: `Success`,
            description: `The devices have been successfully ${mode}d.`,
         });
         queryClient.invalidateQueries();
         onClose();
         navigate({
            search: (prev) => ({
               ...prev,
               selectedIds: undefined,
            }),
         });
      },
      onError: (resp) => {
         toast({
            status: 'error',
            title: `Error`,
            description:
               resp.message ||
               'An error has occurred. If the problem persists, contact the support team.',
         });
      },
   });

   const count = selectedDevices.length || 'all';
   const suffix = count === 1 ? '' : 's';
   const getConfirmation = () =>
      `Are you sure you want to ${mode} ${count} device${suffix}? This action cannot be undone.`;
   const getNote = () =>
      mode === 'delete'
         ? `All historical data will be removed for the device${suffix}`
         : mode === 'retire'
         ? `All polling will stop for the device${suffix}, but historical data will be retained`
         : '';

   return (
      <>
         <ConfirmDialog
            title={`${mode} devices`}
            note={getNote()}
            onAction={() => mutation.mutate()}
            isLoading={mutation.isPending}
            isPending={mutation.isPending}
            action={mode as string}
            isOpen={isOpen}
            onClose={onClose}
            confirmation={getConfirmation()}
         />
      </>
   );
}
