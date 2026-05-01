import {
   Modal,
   ModalOverlay,
   ModalContent,
   ModalCloseButton,
   ModalBody,
   Heading,
   Button,
   Flex,
   VStack,
   Text,
   Code,
   Box,
   ModalHeader,
   ModalFooter,
} from '@chakra-ui/react';
import { useState } from 'react';
import FileUpload from '../FileUpload/FileUpload';
import { type UseImportRangesFromFileReturn } from './types';

export default function ImportRangesFromFileModal({
   ipRangeDisclosure,
   uploadIpRange,
   isUploading,
   methods,
}: UseImportRangesFromFileReturn) {
   const { getValues } = methods;
   const { onClose, isOpen } = ipRangeDisclosure;
   const [ hasFile, setHasFile ] = useState<boolean>(false);

   const checkHasFile = (filename: string | null) => {
      setHasFile(filename !== null);
   };

   return (
      <Modal isOpen={isOpen} isCentered onClose={onClose}>
         <ModalOverlay />
         <ModalContent maxWidth={'100vw'} width={'xxl'}>
            <ModalHeader>Import IP Address Ranges From File</ModalHeader>
            <ModalCloseButton />
            <ModalBody padding={4}>
               <Flex flexGrow={1} direction="column" gap="md">
                  <Box>
                     <Heading paddingBottom={4} size="sm">
                        IP Address Ranges File Format
                     </Heading>
                     <Code whiteSpace={'nowrap'}>
                        {`{include or exclude} {NetworkAddress[/Netmask] or NetworkPattern}`}
                     </Code>
                  </Box>
                  <Box>
                     <Heading size="sm" marginBottom={2}>Example</Heading>
                     <Code>
                        include 10.2.*.*<br/>
                        include 10.13.0.0/16<br/>
                        exclude 10.2.4.[0-255]<br/>
                        10.80.0.0/255.255.255.0
                     </Code>
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
                     <Text>
                        Blank lines and lines starting with a hash (<Code>#</Code>) character are ignored
                     </Text>
                     <Text>
                        Lines without an <Code>include\exclude</Code> declaration will be treated as an <Code>include</Code>
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
                  <FileUpload methods={methods} callback={checkHasFile} />
               </Flex>
            </ModalBody>

            <ModalFooter>
               <Flex gap="md" paddingTop={'1rem'} alignSelf={'flex-end'}>
                  <Button onClick={onClose} isDisabled={isUploading} variant="ghost">
                     Cancel
                  </Button>
                  <Button
                     isDisabled={!hasFile}
                     isLoading={isUploading}
                     onClick={() => {
                        if (getValues('file')) {
                           uploadIpRange({ file: getValues('file') });
                        }
                     }}
                  >
                    Import Ranges
                 </Button>
               </Flex>
            </ModalFooter>
         </ModalContent>
      </Modal>
   );
}
