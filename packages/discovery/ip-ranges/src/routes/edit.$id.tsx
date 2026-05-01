import { useToast } from '@statseeker/hooks';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import * as z from 'zod';
import { RangesFormRoute } from './-components';
import { getRangeByIdQuery, queryClient, queryKeys } from '~/lib/ReactQuery';
import { getErrorMessage } from '~/utils/errorMessages';

export const Route = createFileRoute('/edit/$id')({
   parseParams: (params: any) => ({
      id: z.number().int().parse(Number(params?.id)),
   }),
   loader: async ({ context, params }) =>
      await context?.queryClient.ensureQueryData(getRangeByIdQuery(params.id)),
   component: EditRangesRoute,
});

export default function EditRangesRoute() {
   const iprangeId = Route.useParams().id;
   const { data: iprange } = useSuspenseQuery(getRangeByIdQuery(iprangeId));
   const toast = useToast();

   function onSuccess() {
      queryClient.invalidateQueries();
      toast({
         title: 'Success',
         description: 'Successfully updated IP Address Range',
         status: 'success',
      });
   }

   function onError(message: string) {
      queryClient.invalidateQueries({ queryKey: queryKeys.GET_RANGES() });
      toast({
         title: 'Action failed:',
         description: getErrorMessage(message),
         status: 'error',
      });
   }

   return (
      <RangesFormRoute
         key={iprangeId}
         title="Edit IP Address Range"
         formProps={{
            mode: 'edit',
            defaultValues: iprange.data[0],
            onSuccess,
            onError,
         }}
      ></RangesFormRoute>
   );
}
