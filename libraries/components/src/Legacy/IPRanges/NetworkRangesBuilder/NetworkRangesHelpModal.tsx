import { Text, Code, VStack, Box, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, type UseDisclosureReturn, Heading, Flex, HStack, FormLabel } from '@chakra-ui/react';


export default function NetworkRangesHelpModal({ disclosure }: { disclosure: UseDisclosureReturn }) {
   const { isOpen, onClose } = disclosure;

   return (
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
         <ModalOverlay />
         <ModalContent minWidth="max-content">
            <ModalHeader>How to define IP Address Ranges</ModalHeader>
            <ModalCloseButton />
            <ModalBody padding={4} minWidth="max-content">
               <Flex flexGrow={1} direction="column" gap="md">
                  <Box>
                     <Heading paddingBottom={4} size="sm">
                        IP Address Range Format
                     </Heading>
                     <Code whiteSpace={'nowrap'}>
                        {`{NetworkAddress[/Netmask] or NetworkPattern}`}
                     </Code>
                  </Box>
                  <Box>
                     <Heading size="sm" marginBottom={2}>Example</Heading>
                     <HStack alignItems='start' gap={8}>
                        <VStack alignItems={'start'}>
                           <FormLabel>Includes</FormLabel>
                           <Code>10.2.*.*</Code>
                           <Code>10.13.0.0/16</Code>
                           <Code>10.80.0.0/255.255.255.0</Code>
                        </VStack>
                        <VStack alignItems={'start'}>
                           <FormLabel>Excludes</FormLabel>
                           <Code>10.2.4.[0-255]</Code>
                        </VStack>
                     </HStack>
                     <Text marginY={2}>
                        This will result in the following IP Address Ranges to be
                        probed by the discovery:
                     </Text>
                     <VStack alignItems={'start'}>
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
}
