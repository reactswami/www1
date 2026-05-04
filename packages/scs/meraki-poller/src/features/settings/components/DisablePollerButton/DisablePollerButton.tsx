import { Text } from '@chakra-ui/react';
import { Button } from '@statseeker/components/Form/Button';
import { SSAlertDialog } from '@statseeker/components/Layout/AlertDialog';
import { CheckCircledIcon, CircleBackslashIcon } from '@radix-ui/react-icons';
import { useDisclosure } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useTogglePollerGlobally } from '../../hooks/useTogglePollerGlobally';
import { useFetchGlobalConfig } from '~/hooks/useFetchGlobalConfig';

export const DisablePollerButton = () => {
   const { data } = useFetchGlobalConfig();
   const { mutate, isPending, isSuccess, isError } = useTogglePollerGlobally();
   const shouldEnable = data?.data.disable_polling;
   const { isOpen, onOpen, onClose } = useDisclosure();

   useEffect(() => {
      if (isSuccess || isError) {
         onClose();
      }
   }, [isSuccess, isError, onClose]);

   const onConfirm = async () => {
      await mutate({ disable_polling: !data?.data.disable_polling });
   };

   const label = `${shouldEnable ? 'Re-Enable' : 'Disable'} data collection`;

   return (
      <>
         <SSAlertDialog
            isOpen={isOpen}
            onClose={onClose}
            isCentered
            size="xl"
            title="Disable data collection"
            confirmButton={{
               label: 'Yes, disable the poller',
               variant: 'danger',
               onClick: onConfirm,
               isLoading: isPending,
            }}
            cancelButton={{
               label: 'No, cancel',
               isDisabled: isPending,
            }}
         >
            <Text>
               If you disable the poller, you will not lose existing data but we will stop
               collecting new data. Do you wish to continue?
            </Text>
         </SSAlertDialog>

         <Button
            variant={shouldEnable ? 'primary' : 'secondary'}
            leftIcon={shouldEnable ? <CheckCircledIcon /> : <CircleBackslashIcon />}
            onClick={shouldEnable ? onConfirm : onOpen}
         >
            {label}
         </Button>
      </>
   );
};
