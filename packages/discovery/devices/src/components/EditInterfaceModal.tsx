import {
   Box,
   Container,
   Flex,
   Spacer,
} from '@chakra-ui/react';
import { SSModal } from '@statseeker/components/Layout/Modal';
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
      <SSModal
         isOpen={isOpen}
         onClose={onClose}
         isCentered
         title={`Update ${isMultiple ? 'Interfaces' : 'Interface'}`}
         contentProps={{ maxWidth: '100vw', width: 'max-content' }}
         cancelButton={{ label: 'Close', onClick: onClose }}
         confirmButton={{ label: `Update ${isMultiple ? 'Interfaces' : 'Interface'}`, variant: 'primary' }}
      >
         <Container maxWidth={'1200px'} paddingY={8}>
            <Flex direction={'column'} gap={'lg'}>
               {isMultiple === false ? (
                  <Flex direction={'column'} gap={'lg'}>
                     <Box><Input label="Interface Name" /></Box>
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
      </SSModal>
   );
}
