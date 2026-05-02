import { Flex, FormLabel, Select, Switch, Text } from '@statseeker/components/Layout';
import { Panel } from '@statseeker/components/Disclosure/Panel';
import { useRef, type ChangeEvent } from 'react';
import { type MonitoringOptions } from '~/types';

export function MonitoringOptionsPanel({
   defaultValues = {
      operstatusPolling: false,
      adminStatusPolling: true,
   },
   onChange,
}: {
   defaultValues?: Pick<MonitoringOptions, 'adminStatusPolling' | 'operstatusPolling' | 'nonUnicastPacketPolling'>;
   onChange: (data: MonitoringOptions) => void;
}) {

   const isDirty = useRef(false);

   function onSwitchChange(
      propertyName: 'operstatusPolling' | 'adminStatusPolling',
      value: boolean
   ) {
      const newObj: MonitoringOptions = { ...defaultValues };
      newObj[propertyName] = value;
      onChange(newObj);
      isDirty.current = true;
   }

   function onNonUnicastPacketPollingChange(event: ChangeEvent<HTMLSelectElement>) {
      let newObj: MonitoringOptions = {
         ...defaultValues,
         nonUnicastPacketPolling: event.target.value,
      };
      onChange(newObj);
      isDirty.current = true;
   }

   return (
      <Panel
         title="Monitoring Options"
         className="panel-monitoring-options"
         subTitle={
            isDirty.current === false
               ? '- Not modified'
               : undefined
         }
      >
         <Text marginBottom={4}>
            The following options control what steps occur after the current discovery has
            completed.
         </Text>
         <Flex flexDir={'column'} gap={6}>
            <Flex gap={4}>
               <Flex flexDir={'column'} w={'30%'}>
                  {' '}
                  <FormLabel>Operstatus Polling</FormLabel>
                  <Switch
                     isChecked={defaultValues?.operstatusPolling}
                     colorScheme="green"
                     onChange={(e) => onSwitchChange('operstatusPolling', e.target.checked)}
                  />
               </Flex>
               <Flex w={'70%'}>
                  <Text>
                     Define whether OperStatus polling will be enabled or disabled for newly
                     discovered interfaces.
                  </Text>
               </Flex>
            </Flex>
            <Flex gap={4}>
               <Flex flexDir={'column'} w={'30%'}>
                  <FormLabel>Admin Status Polling</FormLabel>
                  <Switch
                     isChecked={defaultValues?.adminStatusPolling}
                     colorScheme="green"
                     onChange={(e) => onSwitchChange('adminStatusPolling', e.target.checked)}
                  />
               </Flex>
               <Flex w={'70%'}>
                  <Text>
                     Define whether AdminStatus polling will be enabled or disabled for newly
                     discovered interfaces
                  </Text>
               </Flex>
            </Flex>
            <Flex gap={4}>
               <Flex flexDir={'column'} w={'30%'}>
                  <FormLabel>Non-unicast packet polling</FormLabel>
                  <Select
                     onChange={onNonUnicastPacketPollingChange}
                     value={defaultValues?.nonUnicastPacketPolling}
                  >
                     <option value="global">Global</option>
                     <option value="on">On</option>
                     <option value="off">Off</option>
                  </Select>
               </Flex>
               <Flex w={'70%'}>
                  <Text>
                     Enabling this feature will turn on non-unicast monitoring for all newly
                     discovered interfaces on your network. This will increase polling by 2 to 6
                     OIDs per interface. The Global option indicates that newly discovered
                     interfaces will always use the Advanced Options non-unicast monitoring
                     behaviour.
                  </Text>
               </Flex>
            </Flex>
         </Flex>
      </Panel>
   );
}
