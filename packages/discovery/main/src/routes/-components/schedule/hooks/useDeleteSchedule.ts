import { type UseDisclosureReturn } from '@chakra-ui/react';
import { deleteTask } from '@statseeker/api/internal_api/entities';
import { useToast } from '@statseeker/hooks/useToast';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '~/lib/ReactQuery';

export default ({ disclosure }: { disclosure: UseDisclosureReturn }) => {
   const toast = useToast();

   const deleteScheduleMutation = useMutation({
      mutationKey: ['deleteTask'],
      mutationFn: ({ ids }: { ids: number[] }) => deleteTask({ ids }),
      onError: ({ message }) => {
         toast({
            title: 'Error',
            description: message,
            status: 'error',
         });
         queryClient.invalidateQueries();
      },
      onSuccess: () => {
         toast({
            title: 'Success',
            description: 'All the selected task(s) deleted successfully',
            status: 'success',
         });
         queryClient.invalidateQueries();
         disclosure.onClose();
      },
   });

   return {
      deleteScheduleMutation,
   };
};
