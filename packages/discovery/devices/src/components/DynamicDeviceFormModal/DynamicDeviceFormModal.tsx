import {
   Box,
   Button,
   Container,
   Divider,
   Flex,
   FormControl,
   Heading,
   HStack,
   Modal,
   ModalBody,
   ModalCloseButton,
   ModalContent,
   ModalHeader,
   ModalOverlay,
   Select,
   Text,
   VStack,
} from '@chakra-ui/react';
import { type Device } from '@statseeker/api/internal_api/entities';
import { FormLabel } from '@statseeker/components/Legacy/Input/Label/Label';
import { useToast } from '@statseeker/hooks';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { AnimatePresence } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FieldSelector } from '../FieldSelector';
import { DeviceFormField } from './DeviceFormField';
import { getDefaultFields, sortedFields, unregisterFields } from './utils/fieldUtils';
import { updateDevices } from '~/api/device';
import { deviceQueryKeys, queryClient } from '~/lib';
import {
   type FormField as DeviceFormFieldType,
   type DeviceFormValues,
   type FormState,
} from '~/types/deviceForm';
import { type DeviceListItem } from '~/types/general';

export function DynamicDeviceFormModal({
   isOpen,
   onClose,
   row,
   selectedCount,
   selectedDevices,
}: {
   isOpen: boolean;
   onClose: () => void;
   row?: DeviceListItem;
   selectedCount?: number;
   selectedDevices?: DeviceListItem[];
}) {
   const search = useSearch({ from: '/devices' });
   const navigate = useNavigate();
   const [formDefaults, setFormDefaults] = useState<FormState>({
      fields: [],
      availableFields: [],
   });

   const toast = useToast();
   const { register, handleSubmit, formState, unregister, reset } =
      useForm<DeviceFormValues>();

   useEffect(() => {
      if (isOpen) {
         setFormDefaults({
            fields: [],
            availableFields: sortedFields(getDefaultFields(selectedCount)),
         });
         reset({
            manual_name: row?.name,
            hostname: row?.hostname,
            ipaddress: row?.ipaddress,
            snmp_poll: row?.snmp_poll === 'on',
            ping_poll: row?.ping_poll === 'on',
            snmp_maxoid: row?.snmp_maxoid || 32,
            latitude: row?.latitude || undefined,
            longitude: row?.longitude || undefined,
            region: row?.region,
            site: row?.site,
            sysLocation: row?.sysLocation,
            sysDescr: row?.sysDescr,
            snmp_credential: row?.snmp_credential_id || undefined,
            default_poller: row?.default_poller,
            update_flags: 'lock',
         });
      }
   }, [isOpen, selectedCount, reset, row]);

   // Add a field to the form
   const handleAddField = (fieldName: string) => {
      const fieldToAdd = formDefaults.availableFields.find((field) => field.name === fieldName);

      if (!fieldToAdd) return;

      setFormDefaults((prev) => ({
         ...prev,
         fields: sortedFields([...prev.fields, fieldToAdd]),
         availableFields: sortedFields(
            prev.availableFields.filter((field) => field.name !== fieldName)
         ),
      }));
   };

   // Remove a field from the form
   const handleRemoveField = (name: DeviceFormFieldType['name']) => {
      const fieldToRemove = formDefaults.fields.find((field) => field.name === name);

      if (!fieldToRemove) return;

      // Check if there's already a field with this name in availableFields
      const existingAvailableField = formDefaults.availableFields.find(
         (field) => field.name === fieldToRemove.name
      );

      setFormDefaults((prev) => ({
         ...prev,
         fields: sortedFields(prev.fields.filter((field) => field.name !== name)),
         // Only add back to available if not already there
         availableFields: sortedFields(
            existingAvailableField
               ? prev.availableFields
               : [...prev.availableFields, { ...fieldToRemove, value: '' }]
         ),
      }));

      //remove the field from react-hook-form
      unregisterFields({ name, unregister });
   };

   const isSelected = useCallback(
      (name: DeviceFormFieldType['name']) => {
         return formDefaults.fields.some((field) => field.name === name);
      },
      [formDefaults.fields]
   );

   const updateDevicesMutation = useMutation({
      mutationKey: ['updateDevices'],
      mutationFn: updateDevices,
      onSuccess: () => {
         toast({
            title: 'Devices updated',
            description: 'Devices have been updated successfully.',
            status: 'success',
            isClosable: true,
         });
         queryClient.invalidateQueries({ queryKey: deviceQueryKeys.devices });
         navigate({
            search: (prev) => ({
               ...prev,
               selectedIds: undefined,
            }),
            replace: true,
         });
         onClose();
      },
      onError: ({ message }) => {
         toast({
            title: 'Error updating devices',
            description: message,
            status: 'error',
            isClosable: true,
         });
      },
   });

   function updateDevicesOnSubmit(data: DeviceFormValues) {
      const devicesPayload: Partial<Device> = {};

      if (isSelected('manual_name')) {
         devicesPayload.manual_name = data.manual_name;
      }

      if (isSelected('hostname')) {
         devicesPayload.hostname = data.hostname;
      }

      if (isSelected('ipaddress')) {
         devicesPayload.ipaddress = data.ipaddress;
      }

      if (isSelected('region')) {
         devicesPayload.region = data.region;
      }

      if (isSelected('sysLocation')) {
         devicesPayload.sysLocation = data.sysLocation;
      }

      if (isSelected('sysDescr')) {
         devicesPayload.sysDescr = data.sysDescr;
      }

      if (isSelected('snmp_poll')) {
         devicesPayload.snmp_poll = data.snmp_poll ? 'on' : 'off';
      }

      if (isSelected('ping_poll')) {
         devicesPayload.ping_poll = data.ping_poll ? 'on' : 'off';
      }

      if (isSelected('snmp_credential')) {
         devicesPayload.snmp_credential = data.snmp_credential;
      }

      if (isSelected('snmp_maxoid')) {
         devicesPayload.snmp_maxoid = data.snmp_maxoid;
      }

      if (devicesPayload.snmp_poll === 'on' || devicesPayload.ping_poll === 'on') {
         /* Check if any selected devices are retired */
         if (selectedDevices?.find((dev) => dev.retired === 'on')) {
            toast({
               status: 'error',
               title: 'Error',
               description: `Cannot enable retired devices.`,
            });
            return;
         }
      }

      if (isSelected('gps')) {
         devicesPayload.latitude = data.latitude;
         devicesPayload.longitude = data.longitude;
      }

      if (isSelected('site')) {
         devicesPayload.site = data.site;
      }

      updateDevicesMutation.mutate({
         filters: {
            ...search,
            selectedIds: search.selectedIds === 'all' ? undefined : search.selectedIds,
         },
         data: {
            ...devicesPayload,
            assignedPollers: undefined,
         },
         update_flags: data.update_flags,
      });
   }

   return (
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
         <ModalOverlay />
         <ModalContent minW={{ base: 'md', lg: '3xl' }} maxW={{ base: 'md', lg: '3xl' }}>
            <ModalHeader textTransform={'capitalize'}>
               {selectedCount === 1
                  ? `Update Device - ${row?.name}`
                  : `Update ${selectedCount} Devices`}
            </ModalHeader>
            <ModalCloseButton onClick={onClose} />
            <ModalBody>
               <Container paddingY={8} gap={'sm'} maxW={'100%'}>
                  <Box>
                     <Box overflowX={'visible'}>
                        <FieldSelector
                           availableFields={formDefaults.availableFields}
                           onAddField={handleAddField}
                        />
                     </Box>
                     <Divider my={6} />
                     <Box
                        as="form"
                        id="devices-form"
                        onSubmit={handleSubmit(updateDevicesOnSubmit)}
                        noValidate
                     >
                        <Heading size="md" mb={4}>
                           Update the following fields for the device
                        </Heading>
                        {formDefaults.fields.length === 0 ? (
                           <Box
                              textAlign="center"
                              p={8}
                              bg="gray.50"
                              borderRadius="md"
                              borderWidth="1px"
                              borderStyle="dashed"
                              borderColor="gray.200"
                           >
                              <Text color="gray.500">
                                 Your form is empty. Add fields from the selector above.
                              </Text>
                           </Box>
                        ) : (
                           <VStack spacing={0} align="stretch">
                              <AnimatePresence>
                                 {formDefaults.fields.map((field) => (
                                    <DeviceFormField
                                       key={field.name}
                                       field={field}
                                       register={register}
                                       onRemove={() => handleRemoveField(field.name)}
                                       errors={formState.errors}
                                    />
                                 ))}
                              </AnimatePresence>
                           </VStack>
                        )}
                        <Divider my={6} />
                        <HStack
                           spacing={2}
                           justifyContent="space-between"
                           alignItems={'flex-end'}
                           flexWrap="wrap"
                        >
                           <Flex>
                              <FormControl>
                                 <FormLabel label={'Flags'}>
                                    <Select {...register('update_flags')}>
                                       <option value="lock">lock</option>
                                       <option value="unlock">unlock</option>
                                    </Select>
                                 </FormLabel>
                              </FormControl>
                           </Flex>
                           <Flex>
                              <Button
                                 mr={3}
                                 type="submit"
                                 isDisabled={formDefaults.fields.length === 0}
                                 isLoading={updateDevicesMutation.isPending}
                              >
                                 Save
                              </Button>
                              <Button variant="ghost" onClick={onClose}>
                                 Cancel
                              </Button>
                           </Flex>
                        </HStack>
                     </Box>
                  </Box>
               </Container>
            </ModalBody>
         </ModalContent>
      </Modal>
   );
}
