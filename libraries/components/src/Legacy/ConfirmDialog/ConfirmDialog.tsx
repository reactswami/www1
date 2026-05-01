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
   VStack,
   Box,
} from '@chakra-ui/react';
import { Button } from '@statseeker/components/Form';
import { Flex } from '@statseeker/components/Layout';
import { Text } from '@statseeker/components/Typography';
import React, { useRef } from 'react';
import { type ConfirmationDialogProps, type ConfirmationOptions } from './type';
const ConfirmationDialog: React.FC<ConfirmationDialogProps> = (props) => {
   const cancelRef = useRef<HTMLButtonElement>(null);

   // Normalize options to always be an array
   const optionsList: ConfirmationOptions[] = props.options
      ? (Array.isArray(props.options) ? props.options : [props.options])
      : [{
         title: props.title,
         note: props.note,
         confirmationLink: props.confirmationLink,
      }];

   const { isOpen, onClose, isPending, isLoading, action, onAction } = props;

   // Use first item's title as dialog header
   const dialogTitle = optionsList[0]?.title || 'Confirmation';

   return (
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

            <AlertDialogHeader fontSize={'lg'} fontWeight="bold" textTransform={'capitalize'}>
               {dialogTitle}
            </AlertDialogHeader>

            <AlertDialogBody
               gap="md"
               display="flex"
               flexDirection={'column'}
               alignItems="flex-start"
            >
               <VStack spacing="md" align="stretch" width="100%">
                  {optionsList.map((option, index) => (
                     <Box key={index}>
                        {/* Show title for items after the first one (first is used in header) */}
                        {index > 0 && option.title && (
                           <Text fontWeight="semibold" mb={2}>
                              {option.title}
                           </Text>
                        )}

                        {option.note && (
                           <Alert
                              status="info"
                              display={'flex'}
                              flexDirection={'column'}
                              alignItems="flex-start"
                              gap="sm"
                              borderRadius={'sm'}
                              mb={option.confirmationLink ? 2 : 0}
                           >
                              <Flex gap="sm">
                                 <AlertIcon />
                                 <AlertTitle>Note</AlertTitle>
                              </Flex>
                              <AlertDescription>{option.note}</AlertDescription>
                           </Alert>
                        )}


                        {option?.confirmationLink && (
                           <Link href={option?.confirmationLink?.link}>
                              <Button alignSelf={'flex-end'} variant="danger-light">
                                 {option?.confirmationLink?.title}
                              </Button>
                           </Link>
                        )}
                     </Box>
                  ))}
               </VStack>
               {props?.confirmation && (
                  <Text paddingY={2}>{props?.confirmation}</Text>
               )}
            </AlertDialogBody>

            <AlertDialogFooter gap={'sm'}>
               <Button
                  variant="danger"
                  isLoading={isPending || isLoading}
                  onClick={onAction}
               >
                  {action ?? ''}
               </Button>
               <Button
                  variant="tertiary"
                  isDisabled={isPending || isLoading}
                  onClick={onClose}
                  ref={cancelRef}
               >
                  Cancel
               </Button>
            </AlertDialogFooter>
         </AlertDialogContent>
      </AlertDialog>
   );
};

export default ConfirmationDialog;
