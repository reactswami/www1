
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { testConnection } from '~/api/testConnection';
import { useToast } from '~/lib/Chakra';
import { queryKeys } from '~/lib/ReactQuery';
import { type ApiConnection } from '~/types/api';

export const useTestConnection = () => {
   const toast = useToast();
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: (connectionSettings?: ApiConnection) => testConnection(connectionSettings),
      onSuccess: (data) => {
         const organizationsFound = data.data.organization_count;
         toast({
            status: 'info',
            title: 'Connection to Meraki successful',
            description: `${organizationsFound} network${organizationsFound > 1 && 's'} found.`,
         });
         queryClient.invalidateQueries({ queryKey: queryKeys.globalConfig });
      },
      retry: false,
   });
};
