import { useToast } from '@statseeker/hooks/useToast';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { deleteRanges as apiDeleteRanges } from '~/api/ip_range_config';
import { getRangesQuery, queryClient } from '~/lib/ReactQuery';

export function useDeleteRangesForm() {
   const toast = useToast();
   const navigate = useNavigate();
   const rangesData = useSuspenseQuery(getRangesQuery()).data;

   const deleteRanges = useMutation({
      mutationKey: ['deleteRange'],
      mutationFn: ({ids}: {ids: number[]}) => apiDeleteRanges({ ids }),
      onError: ({ message }) => {
         toast({
            title: 'Error',
            description: message,
            status: 'error',
         });
      },
      onSuccess: () => {
         toast({
            title: 'Success',
            description: 'IP Address range deleted successfully',
            status: 'success',
         });
         queryClient.invalidateQueries();
         navigate({
            to: '/',
         });
      },
   });

   return {
      deleteRanges,
      isLoading: deleteRanges.isPending,
      ranges: rangesData,
   };
}
