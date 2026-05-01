import { Button, Text } from '@chakra-ui/react';
import { CheckCircledIcon, CircleBackslashIcon } from '@radix-ui/react-icons';
import { useConfirmDialog } from '@statseeker/hooks';
import { useEffect } from 'react';
import { useTogglePollerGlobally } from '../../hooks/useTogglePollerGlobally';
import { useFetchGlobalConfig } from '~/hooks/useFetchGlobalConfig';

export const DisablePollerButton = () => {
   const { data } = useFetchGlobalConfig();
   const { mutate, isPending, isSuccess, isError } = useTogglePollerGlobally();
   const shouldEnable = data?.data.disable_polling;
   useEffect(() => {
      if (isSuccess || isError) {
         close();
      }
   }, [isSuccess, isError]);
   const onConfirm = async () => {
      await mutate({ disable_polling: !data?.data.disable_polling });
   };

   const body = (
      <Text>
         If you disable the poller, you will not lose existing data but we will stop collecting new
         data. Do you wish to continue?
      </Text>
   );
   const title = 'Disable data colection';
   const confirm = 'Yes, disable the poller';
   const cancel = 'No, cancel';
   const options = {
      confirm: {
         variant: 'solid',
         colorScheme: 'red',
      },
      cancel: {
         variant: 'ghost',
         colorScheme: 'primary',
      },
   };
   const { Modal, open, close } = useConfirmDialog({
      isLoading: isPending,
      onConfirm,
      title,
      body,
      labels: { confirm, cancel },
      options,
   });

   const label = `${shouldEnable ? 'Re-Enable' : 'Disable'} data collection`;

   return (
      <>
         <Modal />
         <Button
            variant={shouldEnable ? 'solid' : 'outline'}
            colorScheme={shouldEnable ? 'green' : 'red'}
            leftIcon={shouldEnable ? <CheckCircledIcon /> : <CircleBackslashIcon />}
            onClick={shouldEnable ? onConfirm : open}
         >
            {label}
         </Button>
      </>
   );
};
