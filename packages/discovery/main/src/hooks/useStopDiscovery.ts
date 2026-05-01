import { type DiscoverHistoryFilter } from '@statseeker/api/internal_api/entities';
import { deleteDiscovery } from '@statseeker/api/internal_api/entities/discover';
import { useToast } from '@statseeker/hooks';
import { useMutation } from '@tanstack/react-query';
import { discoverHistoryQueryKeys, discoverQueryKeys, queryClient } from '~/lib';

export function useStopDiscovery(params?: DiscoverHistoryFilter) {

   const toast = useToast();
   const { mutate, isPending } = useMutation({
      mutationKey: ['discovery', 'stop'],
      mutationFn: () => {
         return deleteDiscovery();
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: params ? discoverHistoryQueryKeys.get(params) : discoverQueryKeys.current });
      },
      onError: () => {
         toast({
            title: 'Error',
            description: 'Failed to stop discovery',
            status: 'error',
         });
         queryClient.invalidateQueries({ queryKey: discoverQueryKeys.current });
      },
   });

   return {
      stopDiscovery: mutate,
      isStopping: isPending
   };
}
