import { type IpRangeConfig } from '@statseeker/api/internal_api/entities/ip_range_config';
import { useToast } from '@statseeker/hooks';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import * as z from 'zod';
import { RangesFormRoute } from './-components';
import { getRangeByIdQuery, queryClient, queryKeys } from '~/lib/ReactQuery';
import { getErrorMessage } from '~/utils/errorMessages';

export const Route = createFileRoute('/copy/$id')({
   parseParams: (params: any) => ({
      id: z.number().int().parse(Number(params?.id)),
   }),
   loader: async ({context, params}) =>
      await context?.queryClient.ensureQueryData(getRangeByIdQuery(params.id)),
   component: CopyRangesRoute,
});

export default function CopyRangesRoute() {
   const iprangeId = Route.useParams().id;
   const rangesQuery = useSuspenseQuery(getRangeByIdQuery(iprangeId));
   let iprange = rangesQuery.data.data[0];
   const navigate = useNavigate();
   const toast = useToast();

   function onSuccess(data: IpRangeConfig[]) {
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
         title: 'Success',
         description: 'Successfully copied IP Address Range',
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
         key={-iprangeId}
         title='Add IP Address Range'
         formProps={{
            mode: 'copy',
            defaultValues: { ...iprange, name: `${iprange.name} Copy` },
            onSuccess,
            onError
         }}
      >
      </RangesFormRoute>
   );
}
