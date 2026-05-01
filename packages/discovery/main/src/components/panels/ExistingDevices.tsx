import { Flex, FormLabel, Select, Switch, Text } from '@chakra-ui/react';
import { Panel } from '@statseeker/components/Disclosure/Panel';
import { getProductName } from '@statseeker/utils/environment';
import { type ChangeEvent, useRef } from 'react';
import { type ExistingDeviceOptions } from '~/types';

export function ExistingDevicesPanel({
   defaultValues,
   onChange,
   discoverMode = 'Discover',
}: {
   defaultValues: ExistingDeviceOptions;
   onChange: (data: ExistingDeviceOptions) => void;
   discoverMode: 'Discover' | 'Rewalk' | 'Manual' | 'Ping Only Discover';
}) {
   const isDirty = useRef(false);
   const isPingOnly = discoverMode === 'Ping Only Discover';
   function onSwitchChange(
      propertyName: 'excludeExistingDevices' | 'rediscoverCustomDataTypes' | 'pingOnlyForceAdd' | 'manualForceAdd',
      value: boolean
   ) {
      const newObj: ExistingDeviceOptions = { ...defaultValues };
      newObj[propertyName] = value;
      onChange(newObj);
      isDirty.current = true;
   }

   function onExcludeExistingDeviceChange(event: ChangeEvent<HTMLInputElement>) {
      let newObj: ExistingDeviceOptions = { ...defaultValues };
      if (event.target.checked) {
         newObj = {
            excludeExistingDevices: true,
            rediscoverCustomDataTypes: false,
            retestSnmpCredentials: 'none',
         };
      } else {
         newObj = {
            excludeExistingDevices: false,
            rediscoverCustomDataTypes: true,
            retestSnmpCredentials: 'down',
         };
      }
      onChange(newObj);
      isDirty.current = true;
   }

   function onRetestCredentialChange(event: ChangeEvent<HTMLSelectElement>) {
      let newObj: ExistingDeviceOptions = {
         ...defaultValues,
         retestSnmpCredentials: event.target
            .value as ExistingDeviceOptions['retestSnmpCredentials'],
      };
      onChange(newObj);
      isDirty.current = true;
   }

   return (
      <Panel
         title="Existing Device Behavior"
         className="panel-existing-device"
         subTitle={
            isDirty.current === false
               ? '- Not modified'
               : undefined
         }
      >
         <Text marginBottom={4}>
            The following options control the behaviour of some of the key steps of the Network
            Discovery process for the current run only.
         </Text>
         <Flex flexDir={'column'} gap={6}>
            {isPingOnly ? (
               <Flex gap={4}>
                  <Flex flexDir={'column'} w={'30%'}>
                     <FormLabel>Allow Adding Secondary IPs</FormLabel>
                     <Switch
                        isChecked={defaultValues?.pingOnlyForceAdd}
                        colorScheme="green"
                        onChange={(e) =>
                           onSwitchChange('pingOnlyForceAdd', e.target.checked)
                        }
                     />
                  </Flex>
                  <Flex w={'70%'}>
                     <Text>
                        If this option is selected, IP Addresses that are found during this
                        discovery which are already seen as secondary IPs for an existing device
                        will be added as a new device.
                     </Text>
                  </Flex>
               </Flex>
            ) : (
               <>
                  {discoverMode !== 'Manual' ? null : <Flex gap={4}>
                     <Flex flexDir={'column'} w={'30%'}>
                        {' '}
                        <FormLabel>Force Add</FormLabel>
                        <Switch
                           isChecked={defaultValues?.manualForceAdd}
                           colorScheme="green"
                           onChange={(e) =>
                              onSwitchChange('manualForceAdd', e.target.checked)
                           }
                        />
                     </Flex>
                     <Flex w={'70%'}>
                        <Text>
                           If this option is selected, IP Addresses that are included in this
                           discovery will be added as a new device even if existing secondary IPs for a device
                           are found, or if the IP Address isn't reachable.
                        </Text>
                     </Flex>
                  </Flex>}
                  {discoverMode === 'Rewalk' ? null : <Flex gap={4}>
                     <Flex flexDir={'column'} w={'30%'}>
                        {' '}
                        <FormLabel>Exclude Existing Devices</FormLabel>
                        <Switch
                           isChecked={defaultValues?.excludeExistingDevices}
                           colorScheme="green"
                           onChange={onExcludeExistingDeviceChange}
                        />
                     </Flex>
                     <Flex w={'70%'}>
                        <Text>
                           If this option is selected, devices that already exist in{' '}
                           {getProductName()} will be excluded from the discovery. This can decrease
                           the duration of this discovery process, but will not refresh any SNMP
                           data for existing devices.
                        </Text>
                     </Flex>
                  </Flex>}
                  {defaultValues?.excludeExistingDevices ? null : (
                     <>
                        {' '}
                        <Flex gap={4}>
                           <Flex flexDir={'column'} w={'30%'}>
                              <FormLabel>Retest SNMP Credentials</FormLabel>
                              <Select
                                 onChange={onRetestCredentialChange}
                                 value={defaultValues.retestSnmpCredentials}
                              >
                                 <option value="none">Don't retest any credentials</option>
                                 <option value="down">
                                    Retest credentials for SNMP down devices
                                 </option>
                                 <option value="all">Retest credentials for all devices</option>
                              </Select>
                           </Flex>
                           <Flex w={'70%'}>
                              <Text>
                                 This option controls which devices that already exist in{' '}
                                 {getProductName()} will have their SNMP credentials re-tested
                                 instead of just using the credentials they are currently assigned
                                 to. This step is useful for restoring monitoring of devices whose
                                 credentials have changed.
                              </Text>
                           </Flex>
                        </Flex>
                        <Flex gap={4}>
                           <Flex flexDir={'column'} w={'30%'}>
                              <FormLabel>Rediscover Custom Data Types</FormLabel>
                              <Switch
                                 isChecked={defaultValues?.rediscoverCustomDataTypes}
                                 colorScheme="green"
                                 onChange={(e) =>
                                    onSwitchChange('rediscoverCustomDataTypes', e.target.checked)
                                 }
                              />
                           </Flex>
                           <Flex w={'70%'}>
                              <Text>
                                 If this option is selected, devices that already exist in{' '}
                                 {getProductName()} will be SNMP walked to discover if they support
                                 any of the enabled Custom Data Types in {getProductName()}.
                              </Text>
                           </Flex>
                        </Flex>
                     </>
                  )}
               </>
            )}
         </Flex>
      </Panel>
   );
}
