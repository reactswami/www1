import {
   Box,
   Flex,
   FormControl,
   Text,
   useDisclosure,
} from '@chakra-ui/react';
import { type PollerListItem } from '@statseeker/api/internal_api/entities';
import { type ManualConfig } from '@statseeker/api/internal_api/entities/discover/type';
import { Button } from '@statseeker/components';
import { Panel } from '@statseeker/components/Disclosure/Panel';
import { DEFAULT_DEVICE, type Device } from '@statseeker/components/Legacy/DevicePanel';
import EntityTypeAhead from '@statseeker/components/Legacy/EntityTypeAhead/EntityTypeAhead';
import { FormLabel } from '@statseeker/components/Legacy/Input/Label/Label';
import { type EntityErrors } from '@statseeker/hooks';
import { filterStatseekerServer, getAllPollers, snmpPollerSelect, type PollerSelect } from '@statseeker/utils/apiOptions';
import { getProductName } from '@statseeker/utils/environment';
import { memo, useCallback, useEffect } from 'react';
import { DeviceCard } from '../DeviceCard';
import { ManualDeviceAdditionImportModal } from '../ManualConfigImportModal';
import { AddCredentialsModal } from './AddCredentialsModal';
import { useManualDeviceManagement } from '~/hooks';

function ManualDeviceAdd({
   onChange,
   poller,
   onPollerChange,
   shouldValidate,
   setShouldValidate,
   setEntityErrors,
   setDirty
}: {

   setDirty: (v: boolean) => void;
   shouldValidate: boolean;
   setShouldValidate: (v: boolean) => void;
   setEntityErrors: (v?: EntityErrors) => void;
   onChange: (data: ManualConfig[] | undefined, isManualMode: boolean) => void;
   poller?: PollerListItem;
   onPollerChange: (data?: PollerListItem | null) => void;
}) {
   const { isOpen, onOpen, onClose } = useDisclosure();
   const credentialDisclosure = useDisclosure();

   const {
      devices,
      manualConfigs,
      isManualMode,
      handleDeviceChange,
      handleImport,
      snmpOptions,
      resetToManualMode,
   } = useManualDeviceManagement();

   useEffect(() => {
      // Remove index before sending to parent
      const cleanConfigs = manualConfigs.map(({ index, ...rest }) => rest);
      onChange(cleanConfigs, isManualMode);
   }, [isManualMode, manualConfigs]);

   const handleDeviceCardChange = useCallback(
      (updatedDevices: Device[], deviceErrors?: EntityErrors, isDirty?: boolean) => {
         handleDeviceChange(updatedDevices);
         setEntityErrors(deviceErrors);
         setDirty(isDirty === true);
         if (isDirty === true) {
            setShouldValidate(false);
         }
      },
      [handleDeviceChange, setDirty, setEntityErrors, setShouldValidate]
   );

   /**
    * Handle mode change (Manual vs Import)
    */
   const handleModeChange = useCallback(
      (isManual: boolean) => {
         if (isManual) {
            resetToManualMode();
         } else {
            onOpen();
         }
      },
      [resetToManualMode, onOpen]
   );

   /**
    * Handle import modal completion
    */
   const handleImportComplete = useCallback(
      (configs: ManualConfig[]) => {
         setEntityErrors([]);
         setShouldValidate(true);
         handleImport(configs);
         onClose();
      },
      [handleImport, onClose, setShouldValidate]
   );


   return (
      <Panel title="Devices">
         <Flex flex={1} flexDir={'column'} gap={4}>
            <Text marginBottom={4}>
               To add a new device enter the IP Address of the device, and optionally give it a name
               and choose which SNMP Credentials it should use from the list of credentials saved in{' '}
               {getProductName()}. The Name and SNMP Credential fields are optional, and if not
               provided {getProductName()} will automatically select a name for the device and test
               the saved SNMP Credentials against the device.
            </Text>
            <Flex justifyContent={'space-between'} alignItems={'flex-end'}>
               <Box width="30%">
                  <FormControl>
                     <FormLabel
                        label="Pollers">
                        <EntityTypeAhead<PollerListItem, PollerSelect> entityQueryOption={getAllPollers} initialize defaultValue={poller}
                           onChange={(e) => {
                              if (e) {
                                 onPollerChange?.(e);
                              }
                           }}
                           filterInitialValue={filterStatseekerServer}
                           queryParams={snmpPollerSelect}
                        />
                     </FormLabel>
                  </FormControl>
               </Box>
               <Flex gap={2}>
                  <Button onClick={credentialDisclosure.onOpen} variant="secondary">
                     Add SNMP credential
                  </Button>
                  <Button onClick={() => handleModeChange(false)} variant="secondary">
                     Import Devices
                  </Button>
               </Flex>
            </Flex>
            <DeviceCard
               defaultEntity={DEFAULT_DEVICE}
               entities={devices}
               snmpOptions={snmpOptions}
               onChange={handleDeviceCardChange}
               shouldValidate={shouldValidate}
            />
            <ManualDeviceAdditionImportModal
               isOpen={isOpen}
               onClose={onClose}
               onImport={handleImportComplete}
            />
            <AddCredentialsModal isOpen={credentialDisclosure.isOpen} onClose={credentialDisclosure.onClose} />
         </Flex>
      </Panel>
   );
}

export const ManualDeviceAddition = memo(ManualDeviceAdd);