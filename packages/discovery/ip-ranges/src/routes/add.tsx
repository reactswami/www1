import { type IpRangeConfig } from '@statseeker/api/internal_api/entities';
import { useToast } from '@statseeker/hooks';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { RangesFormRoute } from './-components';
import { queryClient, queryKeys } from '~/lib/ReactQuery';
import { getErrorMessage } from '~/utils/errorMessages';

export const Route = createFileRoute('/add')({
   component: AddRangeRoute,
});

export default function AddRangeRoute() {
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
         description: 'Successfully added IP Address Range',
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
         key={-1}
         title="Add IP Address Range"
         formProps={{
            mode: 'add',
            onSuccess,
            onError,
         }}
      ></RangesFormRoute>
   );
}
