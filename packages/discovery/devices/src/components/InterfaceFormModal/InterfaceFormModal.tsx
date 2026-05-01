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
import { type Port } from '@statseeker/api/internal_api/entities';
import { FormLabel } from '@statseeker/components/Legacy/Input/Label/Label';
import { useToast } from '@statseeker/hooks';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { AnimatePresence } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FieldSelector } from '../FieldSelector';
import { decodeSpeedUnits, decodeSpeedValue } from '../IfSpeedDropDown';
import { InterfaceFormField } from './InterfaceFormField';
import { getDefaultFields, sortedFields } from './interfaceFormFields';
import {
   type InterfaceFormValues,
   type InterfaceFormField as FormFieldType,
   type FormState,
} from './types';
import { unregisterFields } from './utils';
import { updateInterfaces } from '~/api/port';
import { portQueryKeys, queryClient } from '~/lib';
import { type PortListItem } from '~/types/general';

export function InterfaceFormModal({
   isOpen,
   onClose,
   row,
   selectedCount,
   selectedPorts,
}: {
   isOpen: boolean;
   onClose: () => void;
   row?: PortListItem;
   selectedCount?: number;
   selectedPorts?: PortListItem[];
}) {
   const search = useSearch({ from: '/interfaces' });
   const navigate = useNavigate();
   const [formDefaults, setFormDefaults] = useState<FormState>({
      fields: [],
      availableFields: [],
   });

   const toast = useToast();
   const { register, handleSubmit, formState, unregister, reset } = useForm<InterfaceFormValues>();

   useEffect(() => {
      if (isOpen) {
         setFormDefaults({
            fields: [],
            availableFields: sortedFields(getDefaultFields()),
         });
         reset({
            ifTitle: row?.ifTitle,
            ifSpeed: decodeSpeedValue(row?.ifSpeed) || 1,
            ifOutSpeed: decodeSpeedValue(row?.ifOutSpeed) || 1,
            ifInSpeed: decodeSpeedValue(row?.ifInSpeed) || 1,
            ifAdminStatusPoll: row?.ifAdminStatusPoll === 'on',
            ifOperStatusPoll: row?.ifOperStatusPoll === 'on',
            poll: row?.poll === 'on',
            ifNonUnicast: row?.ifNonUnicast ?? 'global',
            ifSpeedUnits: decodeSpeedUnits(row?.ifSpeed),
            ifOutSpeedUnits: decodeSpeedUnits(row?.ifOutSpeed),
            ifInSpeedUnits: decodeSpeedUnits(row?.ifInSpeed),
            update_flags: 'lock',
         });
      }
   }, [isOpen, reset, row]);

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
   const handleRemoveField = (name: FormFieldType['name']) => {
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

      unregisterFields({ name, unregister });
   };

   const isSelected = useCallback(
      (name: FormFieldType['name']) => {
         return formDefaults.fields.some((field) => field.name === name);
      },
      [formDefaults.fields]
   );

   const updateInterfacesMutation = useMutation({
      mutationKey: ['updateInterfaces'],
      mutationFn: updateInterfaces,
      onSuccess: () => {
         toast({
            title: 'Interfaces updated',
            description: 'Interfaces have been updated successfully.',
            status: 'success',
            isClosable: true,
         });
         queryClient.invalidateQueries({ queryKey: portQueryKeys.ports });
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
            title: 'Error updating Interfaces',
            description: message,
            status: 'error',
            isClosable: true,
         });
      },
   });

   function updateInterfacesOnSubmit(data: InterfaceFormValues) {
      const {
         update_flags,
         ifSpeedUnits,
         ifOutSpeedUnits,
         ifInSpeedUnits,
         poll,
         ifOperStatusPoll,
         ifAdminStatusPoll,
         ifNonUnicast,
         ifTitle,
         ifSpeed,
         ifInSpeed,
         ifOutSpeed,
      } = data;
      const portPayload: Partial<Port> = {};

      if (isSelected('ifTitle')) {
         portPayload.ifTitle = ifTitle;
      }

      if (ifSpeed && ifSpeedUnits && isSelected('ifSpeed')) {
         portPayload.ifSpeed = ifSpeed * ifSpeedUnits;
      }

      if (ifInSpeed && ifInSpeedUnits && isSelected('ifInSpeed')) {
         portPayload.ifInSpeed = ifInSpeed * ifInSpeedUnits;
      }

      if (ifOutSpeed && ifOutSpeedUnits && isSelected('ifOutSpeed')) {
         portPayload.ifOutSpeed = ifOutSpeed * ifOutSpeedUnits;
      }

      if (isSelected('poll')) {
         portPayload.poll = poll ? 'on' : 'off';
      }

      if (isSelected('ifOperStatusPoll')) {
         portPayload.ifOperStatus = ifOperStatusPoll ? 'on' : 'off';
      }

      if (isSelected('ifAdminStatusPoll')) {
         portPayload.ifAdminStatus = ifAdminStatusPoll ? 'on' : 'off';
      }

      if (isSelected('ifNonUnicast')) {
         portPayload.ifNonUnicast = ifNonUnicast;
      }

      if (
         portPayload.poll === 'on' ||
         portPayload.ifOperStatus === 'on' ||
         portPayload.ifAdminStatus === 'on'
      ) {
         /* Check if any disabled/retired devices are selected */
         if (selectedPorts?.find((port) => port.deviceRetired === 'on')) {
            toast({
               status: 'error',
               title: 'Error',
               description: `Cannot enable interfaces on retired devices.`,
            });
            return;
         } else if (selectedPorts?.find((port) => port.devicePoll === 'off')) {
            toast({
               status: 'error',
               title: 'Error',
               description: `Cannot enable interfaces on disabled devices.`,
            });
            return;
         }
      }

      updateInterfacesMutation.mutate({
         filters: {
            ...search,
            selectedIds: search.selectedIds === 'all' ? undefined : search.selectedIds,
         },
         data: portPayload,
         update_flags,
      });
   }

   return (
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
         <ModalOverlay />
         <ModalContent minW={{ base: 'lg', lg: '3xl' }} maxW={{ base: 'lg', lg: '3xl' }}>
            <ModalHeader textTransform={'capitalize'}>
               {selectedCount === 1
                  ? `Update Interface - ${row?.deviceName} ${row?.name}`
                  : `Update ${selectedCount} Interfaces`}
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
                        onSubmit={handleSubmit(updateInterfacesOnSubmit)}
                        noValidate
                     >
                        <Heading size="md" mb={4}>
                           Update the following fields for the interface
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
                                    <InterfaceFormField
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
                                 isLoading={updateInterfacesMutation.isPending}
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
