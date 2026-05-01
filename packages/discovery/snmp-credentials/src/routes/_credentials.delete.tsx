import {
   Box,
   Button,
   FormControl,
   ListItem,
   Modal,
   ModalBody,
   ModalCloseButton,
   ModalContent,
   ModalFooter,
   ModalHeader,
   ModalOverlay,
   Select,
   Text,
   UnorderedList,
} from '@chakra-ui/react';
import { type SNMPCredential } from '@statseeker/api/internal_api/entities';
import { FormLabel } from '@statseeker/components/Legacy/Input/Label/Label';
import { getProductName } from '@statseeker/utils/environment';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { useForm, type UseFormRegister } from 'react-hook-form';
import * as z from 'zod';
import { useReassignCredentialsForm } from '~/hooks/useReassignCredentialsForm';
import { getCredentialsWithDeviceCountQuery } from '~/lib/ReactQuery';
import { type ReassignCredentialsFormData } from '~/types/general';

const deleteAndReassignSchema = z.object({
   id: z.union([z.number(), z.array(z.number())]),
});

export const Route = createFileRoute('/_credentials/delete')({
   validateSearch: (search) => deleteAndReassignSchema.parse(search),
   loaderDeps: ({ search: { text_filter, sort, dir, limit } }) => ({
      text_filter,
      sort,
      dir,
      limit,
   }),
   loader: async ({ context, deps }) =>
      await context?.queryClient.ensureQueryData(getCredentialsWithDeviceCountQuery(deps)),
   component: DeleteCredentialsRoute,
});

function DeleteCredentialsRoute() {
   const { id } = Route.useSearch();
   const ids = Array.isArray(id) ? id : [id];
   const form = useForm<ReassignCredentialsFormData>();
   const { handleSubmit, register } = form;
   // Reuse list query (cached) for deviceCount
   const { data: { credentials }, } = useSuspenseQuery(getCredentialsWithDeviceCountQuery(Route.useLoaderDeps()));
   const deviceCount = credentials.filter((c) => ids.includes(c.id)).map((c) => c.devices).reduce((prev, current) => (prev !== undefined ? prev + current : current));
   const { reassignDevices, isLoading } = useReassignCredentialsForm({
      ids,
      deviceCount,
   });
   const route = useRouter();

   return (
      <Modal isOpen={true} onClose={() => route.history.back()} size={deviceCount > 0 ? 'xl' : 'lg'}>
         <ModalOverlay />
         <ModalContent>
            <ModalHeader>Delete SNMP Credentials</ModalHeader>
            <ModalCloseButton />
            <form
               id="DeleteCredentialsForm"
               onSubmit={handleSubmit((data) => reassignDevices(data))}
            >
               {deviceCount > 0 ? (
                  <ReassignCredentialsForm
                     register={register}
                     credentials={credentials.filter((cred) => !ids.includes(cred.id))}
                     isLoading={isLoading}
                     deviceCount={deviceCount}
                  />
               ) : (
                  <ConfirmDeleteCredentials isLoading={isLoading} />
               )}
            </form>
         </ModalContent>
      </Modal>
   );
}

function ReassignCredentialsForm({
   credentials,
   isLoading,
   register,
   deviceCount,
}: {
   credentials: Pick<SNMPCredential, 'id' | 'name'>[];
   isLoading: boolean;
   register: UseFormRegister<ReassignCredentialsFormData>;
   deviceCount: number;
}) {
   const route = useRouter();
   return (
      <>
         <ModalBody>
            <Text>
               These SNMP Credentials are currently in use by {deviceCount} devices. Either:
            </Text>
            <Box height="1"></Box>
            <UnorderedList marginLeft={'2em'}>
               <ListItem>Select an alternate set of SNMP Credentials to use when communicating with these devices</ListItem>
            </UnorderedList>
            <Text>
               OR
            </Text>
            <UnorderedList marginLeft={'2em'}>
               <ListItem>Confirm your intention to disable SNMP polling of these devices by {getProductName()}</ListItem>
            </UnorderedList>
            <Box height="1"></Box>
            <FormControl isRequired>
               <FormLabel label="Action" isRequired={true}>
                  <Select size={'md'} minWidth={'100%'} {...register('value')}>
                     <option value={'off'}>Disable SNMP Polling</option>
                     <option value='-' disabled>―― OR ――</option>
                     {credentials.map((credential) => (
                        <option key={credential.id} value={credential.id}>
                           Use '{credential.name}'
                        </option>
                     ))}
                  </Select>
               </FormLabel>
            </FormControl>
         </ModalBody>
         <ModalFooter>
            <Button
               className="CancelDeleteCredential"
               type="button"
               variant="outline"
               mr={3}
               onClick={() => route.history.back()}
            >
               Cancel
            </Button>
            <Button
               className="ConfirmDeleteCredential"
               type="submit"
               variant="solid"
               colorScheme={'red'}
               isLoading={isLoading}
            >
               Delete
            </Button>
         </ModalFooter>
      </>
   );
}

function ConfirmDeleteCredentials({ isLoading }: { isLoading: boolean }) {
   const route = useRouter();
   return (
      <>
         {' '}
         <ModalBody>
            <Text>Are you sure you want to delete these SNMP Credentials?</Text>
         </ModalBody>
         <ModalFooter>
            <Button
               className="CancelDeleteCredential"
               type="button"
               variant={'outline'}
               mr={3}
               onClick={() => route.history.back()}
            >
               Cancel
            </Button>
            <Button
               className="ConfirmDeleteCredential"
               type="submit"
               variant="solid"
               colorScheme={'red'}
               isLoading={isLoading}
            >
               Delete
            </Button>
         </ModalFooter>
      </>
   );
}
