import { type UseDisclosureReturn } from '@chakra-ui/react';
import { addTask, type Task, updateTask } from '@statseeker/api/internal_api/entities';
import { useToast } from '@statseeker/hooks/useToast';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, useRouter, useSearch } from '@tanstack/react-router';
import { queryClient } from '~/lib/ReactQuery';

export default (disclosure?: UseDisclosureReturn, mode?: 'add' | 'edit') => {
   const toast = useToast();
   const navigate = useNavigate();
   const search = useSearch({ strict: false });
   const router = useRouter();
   const backTo = search.from ? `/${search.from}` : undefined;


   const scheduleMutation = useMutation({
      mutationKey: [mode],
      mutationFn: ({ task }: { task: Task[] }) => {
         if (mode === 'add') {
            return addTask({
               task: task[0],
            });
         } else {
            return updateTask({
               task: task,
            });
         }
      },
      onSuccess: () => {
         queryClient.invalidateQueries();

         toast({
            title: 'Success:',
            description: `Successfully ${mode === 'add' ? 'added' : 'updated'} the discover task`,
            status: 'success',
         });
         if (backTo) {
            router.navigate({ to: backTo, search: true });
         } else {
            navigate({
               search: (prev) => ({
                  ...prev,
                  selectedIds: undefined,
               }),
            });
         }
         disclosure?.onClose();
      },
      onError: ({ message }) => {
         toast({
            title: `Error`,
            description: message,
            status: 'error',
         });
         if (backTo) {
            router.navigate({ to: backTo, search: true });
         } else {
            navigate({
               search: (prev) => ({
                  ...prev,
                  selectedIds: undefined,
               }),
            });
         }
      },
   });

   return { scheduleMutation };
};
