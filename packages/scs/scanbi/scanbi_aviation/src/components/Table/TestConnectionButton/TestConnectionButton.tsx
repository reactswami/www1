import { Tooltip, IconButton, Spinner } from '@chakra-ui/react';
import { UpdateIcon } from '@radix-ui/react-icons';
import { useToast } from '@statseeker/hooks';
import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { testConnection } from '~/api/networks/api';

export function TestConnectionButton({ id }: { id: number }) {
   const toast = useToast();
   const { mutate, isPending, isSuccess, isError } = useMutation({
      mutationFn: testConnection,
   });

   useEffect(() => {
      if (isSuccess) {
         toast({
            title: 'Test Connection',
            description: `API connection test successful`,
            status: 'success',
         });
      }
   }, [isSuccess]);

   useEffect(() => {
      if (isError === true) {
         toast({
            title: 'Test Connection',
            description: `API connection test failed, please check logs for details`,
            status: 'error',
         });
      }
   }, [isError]);

   return (
      <Tooltip label="Test Connection">
         {isPending ? (
            <Spinner size={'sm'} />
         ) : (
            <IconButton
               aria-label="delete"
               size="xs"
               position={'relative'}
               zIndex={0}
               variant="ghost"
               icon={<UpdateIcon />}
               onClick={() => mutate(id)}
            />
         )}
      </Tooltip>
   );
}
