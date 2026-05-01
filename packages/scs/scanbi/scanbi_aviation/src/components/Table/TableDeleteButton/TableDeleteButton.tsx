import {
   Alert,
   AlertDescription,
   AlertDialog,
   AlertDialogBody,
   AlertDialogCloseButton,
   AlertDialogContent,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogOverlay,
   AlertIcon,
   AlertTitle,
   Button,
   Flex,
   IconButton,
   Text,
   Tooltip,
   type UseDisclosureReturn,
} from '@chakra-ui/react';
import { TrashIcon } from '@statseeker/ui/icons';
import { useRef } from 'react';

export interface DeleteButtonProps {
   disclosure: UseDisclosureReturn;
   isLoading: boolean;
   handleConfirm: () => {};
   warningMessage: string;
}

export const TableDeleteButton = ({ disclosure, isLoading, handleConfirm, warningMessage}: DeleteButtonProps) => {
   const { onClose, isOpen, onOpen } = disclosure;
   const cancelRef = useRef<HTMLButtonElement>(null);

   return (
      <>
         <AlertDialog
            isCentered
            isOpen={isOpen}
            onClose={onClose}
            size="xl"
            leastDestructiveRef={cancelRef}
         >
            <AlertDialogOverlay />
            <AlertDialogContent>
               <AlertDialogCloseButton />
               <AlertDialogHeader fontSize={'lg'} fontWeight="bold">
                  Delete
               </AlertDialogHeader>
               <AlertDialogBody
                  gap="sm"
                  display="flex"
                  flexDirection={'column'}
                  alignItems="flex-start"
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
               </AlertDialogBody>
               <AlertDialogFooter gap={'sm'}>
                  <Button
                     variant="solid"
                     colorScheme={'red'}
                     isLoading={isLoading}
                     onClick={handleConfirm}
                  >
                     Delete
                  </Button>
                  <Button variant="ghost" isDisabled={isLoading} onClick={onClose} ref={cancelRef}>
                     Cancel
                  </Button>
               </AlertDialogFooter>
            </AlertDialogContent>
         </AlertDialog>
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
