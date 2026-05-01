import { type SNMPCredential } from '@statseeker/api/internal_api/entities';
import { useToast } from '@statseeker/hooks/useToast';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useCallback } from 'react';
import * as z from 'zod';
import { CredentialsFormRoute } from './-components/CredentialsFormRoute';
import { addCredential } from '~/api';
import { getCredentialByIdQuery, queryClient, queryKeys } from '~/lib/ReactQuery';
import { formatErrorMessages } from '~/utils';

export const Route = createFileRoute('/_credentials/copy/$id')({
   parseParams: (params: any) => ({
      id: z.number().int().parse(Number(params.id)),
   }),
   loader: async ({ context, params }) =>
      await context?.queryClient.ensureQueryData(getCredentialByIdQuery(params.id)),
   component: CopyCredentialsRoute,
});

export default function CopyCredentialsRoute() {
   const toast = useToast();
   const navigate = useNavigate();
   const credentialId = Route.useParams().id;
   const credentialsQuery = useSuspenseQuery(getCredentialByIdQuery(credentialId));
   let credential = credentialsQuery.data.data[0];

   const credentialsMutation = useMutation({
      mutationKey: ['credentials', 'copy'],
      mutationFn: ({ newCredential }: { newCredential: SNMPCredential }) => {
         const {
            name,
            version,
            auth_method,
            auth_pass,
            auth_user,
            community,
            context,
            priv_method,
            priv_pass,
         } = newCredential;
         return addCredential({
            newCred: {
               name,
               version,
               auth_method,
               auth_pass,
               auth_user,
               priv_method,
               priv_pass,
               context: version === 3 ? context : null,
               community: version === 3 ? null : community,
            },
         });
      },
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
            description: `Successfully copied SNMP Credential`,
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

   const handleSubmit = useCallback(function handleSubmit (credentialToBeSaved: SNMPCredential) {
      credentialsMutation.mutate({ newCredential: credentialToBeSaved });
   }, [credentialsMutation]);

   return (
      <CredentialsFormRoute
         title="Add SNMP Credential"
         formProps={{
            mode: 'copy',
            defaultValues: { ...credential, name: `${credential.name} Copy` },
            onSubmit: handleSubmit,
            mutationIsSuccess: credentialsMutation.isSuccess,
         }}
      ></CredentialsFormRoute>
   );
}
