import {
   Box,
   Button,
   Container,
   Divider,
   FormControl,
   Grid,
   GridItem,
   Heading,
   Modal,
   ModalBody,
   ModalCloseButton,
   ModalContent,
   ModalFooter,
   ModalHeader,
   ModalOverlay,
   Select,
   Switch,
   VStack,
} from '@chakra-ui/react';
import { Input } from '@statseeker/components';
import { FormLabel } from '@statseeker/components/Legacy/Input/Label/Label';
import { useQuery } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { snmpCredentialsQueryOptions } from '~/lib';

function FormSection({ title, children }: { title: string; children: ReactNode }) {
   return (
      <Box mb={8} width="100%">
         <Heading as="h3" size="md" mb={2}>
            {title}
         </Heading>
         <Divider mb={6} borderColor="neutral.200" />
         {children}
      </Box>
   );
}

export function EditDeviceModal({
   isOpen,
   onClose,
   deviceIds,
}: {
   isOpen: boolean;
   onClose: () => void;
   deviceIds?: 'all' | number[];
}) {
   const isMultiple = (deviceIds && deviceIds.length > 1) || deviceIds === 'all';
   const snmpCredentials = useQuery(snmpCredentialsQueryOptions.get());

   return (
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
         <ModalOverlay />
         <ModalContent maxWidth={'100vw'} width={'max-content'}>
            <ModalHeader textTransform={'capitalize'}>
               Update {isMultiple ? 'Devices' : 'Device'}
            </ModalHeader>
            <ModalCloseButton onClick={onClose} />
            <ModalBody>
               <Container maxWidth={'1200px'} paddingY={8} gap={'sm'}>
                  <Box backgroundColor={'white'}>
                     <VStack spacing={4} align={'flex-start'} as={'form'}>
                        <FormSection title="Device Information">
                           <Grid templateColumns={'repeat(2, 1fr)'} gap={2}>
                              <Input label="Device Name" />
                              <Input label="Host Name" />
                              <Input label="IP Address" />
                           </Grid>
                        </FormSection>
                        <FormSection title="SNMP Configuration">
                           <Grid templateColumns={'repeat(2, 1fr)'} gap={2}>
                              {' '}
                              <FormControl>
                                 <FormLabel label="SNMP Credential Name">
                                    <Select>
                                       {snmpCredentials.data?.map((credential) => (
                                          <option key={credential.id} value={credential.id}>
                                             {credential.name}
                                          </option>
                                       ))}
                                    </Select>
                                 </FormLabel>
                              </FormControl>
                              <FormControl>
                                 <FormLabel label="MAX SNMP OIDS">
                                    <Select>
                                       <option value="">5</option>
                                       <option value="">10</option>
                                       <option value="">20</option>
                                       <option value="">30</option>
                                       <option value="">40</option>
                                       <option value="">50</option>
                                    </Select>
                                 </FormLabel>
                              </FormControl>
                              <FormControl>
                                 <FormLabel label="SNMP Poll">
                                    <Switch display={'block'} />
                                 </FormLabel>
                              </FormControl>
                           </Grid>
                        </FormSection>
                        <FormSection title="Polling Configuration">
                           <Grid templateColumns={'repeat(2, 1fr)'} gap={2}>
                              <FormControl>
                                 <FormLabel label="Default Poller">
                                    <Select>
                                       <option value="">Poller 1</option>
                                       <option value="">Poller 2</option>
                                       <option value="">Poller 3</option>
                                       <option value="">Poller 4</option>
                                    </Select>
                                 </FormLabel>
                              </FormControl>
                              <FormControl>
                                 <FormLabel label="Pollers">
                                    <Select>
                                       <option value="">Poller 1</option>
                                       <option value="">Poller 2</option>
                                       <option value="">Poller 3</option>
                                       <option value="">Poller 4</option>
                                    </Select>
                                 </FormLabel>
                              </FormControl>
                              <FormControl>
                                 <FormLabel label="Ping Poll">
                                    <Switch display={'block'} />
                                 </FormLabel>
                              </FormControl>
                           </Grid>
                        </FormSection>
                        <FormSection title="Location">
                           <Grid templateColumns={'repeat(2, 1fr)'} gap={2}>
                              <GridItem>
                                 <Input label="Region" />
                              </GridItem>
                              <GridItem>
                                 <Input label="Longitude" />
                              </GridItem>
                              <GridItem>
                                 <Input label="Latitude" />
                              </GridItem>
                              <GridItem>
                                 <Input label="Location" />
                              </GridItem>
                              <GridItem>
                                 <Input label="Site" />
                              </GridItem>
                           </Grid>
                        </FormSection>
                     </VStack>
                  </Box>
               </Container>
            </ModalBody>
            <ModalFooter>
               {' '}
               <Button variant={'outline'} mr={3} onClick={onClose}>
                  Close{' '}
               </Button>
               <Button variant="solid">Update {isMultiple ? 'Devices' : 'Device'}</Button>
            </ModalFooter>
         </ModalContent>
      </Modal>
   );
}
