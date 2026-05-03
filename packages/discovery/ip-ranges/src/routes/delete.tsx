import { SSModal } from '@statseeker/components/Layout/Modal';
import { Text } from '@chakra-ui/react';
import { Button } from '@statseeker/components/Form/Button';
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

type DeleteRangesFormData = { value: string | number };

function DeleteRangesRoute() {
   const { id } = Route.useSearch();
   const ids = Array.isArray(id) ? id : [id];
   const form = useForm<DeleteRangesFormData>();
   const { handleSubmit } = form;
   const { deleteRanges, isLoading } = useDeleteRangesForm();
   const route = useRouter();

   return (
      <SSModal
         isOpen={true}
         onClose={() => route.history.back()}
         title="Delete IP Address Ranges"
         form={{ id: 'DeleteRangesForm', onSubmit: handleSubmit(() => deleteRanges.mutate({ ids })) }}
         confirmButton={{ label: 'Delete', variant: 'danger', formId: 'DeleteRangesForm', isLoading, className: 'ConfirmDeleteRange' }}
         cancelButton={{ label: 'Cancel', onClick: () => route.history.back(), className: 'CancelDeleteRange' }}
      >
         <Text>Are you sure you want to delete these IP Address Ranges?</Text>
      </SSModal>
   );
}
