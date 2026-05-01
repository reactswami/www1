import { createFileRoute } from '@tanstack/react-router';
import * as z from 'zod';
import ImpactedUserConfirmationModal from '~/components/ImpactedUserConfirmationModal';

const deleteSchema = z.object({
   id: z.union([z.number(), z.array(z.number())]),
});

export const Route = createFileRoute('/directory/ad/delete')({
   validateSearch: (search) => deleteSchema.parse(search),
   component: DeletePoliciesRoute,
});


function DeletePoliciesRoute() {
   const { id } = Route.useSearch();
   const ids = Array.isArray(id) ? id : [id];

   return (
      <ImpactedUserConfirmationModal
         actionName="Delete"
         ids={ids}
      />
   );
}