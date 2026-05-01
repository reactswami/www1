import { type SNMPCredential } from '@statseeker/api/internal_api/entities';
import { SNMPCredentialsFormDefaultValues } from '@statseeker/components/Legacy/CredentialsForm';
import { useToast } from '@statseeker/hooks/useToast';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useCallback } from 'react';
import { CredentialsFormRoute } from './-components/CredentialsFormRoute';
import { addCredential } from '~/api';
import { queryClient, queryKeys } from '~/lib/ReactQuery';
import { formatErrorMessages } from '~/utils';

export const Route = createFileRoute('/_credentials/add')({
   component: AddCredentialRoute,
});

export default function AddCredentialRoute() {
   const navigate = useNavigate();
   const toast = useToast();

   const credentialsMutation = useMutation({
      mutationKey: ['credentials', 'add'],
      mutationFn: ({ credential }: { credential: SNMPCredential }) =>
         addCredential({
            newCred: {
               ...credential,
               context: credential.version === 3 ? credential.context : null,
               community: credential.version === 3 ? null : credential.community,
            },
         }),
      onSuccess: ({ data }) => {
         // methods.reset();
         queryClient.invalidateQueries();
         navigate({
            to: '/edit/$id',
            params: {
               id: data[0].id,
            },
            search: (prev) => ({
               ...prev,
               selectedIds: [data[0].id],
            }),
         });

         toast({
            title: 'Success:',
            description: `Successfully added SNMP Credential`,
            status: 'success',
         });
      },
      onError: ({ message }) => {
         queryClient.invalidateQueries({ queryKey: queryKeys.GET_CREDENTIALS_WITH_DEVICE_COUNT() });
         toast({
            title: 'Action failed:',
            description: formatErrorMessages(message),
            status: 'error',
         });
      },
   });

   const handleSubmit = useCallback(function handleSubmit (credential: SNMPCredential) {
      credentialsMutation.mutate({ credential });
   }, [credentialsMutation]);

   return (
      <CredentialsFormRoute
         title="Add SNMP Credential"
         formProps={{
            mode: 'add',
            defaultValues: SNMPCredentialsFormDefaultValues,
            onSubmit: handleSubmit,
            mutationIsSuccess: credentialsMutation.isSuccess,
         }}
      ></CredentialsFormRoute>
   );
}
