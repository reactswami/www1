import {
   Box,
   Button,
   Code,
   Flex,
   Heading,
   Modal,
   ModalBody,
   ModalCloseButton,
   ModalContent,
   ModalFooter,
   ModalHeader,
   ModalOverlay,
   Text,
   VStack,
   type useDisclosure,
} from '@chakra-ui/react';

import { memo } from 'react';

interface Props {
   disclosure: ReturnType<typeof useDisclosure>;
}

export const PingDiscoveryHelpModal = memo(({ disclosure }: Props) => {
   const { isOpen, onClose } = disclosure;
   return (
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
         <ModalOverlay />
         <ModalContent minWidth="max-content">
            <ModalHeader>How to define IP Scan Ranges</ModalHeader>
            <ModalCloseButton />
            <ModalBody padding={4} minWidth="max-content">
               <Flex flexGrow={1} direction="column" gap="md">
                  <Box>
                     <Heading paddingBottom={4} size="sm">
                        File Format
                     </Heading>
                     <Code whiteSpace={'nowrap'}>
                        {`{include or exclude} {NetworkAddress[/Netmask] or NetworkPattern}`}
                     </Code>
                  </Box>
                  <Box>
                     <Heading size="sm">Example</Heading>
                     <VStack alignItems={'flex-start'} padding={4}>
                        <Code>
                           include 10.2.*.*<br/>
                           exclude 10.2.4.[0-255]<br/>
                           include 10.13.0.0/16<br/>
                           include 10.80.0.0/255.255.255.0
                        </Code>
                     </VStack>
                     <Text marginTop={2}>
                        This will result in the following address ranges to be
                        probed by the discovery:
                     </Text>
                     <VStack alignItems={'flex-start'} padding={4}>
                        <Code>10.2.0.0 to 10.2.3.255</Code>
                        <Code>10.2.5.0 to 10.2.255.255</Code>
                        <Code>10.13.0.0 to 10.13.255.255</Code>
                        <Code>10.80.0.0 to 10.80.0.255</Code>
                     </VStack>
                  </Box>
                  <Box>
                     <Heading paddingBottom={4} size="sm">
                        Notes
                     </Heading>
                     <Text>
                        IP network ranges must fall on a natural subnet
                        boundary.
                     </Text>
                     <Text>
                        Blank lines and lines starting with a hash character are
                        ignored.
                     </Text>
                     <Text>
                        An <Code>exclude</Code> range will override the
                        corresponding <Code>include</Code> range (if both are
                        present).
                     </Text>
                  </Box>
                  <Box>
                     <Heading paddingBottom={4} size="sm">
                        Warnings
                     </Heading>
                     <Text>
                        Do not include massively large network ranges (eg.
                        <Code>0.0.0.0/0</Code>)
                     </Text>
                  </Box>
               </Flex>
            </ModalBody>

            <ModalFooter>
               <Button mr={3} onClick={onClose}>
                  Close
               </Button>
            </ModalFooter>
         </ModalContent>
      </Modal>
   );
});
