import {
   Box,
   Button,
   Container,
   Flex,
   Modal,
   ModalBody,
   ModalCloseButton,
   ModalContent,
   ModalFooter,
   ModalHeader,
   ModalOverlay,
   Spacer,
} from '@chakra-ui/react';
import { Input } from '@statseeker/components';

export function EditInterfaceModal({
   isOpen,
   onClose,
   interfaceIds,
}: {
   isOpen: boolean;
   onClose: () => void;
   interfaceIds?: 'all' | number[];
}) {
   const isMultiple = (interfaceIds && interfaceIds.length > 1) || interfaceIds === 'all';
   return (
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
         <ModalOverlay />
         <ModalContent maxWidth={'100vw'} width={'max-content'}>
            <ModalHeader textTransform={'capitalize'}>
               Update {isMultiple ? 'Interfaces' : 'Interface'}
            </ModalHeader>
            <ModalCloseButton onClick={onClose} />
            <ModalBody>
               <Container maxWidth={'1200px'} paddingY={8}>
                  <Flex direction={'column'} gap={'lg'}>
                     {isMultiple === false ? (
                        <Flex direction={'column'} gap={'lg'}>
                           <Box>
                              <Input label="Interface Name" />
                           </Box>
                           <Input label="IfTitle" />
                        </Flex>
                     ) : null}
                     <Flex as="form" gap="sm">
                        <Flex gap={'lg'} flexShrink={0} flexGrow={1} flexDir={'column'}>
                        <Input label="NonUnicastField" />
                           <Input label="Polling On/Off" />
                           <Input label="SNMP Polling" />
                           <Input label="Speed" />
                        </Flex>
                        <Spacer minHeight={'2rem'} />
                        <Flex gap="lg" flexShrink={0} flexGrow={1} flexDir={'column'}>
                           <Input label="Speed Tx" />
                           <Input label="Speed Rx" />
                           <Input label="ifOperStatus" />
                           <Input label="ifAdminStatus" />

                        </Flex>
                     </Flex>
                  </Flex>
               </Container>
            </ModalBody>
            <ModalFooter>
               {' '}
               <Button variant={'outline'} mr={3} onClick={onClose}>
                  Close{' '}
               </Button>
               <Button variant="solid">Update {isMultiple ? 'Interfaces' : 'Interface'}</Button>
            </ModalFooter>
         </ModalContent>
      </Modal>
   );
}
