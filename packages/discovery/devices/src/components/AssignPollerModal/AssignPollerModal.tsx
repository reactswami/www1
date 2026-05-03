// ============================================================================
// AssignPollerModal.tsx - Poller Assignment popup
// ============================================================================
import {
   Box,
   Container,
   Flex,
   FormControl,
   HStack,
   Select,
   Text,
} from '@chakra-ui/react';
import { SSModal } from '@statseeker/components/Layout/Modal';
import EntityTypeAhead from '@statseeker/components/Legacy/EntityTypeAhead/EntityTypeAhead';
import { FormLabel } from '@statseeker/components/Legacy/Input/Label/Label';
import { filterStatseekerServer, getAllPollers, pingPollerSelect, snmpPollerSelect } from '@statseeker/utils/apiOptions';
import { Controller } from 'react-hook-form';
import { useAssignPoller } from './useAssignPoller';
import { type DeviceListItem } from '~/types/general';

const PollerProps = {
   gap: 4,
   paddingTop: '4',
   paddingBottom: '8',
   paddingX: '4',
   borderRadius: 'sm',
   border: 'solid 1px',
   borderColor: 'gray.200',
};

export function AssignPollerModal({
   isOpen,
   onClose,
   row,
   selectedCount,
}: {
   isOpen: boolean;
   onClose: () => void;
   row?: DeviceListItem;
   selectedCount?: number;
}) {
   const { control, submitHandler, isAdvanced, defaultPollerSelect, onModeChange, pingPollers, isSubmitting } =
      useAssignPoller({ isOpen, onClose, row, selectedCount });

   return (
      <SSModal
         isOpen={isOpen}
         onClose={onClose}
         isCentered
         title={selectedCount === 1 ? `Assign Poller to - ${row?.name}` : `Assign Pollers to ${selectedCount} Devices`}
         contentProps={{ minW: { base: 'md', lg: '3xl' }, maxW: { base: 'md', lg: '3xl' } }}
         hideCloseButton={false}
         modalProps={{ closeOnOverlayClick: !isSubmitting } as any}
      >
         <Container padding={0} paddingY={2} maxW={'100%'}>
            <form onSubmit={submitHandler}>
               <Flex gap={4} flexDirection={'column'}>
                  <FormControl w={'200px'}>
                     <FormLabel label="Mode">
                        <Select
                           position={'relative'}
                           onChange={onModeChange}
                           value={isAdvanced ? 1 : 0}
                           size={'md'}
                           isDisabled={isSubmitting}
                        >
                           <option value={0}>Basic</option>
                           <option value={1}>Advanced</option>
                        </Select>
                     </FormLabel>
                  </FormControl>

                  {!isAdvanced && (
                     <>
                        <Text>Move the selected device(s) to a poller</Text>
                        <Flex {...PollerProps}>
                           <Box width={'200px'}>
                              <Controller
                                 name="basic"
                                 control={control}
                                 rules={{ required: 'SNMP poller is required' }}
                                 render={({ field, fieldState }) => (
                                    <EntityTypeAhead
                                       onChange={field.onChange}
                                       value={field.value}
                                       entityQueryOption={getAllPollers}
                                       {...(selectedCount ?? 0) > 1 && { filterInitialValue: filterStatseekerServer }}
                                       queryParams={snmpPollerSelect}
                                       label="SNMP Poller"
                                       error={fieldState.error?.message}
                                       isDisabled={isSubmitting}
                                    />
                                 )}
                              />
                           </Box>
                        </Flex>
                     </>
                  )}

                  {isAdvanced && (
                     <>
                        <Text>Configure the polling of the selected device(s)</Text>
                        <Flex {...PollerProps}>
                           <Box width={'200px'}>
                              <Controller
                                 name="snmp"
                                 control={control}
                                 rules={{ required: 'SNMP poller is required' }}
                                 render={({ field, fieldState }) => (
                                    <EntityTypeAhead
                                       onChange={field.onChange}
                                       value={field.value}
                                       entityQueryOption={getAllPollers}
                                       queryParams={snmpPollerSelect}
                                       label="SNMP Poller"
                                       error={fieldState.error?.message}
                                       isDisabled={isSubmitting}
                                    />
                                 )}
                              />
                           </Box>
                           <Box width={'200px'}>
                              <Controller
                                 name="ping"
                                 control={control}
                                 rules={{ required: 'At least one ping poller is required', validate: (value) => (value && value.length > 0) || 'At least one ping poller is required' }}
                                 render={({ field, fieldState }) => (
                                    <EntityTypeAhead
                                       isMulti={true}
                                       onChange={field.onChange}
                                       value={field.value}
                                       entityQueryOption={getAllPollers}
                                       queryParams={pingPollerSelect}
                                       label="Ping Pollers"
                                       error={fieldState.error?.message}
                                       isDisabled={isSubmitting}
                                    />
                                 )}
                              />
                           </Box>
                           <Box width={'200px'}>
                              <Controller
                                 name="defaultPing"
                                 control={control}
                                 rules={{ required: 'Default ping poller is required' }}
                                 render={({ field, fieldState }) => (
                                    <EntityTypeAhead
                                       onChange={field.onChange}
                                       value={field.value}
                                       entityQueryOption={getAllPollers}
                                       queryParams={defaultPollerSelect(pingPollers)}
                                       label="Default Ping Poller"
                                       error={fieldState.error?.message}
                                       isDisabled={isSubmitting}
                                    />
                                 )}
                              />
                           </Box>
                        </Flex>
                     </>
                  )}

                  <Box id="devices-form">
                     <HStack spacing={2} justifyContent="flex-end" alignItems={'flex-end'} flexWrap="wrap">
                        <Flex>
                           <button type="submit" style={{ display: 'none' }} />
                           {/* Buttons rendered inline since form is inside body */}
                        </Flex>
                     </HStack>
                  </Box>
               </Flex>
            </form>
         </Container>
      </SSModal>
   );
}
