import {
   Button,
   Modal,
   ModalBody,
   ModalCloseButton,
   ModalContent,
   ModalFooter,
   ModalHeader,
   ModalOverlay,
   Text
} from '@chakra-ui/react';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useDeleteRangesForm } from '~/hooks/useDeleteRangesForm';
import { getRangesQuery } from '~/lib/ReactQuery';

const deleteSchema = z.object({
   id: z.union([z.number(), z.array(z.number())]),
});

export const Route = createFileRoute('/delete')({
   validateSearch: (search) => deleteSchema.parse(search),
   loader: async ({ context }) =>
      await context?.queryClient.ensureQueryData(getRangesQuery()),
   component: DeleteRangesRoute,
});

type DeleteRangesFormData = {
   value: string | number;
};

function DeleteRangesRoute() {
   const { id } = Route.useSearch();
   const ids = Array.isArray(id) ? id : [id];
   const form = useForm<DeleteRangesFormData>();
   const { handleSubmit } = form;
   const { deleteRanges, isLoading } = useDeleteRangesForm();
   const route = useRouter();

   return (
      <Modal isOpen={true} onClose={() => route.history.back()}>
         <ModalOverlay />
         <ModalContent>
            <ModalHeader>Delete IP Address Ranges</ModalHeader>
            <ModalCloseButton />
            <form
               id="DeleteRangesForm"
               onSubmit={handleSubmit(() => deleteRanges.mutate({ids}))}
            >
               <ConfirmDeleteRanges isLoading={isLoading} />
            </form>
         </ModalContent>
      </Modal>
   );
}

function ConfirmDeleteRanges({ isLoading }: { isLoading: boolean }) {
   const route = useRouter();
   return (
      <>
         <ModalBody>
            <Text>Are you sure you want to delete these IP Address Ranges?</Text>
         </ModalBody>
         <ModalFooter>
            <Button
               className="CancelDeleteRange"
               type="button"
               mr={3}
               onClick={() => route.history.back()}
            >
               Cancel
            </Button>
            <Button
               className="ConfirmDeleteRange"
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
