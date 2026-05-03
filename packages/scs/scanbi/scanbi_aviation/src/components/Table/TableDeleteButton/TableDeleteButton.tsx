import {
   Alert,
   AlertDescription,
   AlertIcon,
   AlertTitle,
   Flex,
   IconButton,
   Text,
   Tooltip,
   type UseDisclosureReturn,
} from '@chakra-ui/react';
import { SSAlertDialog } from '@statseeker/components/Layout/AlertDialog';
import { TrashIcon } from '@statseeker/ui/icons';

export interface DeleteButtonProps {
   disclosure: UseDisclosureReturn;
   isLoading: boolean;
   handleConfirm: () => {};
   warningMessage: string;
}

export const TableDeleteButton = ({
   disclosure,
   isLoading,
   handleConfirm,
   warningMessage,
}: DeleteButtonProps) => {
   const { onClose, isOpen, onOpen } = disclosure;

   return (
      <>
         <SSAlertDialog
            isOpen={isOpen}
            onClose={onClose}
            isCentered
            size="xl"
            title="Delete"
            confirmButton={{
               label: 'Delete',
               variant: 'danger',
               isLoading,
               onClick: handleConfirm,
            }}
            cancelButton={{
               label: 'Cancel',
               isDisabled: isLoading,
            }}
            bodyProps={{
               gap: 'sm',
               display: 'flex',
               flexDirection: 'column',
               alignItems: 'flex-start',
            }}
         >
            <Alert
               status="info"
               display={'flex'}
               flexDirection={'column'}
               alignItems="flex-start"
               gap="sm"
               borderRadius={'sm'}
            >
               <Flex gap="sm">
                  <AlertIcon />
                  <AlertTitle>Note</AlertTitle>
               </Flex>
               <AlertDescription>{warningMessage}</AlertDescription>
            </Alert>

            <Text paddingY={2}>Do you wish to delete? This action can't be undone.</Text>
         </SSAlertDialog>

         <Tooltip label="Delete">
            <IconButton
               aria-label="delete"
               size="xs"
               position={'relative'}
               zIndex={0}
               variant="ghost"
               color="red.500"
               onClick={onOpen}
               icon={<TrashIcon />}
            />
         </Tooltip>
      </>
   );
};
