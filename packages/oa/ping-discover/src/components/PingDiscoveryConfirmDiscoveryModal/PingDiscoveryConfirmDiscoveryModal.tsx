import {
   Button,
   Kbd,
   Modal,
   ModalBody,
   ModalCloseButton,
   ModalContent,
   ModalFooter,
   ModalHeader,
   ModalOverlay,
   Text,
   type UseDisclosureReturn,
   VStack,
} from '@chakra-ui/react';

interface Props {
   disclosure: UseDisclosureReturn;
   onContinue: () => void;
}

export const PingDiscoveryConfirmDiscoveryModal = ({
   onContinue,
   disclosure,
}: Props) => {
   const { isOpen, onClose } = disclosure;

   return (
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
         <ModalOverlay />
         <ModalContent>
            <ModalHeader>Important note</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
               <VStack alignItems="flex-start" gap="sm">
                  <Text>
                     By running a discovery, we will automatically assign the
                     selected Observability Appliance as the default poller and override the
                     existing default poller for any new devices found.
                  </Text>
                  <Text>
                     If you only want to see the devices that were found without
                     assigning them, click <Kbd marginX={1}>Dry Run</Kbd>{' '}
                     instead of <Kbd marginX={1}>Run Discovery</Kbd>.
                  </Text>
                  <Text>Do you wish to continue?</Text>
               </VStack>
            </ModalBody>

            <ModalFooter>
               <Button
                  mr={3}
                  onClick={() => {
                     onContinue();
                     onClose();
                  }}
               >
                  Continue with the Discovery
               </Button>
               <Button variant="ghost" onClick={onClose}>
                  Cancel
               </Button>
            </ModalFooter>
         </ModalContent>
      </Modal>
   );
};
