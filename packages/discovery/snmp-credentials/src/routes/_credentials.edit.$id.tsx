import { type SNMPCredential } from '@statseeker/api/internal_api/entities';
import { useToast } from '@statseeker/hooks/useToast';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useCallback, useMemo } from 'react';
import * as z from 'zod';
import { CredentialDevicesTable } from './-components/CredentialDevicesTable';
import { CredentialsFormRoute } from './-components/CredentialsFormRoute';
import { updateCredential } from '~/api';
import {
   getCredentialByIdQuery,
   getCredentialsWithDeviceCountQuery,
   queryClient,
   queryKeys,
} from '~/lib/ReactQuery';
import { formatErrorMessages } from '~/utils';

export const Route = createFileRoute('/_credentials/edit/$id')({
   parseParams: (params: any) => ({
      id: z.number().int().parse(Number(params?.id)),
   }),
   loaderDeps: ({ search: { text_filter, sort, dir, limit } }) => ({
      text_filter,
      sort,
      dir,
      limit,
   }),
   loader: async ({ context, params, deps }) => {
      await context?.queryClient.ensureQueryData(getCredentialByIdQuery(params.id));
      // Reuse list query (cached) for deviceCount
      await context?.queryClient.ensureQueryData(getCredentialsWithDeviceCountQuery(deps));
   },
   component: EditCredentialsRoute,
});

export default function EditCredentialsRoute() {
   const toast = useToast();
   const credentialId = Route.useParams().id;
   const { data: credentialData } = useSuspenseQuery(getCredentialByIdQuery(credentialId));
   // Reuse list query (cached) for deviceCount
   const {
      data: { credentials },
   } = useSuspenseQuery(getCredentialsWithDeviceCountQuery(Route.useLoaderDeps()));
   const deviceCount = credentials.find((c) => c.id === credentialId)?.devices || 0;

   const credentialsMutation = useMutation({
      mutationKey: ['credentials', 'edit'],
      mutationFn: ({ credential }: { credential: SNMPCredential }) => {
         const { auth_pass: _a, auth_user: _b, priv_pass: _c, community: _d, ...rest } = credential;
         const shouldAddCommunity = () =>
            credential?.community !== '' &&
            credential?.community !== undefined &&
            credential?.community !== null &&
            credential.version !== 3;

         return updateCredential({
            newCred: {
               ...rest,
               ...(credential?.auth_pass && { auth_pass: credential?.auth_pass }),
               ...(credential?.auth_user && { auth_user: credential?.auth_user }),
               ...(credential?.priv_pass && { priv_pass: credential?.priv_pass }),
               context: credential.version === 3 ? credential.context : null,
               ...(shouldAddCommunity() && { community: credential?.community }),
            },
         });
      },
      onSuccess: () => {
         queryClient.invalidateQueries();

         toast({
            title: 'Success:',
            description: `Successfully updated SNMP Credential`,
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

   const handleSubmit = useCallback(
      function handleSubmit(credential: SNMPCredential) {
         credentialsMutation.mutate({ credential });
      },
      [credentialsMutation]
   );

   const formProps: {
      mode: 'edit';
      defaultValues: SNMPCredential;
      onSubmit: typeof handleSubmit;
      mutationIsSuccess: boolean;
      deviceCount: number;
   } = useMemo(
      () => ({
         mode: 'edit',
         defaultValues: credentialData.data[0],
         onSubmit: handleSubmit,
         mutationIsSuccess: credentialsMutation.isSuccess,
         deviceCount: deviceCount,
      }),
      [credentialData.data, credentialsMutation.isSuccess, deviceCount, handleSubmit]
   );

   return (
      <CredentialsFormRoute title="Edit SNMP Credential" formProps={formProps}>
         <CredentialDevicesTable credentialId={credentialId} />
      </CredentialsFormRoute>
   );
}
