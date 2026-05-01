import { type UseDisclosureReturn } from '@chakra-ui/react';
import { updateTask } from '@statseeker/api/internal_api/entities';
import { useToast } from '@statseeker/hooks/useToast';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '~/lib/ReactQuery';

export default ({ disclosure, enabled }: { disclosure?: UseDisclosureReturn; enabled: number }) => {
   const toast = useToast();

   const disableScheduleMutation = useMutation({
      mutationKey: ['disableTask'],
      mutationFn: ({ id }: { id: number[] }) =>
         updateTask({ task: id.map((id) => ({ id, enabled })) }),
      onError: ({ message }) => {
         toast({
            title: `Error`,
            description: message,
            status: 'error',
         });
         queryClient.invalidateQueries();
      },
      onSuccess: () => {
         toast({
            title: 'Success',
            description: `All the selected task(s) are ${enabled ? 'enabled' : 'disabled'}`,
            status: 'success',
         });
         queryClient.invalidateQueries();
         disclosure?.onClose();
      },
   });

   return {
      disableScheduleMutation,
   };
};
