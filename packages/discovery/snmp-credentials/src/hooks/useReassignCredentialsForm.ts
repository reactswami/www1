import { useToast } from '@statseeker/hooks/useToast';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { bulkUpdateDevicesBySNMPCredentialIds } from '~/api/device';
import { deleteCredentials } from '~/api/snmp_credential';
import { queryClient } from '~/lib/ReactQuery';
import { type ReassignCredentialsFormData } from '~/types';

export function useReassignCredentialsForm({ ids, deviceCount }: { ids: number[]; deviceCount: number }) {
   const toast = useToast();
   const navigate = useNavigate();

   const deleteCredentialMutation = useMutation({
      mutationKey: ['deleteCredential'],
      mutationFn: ({ ids }: { ids: number[] }) => deleteCredentials({ ids }),
      onError: ({ message }) => {
         toast({
            title: 'Error',
            description: message,
            status: 'error',
         });
      },
      onSuccess: () => {
         toast({
            title: 'Success',
            description: 'SNMP Credential deleted successfully',
            status: 'success',
         });
         queryClient.invalidateQueries();
         navigate({
            to: '/',
         });
      },
   });

   async function reassignDevices(data: ReassignCredentialsFormData) {
      try {
         if (deviceCount > 0) {
            if (data.value === 'off') {
               await bulkUpdateDevicesBySNMPCredentialIds({
                  credentialIds: ids,
                  device: {
                     snmp_poll: 'off',
                     snmp_credential: 0,
                  },
               });
            } else {
               await bulkUpdateDevicesBySNMPCredentialIds({
                  credentialIds: ids,
                  device: {
                     snmp_credential: Number(data.value),
                  },
               });
            }
         }
      } catch {
         return toast({
            title: 'Error',
            description: 'Failed to update devices!',
            status: 'error',
         });
      }

      return deleteCredentialMutation.mutate({ ids });
   }

   return {
      reassignDevices,
      isLoading: deleteCredentialMutation.isPending,
   };
}
