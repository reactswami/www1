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
   Link,
   MenuItem,
   useDisclosure,
} from '@chakra-ui/react';
import { Button, Flex, Text } from '@statseeker/components';
import { useEffect, useRef } from 'react';
import { useDeleteOa, useFetchOrphanDevicesCount } from '~/hooks';


interface Props {
   id: string;
   name: string;
};

export const DeleteOaMenuItem = ({ id, name }: Props) => {
   const { isPending, mutate } = useDeleteOa({ id, name: '' });
   const { onClose, isOpen, onOpen } = useDisclosure();
   const {
      data: count,
      isLoading: isLoadingOrphanCount,
      refetch,
   } = useFetchOrphanDevicesCount({ oaName: name });
   const handleConfirm = async () => {
      await mutate();
      onClose();
   };
   const cancelRef = useRef<HTMLButtonElement>(null);

   useEffect(() => {
      if (!isOpen) {
         return;
      }
      refetch(); // Refetch every time it opens (unless cached)
   }, [isOpen, refetch]);

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
                  Delete Appliance - {name}
               </AlertDialogHeader>
               <AlertDialogBody
                  gap="sm"
                  display="flex"
                  flexDirection={'column'}
                  alignItems="flex-start"
               >
                  {isLoadingOrphanCount && (
                     <Text>Verifying the devices polled by {name}, please wait.</Text>
                  )}
                  {!isLoadingOrphanCount && count! > 0 && (
                     <Alert
                        status="error"
                        display={'flex'}
                        flexDirection={'column'}
                        alignItems="flex-start"
                        gap="sm"
                        borderRadius={'sm'}
                     >
                        <Flex gap="sm">
                           <AlertIcon />
                           <AlertTitle>Warning</AlertTitle>
                        </Flex>
                        <AlertDescription>
                           There {count > 1 ? 'are' : 'is'} {count} device
                           {count > 1 && 's'} that are only polled from {name}. Proceeding with this
                           action will permanently remove {count > 1 ? 'them' : 'it'} from
                           Statseeker.
                        </AlertDescription>
                        <AlertDescription>
                           If you want to continue monitoring these devices, please assign them to
                           another poller first.
                        </AlertDescription>
                        <Link href={`${window.location.origin}/cgi/oa_ping_manager`}>
                           <Button alignSelf={'flex-end'} colorScheme="red" variant="secondary">
                              Re-assign pollers
                           </Button>
                        </Link>
                     </Alert>
                  )}

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
                     <AlertDescription>
                        This will delete all ping data collected from {name}.
                     </AlertDescription>
                     <AlertDescription>
                        Deleting an Observability Appliance will only remove the configuration from Statseeker and
                        will not remove the deployed Observability Appliance.
                     </AlertDescription>
                  </Alert>

                  <Text paddingY={2}>
                     Are you sure you wish to delete {name}? This action can't be undone.
                  </Text>
               </AlertDialogBody>
               <AlertDialogFooter gap={'sm'}>
                  <Button
                     variant="primary"
                     colorScheme={'red'}
                     isLoading={isPending || isLoadingOrphanCount}
                     onClick={handleConfirm}
                  >
                     Delete
                  </Button>
                  <Button
                     variant="tertiary"
                     isDisabled={isPending || isLoadingOrphanCount}
                     onClick={onClose}
                     ref={cancelRef}
                  >
                     Cancel
                  </Button>
               </AlertDialogFooter>
            </AlertDialogContent>
         </AlertDialog>
         <MenuItem color="red.500" onClick={onOpen}>
            Delete Observability Appliance
         </MenuItem>
      </>
   );
};
