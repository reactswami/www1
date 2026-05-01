
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateGlobalConfig as apiUpdateGlobalConfig } from '~/api/updateGlobalConfig';
import { useToast } from '~/lib/Chakra';
import { queryKeys } from '~/lib/ReactQuery';

export const useTogglePollerGlobally = () => {
   const toast = useToast();
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: apiUpdateGlobalConfig,
      onSuccess: (_, body) => {
         if (body.disable_polling) {
            toast({
               status: 'success',
               title: 'Disabled successfully',
               description: 'Meraki poller has been disabled globally',
            });
         } else {
            toast({
               status: 'success',
               title: 'Re-enabled successfully',
               description: 'Meraki poller has been re-enabled globally',
            });
         }

         queryClient.invalidateQueries({
            queryKey: queryKeys.globalConfig,
         });
      },
   });
};
