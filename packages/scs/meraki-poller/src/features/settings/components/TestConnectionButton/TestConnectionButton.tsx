import { Button } from '@chakra-ui/react';
import { CheckIcon, ExclamationTriangleIcon, UpdateIcon } from '@radix-ui/react-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { testConnection } from '~/api/testConnection';
import { useToast } from '~/lib/Chakra';
import { queryKeys } from '~/lib/ReactQuery';

export const TestConnectionButton = () => {
   const toast = useToast();
   const queryClient = useQueryClient();
   const { mutate, isPending } = useMutation({
      mutationFn: testConnection,
      onMutate: () => {
         setNotification(null);
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: queryKeys.globalConfig });
         setNotification('success');
      },
      onError: () => {
         setNotification('error');
         toast({
            status: 'error',
            icon: <ExclamationTriangleIcon />,
            title: 'Error connecting to Meraki',
            description:
               'Impossible to establish connection with the Meraki API with the credentials set.',
         });
      },
      onSettled: () => {
         setTimeout(() => setNotification(null), 2000);
      },
   });
   const [notification, setNotification] = useState<'error' | 'success' | null>(null);

   const handleClick = async () => {
      mutate(undefined);
   };

   const getLeftIcon = (notification: 'success' | 'error' | null) => {
      switch (notification) {
         case 'success':
            return <CheckIcon />;
         case 'error':
            return <ExclamationTriangleIcon />;
         default:
            return <UpdateIcon />;
      }
   };

   return (
      <Button
         variant={'outline'}
         onClick={handleClick}
         isLoading={isPending}
         minWidth="8rem"
         leftIcon={getLeftIcon(notification)}
         colorScheme={notification === 'error' ? 'red' : 'green'}
      >
         <>
            {notification === null && 'Test connection'}
            {notification === 'success' && 'Success'}
            {notification === 'error' && 'Error'}
         </>
      </Button>
   );
};
