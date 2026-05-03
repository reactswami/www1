import {
   Box,
   Code,
   Flex,
   Heading,
   Kbd,
   Text,
   VStack,
   type useDisclosure,
} from '@chakra-ui/react';
import { SSModal } from '@statseeker/components/Layout/Modal';
import { memo } from 'react';

interface Props {
   disclosure: ReturnType<typeof useDisclosure>;
   onContinue: () => void;
}

export const PingDiscoveryConfirmDiscoveryModal = memo(({ onContinue, disclosure }: Props) => {
   const { isOpen, onClose } = disclosure;
   return (
      <SSModal
         isOpen={isOpen}
         onClose={onClose}
         isCentered
         title="Important note"
         confirmButton={{
            label: 'Continue with the Discovery',
            variant: 'primary',
            onClick: () => { onContinue(); onClose(); },
         }}
         cancelButton={{ label: 'Cancel', onClick: onClose }}
      >
         <VStack alignItems="flex-start" gap="sm">
            <Text>
               By running a discovery, we will automatically assign the selected Observability
               Appliance as the default poller and override the existing default poller for any new
               devices found.
            </Text>
            <Text>
               If you only want to see the devices that were found without assigning them, click{' '}
               <Kbd marginX={1}>Dry Run</Kbd> instead of <Kbd marginX={1}>Run Discovery</Kbd>.
            </Text>
            <Text>Do you wish to continue?</Text>
         </VStack>
      </SSModal>
   );
});
