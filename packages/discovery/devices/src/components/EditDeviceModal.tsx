import {
   Box,
   Container,
   Divider,
   FormControl,
   Grid,
   GridItem,
   Heading,
   Select,
   Switch,
   VStack,
} from '@chakra-ui/react';
import { Button } from '@statseeker/components/Form/Button';
import { SSModal } from '@statseeker/components/Layout/Modal';
import { Input } from '@statseeker/components';
import { FormLabel } from '@statseeker/components/Legacy/Input/Label/Label';
import { useQuery } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { snmpCredentialsQueryOptions } from '~/lib';

function FormSection({ title, children }: { title: string; children: ReactNode }) {
   return (
      <Box mb={8} width="100%">
         <Heading as="h3" size="md" mb={2}>{title}</Heading>
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
      <SSModal
         isOpen={isOpen}
         onClose={onClose}
         isCentered
         title={`Update ${isMultiple ? 'Devices' : 'Device'}`}
         contentProps={{ maxWidth: '100vw', width: 'max-content' }}
         cancelButton={{ label: 'Close', onClick: onClose }}
         confirmButton={{ label: `Update ${isMultiple ? 'Devices' : 'Device'}`, variant: 'primary' }}
      >
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
                        <FormControl>
                           <FormLabel label="SNMP Credential Name">
                              <Select>
                                 {snmpCredentials.data?.map((credential) => (
                                    <option key={credential.id} value={credential.id}>{credential.name}</option>
                                 ))}
                              </Select>
                           </FormLabel>
                        </FormControl>
                        <FormControl>
                           <FormLabel label="MAX SNMP OIDS">
                              <Select>
                                 {['5','10','20','30','40','50'].map(v => <option key={v} value={v}>{v}</option>)}
                              </Select>
                           </FormLabel>
                        </FormControl>
                        <FormControl>
                           <FormLabel label="SNMP Poll"><Switch display={'block'} /></FormLabel>
                        </FormControl>
                     </Grid>
                  </FormSection>
                  <FormSection title="Polling Configuration">
                     <Grid templateColumns={'repeat(2, 1fr)'} gap={2}>
                        <FormControl>
                           <FormLabel label="Default Poller">
                              <Select>{['Poller 1','Poller 2','Poller 3','Poller 4'].map(p => <option key={p}>{p}</option>)}</Select>
                           </FormLabel>
                        </FormControl>
                        <FormControl>
                           <FormLabel label="Pollers">
                              <Select>{['Poller 1','Poller 2','Poller 3','Poller 4'].map(p => <option key={p}>{p}</option>)}</Select>
                           </FormLabel>
                        </FormControl>
                        <FormControl>
                           <FormLabel label="Ping Poll"><Switch display={'block'} /></FormLabel>
                        </FormControl>
                     </Grid>
                  </FormSection>
                  <FormSection title="Location">
                     <Grid templateColumns={'repeat(2, 1fr)'} gap={2}>
                        <GridItem><Input label="Region" /></GridItem>
                        <GridItem><Input label="Longitude" /></GridItem>
                        <GridItem><Input label="Latitude" /></GridItem>
                        <GridItem><Input label="Location" /></GridItem>
                        <GridItem><Input label="Site" /></GridItem>
                     </Grid>
                  </FormSection>
               </VStack>
            </Box>
         </Container>
      </SSModal>
   );
}
