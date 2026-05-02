import { Code, Flex, FormLabel, Switch, Text } from '@statseeker/components/Layout';
import { Input } from '@statseeker/components';
import { Panel } from '@statseeker/components/Disclosure/Panel';
import { useRef } from 'react';
import { type KeysOfValue, type SNMPOptions } from '~/types';

export function SNMPOptionsPanel({
   defaultValues = {
      maxSimultaneousWalks: 5000,
      maxSimultaneousDeviceWalks: 10,
      maxRepetitions: 50,
      useGetNext: false,
      minimalWalk: false,
      snmpErrorLog: false,
      numberOfRetries: 2,
      walkTimeout: 5,
   },
   onChange,
}: {
   defaultValues?: Partial<SNMPOptions>;
   onChange: (data: Partial<SNMPOptions>) => void;
}) {

   const isDirty = useRef(false);

   function onSwitchChange({
      propertyName,
      value,
   }: {
      propertyName: KeysOfValue<SNMPOptions, boolean>;
      value: boolean;
   }) {
      const newObj: Partial<SNMPOptions> = { ...defaultValues };
      newObj[propertyName] = value;
      onChange(newObj);
      isDirty.current = true;
   }

   function onTextChange({
      propertyName,
      value,
   }: {
      propertyName: KeysOfValue<SNMPOptions, number>;
      value: number;
   }) {
      const newObj: Partial<SNMPOptions> = { ...defaultValues };
      newObj[propertyName] = value;
      onChange(newObj);
      isDirty.current = true;
   }

   return (
      <Panel
         title="SNMP Options"
         className="panel-snmp-options"
         subTitle={
            isDirty.current === false
               ? '- Not modified'
               : undefined
         }
      >
         <Text marginBottom={4}>
            The following options control the behaviour of the SNMP steps of the Network Discovery
            process for the current run only.
         </Text>
         <Flex flexDir={'column'} gap={4}>
            <Flex gap={4}>
               <Flex flexDir={'column'} w={'30%'}>
                  {' '}
                  <FormLabel>SNMP Error Log</FormLabel>
                  <Switch
                     isChecked={defaultValues.snmpErrorLog}
                     colorScheme="green"
                     onChange={(e) =>
                        onSwitchChange({
                           propertyName: 'snmpErrorLog',
                           value: e.target.checked,
                        })
                     }
                  />
               </Flex>
               <Flex w={'70%'}>
                  <Text>
                     Enabling this will include SNMP error messages in the discovery log, helping in the
                     identification of SNMP issues with devices.
                  </Text>
               </Flex>
            </Flex>
            <Flex gap={4}>
               <Flex w={'30%'}>
                  <Input
                     label="Walk Timeout"
                     defaultValue={defaultValues?.walkTimeout?.toString()}
                     onChange={(data) =>
                        onTextChange({
                           propertyName: 'walkTimeout',
                           value: Number(data.target.value),
                        })
                     }
                  />
               </Flex>
               <Flex w={'70%'}>
                  <Text>
                     This setting defines the maximum number of seconds to wait for a response to a SNMP walk request.
                     If the response time exceeds this limit, the walk will be terminated, and the next queued walk will be initiated.
                  </Text>
               </Flex>
            </Flex>
            <Flex gap={4}>
               <Flex w={'30%'}>
                  <Input
                     label="Number Of Retries"
                     defaultValue={defaultValues?.numberOfRetries?.toString()}
                     onChange={(data) =>
                        onTextChange({
                           propertyName: 'numberOfRetries',
                           value: Number(data.target.value),
                        })
                     }
                  />
               </Flex>
               <Flex w={'70%'}>
                  <Text>
                     This setting specifies how many times a failed SNMP walk will be retried for a given request.
                     If the number of SNMP retries exceeds this limit, the walk will be terminated and the next
                     queued walk will start.
                  </Text>
               </Flex>
            </Flex>
            <Flex gap={6}>
               <Flex w={'30%'}>
                  <Input
                     label="Max Repetitions"
                     defaultValue={defaultValues?.maxRepetitions?.toString()}
                     onChange={(data) =>
                        onTextChange({
                           propertyName: 'maxRepetitions',
                           value: Number(data.target.value),
                        })
                     }
                  />
               </Flex>
               <Flex w={'70%'}>
                  <Text>
                     The value used by SNMP GETBULK, specifying the number of objects returned
                     during each step of walking a device. Reduce this value if the device responds
                     to SNMP but walking the device fails. Reducing this value for a large number of
                     devices will result in a longer discovery.
                  </Text>
               </Flex>
            </Flex>
            <Flex gap={4}>
               <Flex flexDir={'column'} w={'30%'}>
                  {' '}
                  <FormLabel>Minimal Walk</FormLabel>
                  <Switch
                     isChecked={defaultValues.minimalWalk}
                     colorScheme="green"
                     onChange={(e) =>
                        onSwitchChange({
                           propertyName: 'minimalWalk',
                           value: e.target.checked,
                        })
                     }
                  />
               </Flex>
               <Flex w={'70%'}>
                  <Text>
                     This setting enables a minimal discovery mechanism that retrieves only a small,
                     basic subset of SNMP MIB data from devices found during discovery. These devices
                     are then marked to use the same minimal process in future discoveries.
                     The following SNMP tables are queried: <br></br>
                     <Code>SNMPv2-MIB.system</Code>
                     <br />
                     <Code> SNMP-FRAMEWORK-MIB.snmpEngine</Code>
                     <br />
                     <Code> IF-MIB.ifTable</Code>
                     <br />
                     <Code> IF-MIB.ifXTable</Code>
                  </Text>
               </Flex>
            </Flex>
            <Flex gap={4}>
               <Flex flexDir={'column'} w={'30%'}>
                  {' '}
                  <FormLabel>Use Getnext</FormLabel>
                  <Switch
                     isChecked={defaultValues.useGetNext}
                     colorScheme="green"
                     onChange={(e) =>
                        onSwitchChange({ propertyName: 'useGetNext', value: e.target.checked })
                     }
                  />
               </Flex>
               <Flex w={'70%'}>
                  <Text>
                     This setting instructs the SNMP poller to avoid using GETBULK requests and use
                     only GETNEXT requests. It can be beneficial when discovering devices that are
                     sensitive to large SNMP GETBULK requests, but may substantially increase discovery
                     time when applied to a large numbers of devices.
                  </Text>
               </Flex>
            </Flex>
            <Flex gap={4}>
               <Flex w={'30%'}>
                  <Input
                     label="Max Simultaneous Device Walks"
                     defaultValue={defaultValues?.maxSimultaneousDeviceWalks?.toString()}
                     onChange={(e) =>
                        onTextChange({
                           propertyName: 'maxSimultaneousDeviceWalks',
                           value: Number(e.target.value),
                        })
                     }
                  />
               </Flex>
               <Flex w={'70%'}>
                  <Text>
                     This setting defines the maximum number of SNMP walks that can run concurrently on a
                     single device during discovery. Any additional SNMP walk requests beyond this limit
                     are queued and executed once the active SNMP walks have completed.
                  </Text>
               </Flex>
            </Flex>
            <Flex gap={6}>
               <Flex w={'30%'}>
                  <Input
                     label="Max Simultaneous Walks"
                     defaultValue={defaultValues?.maxSimultaneousWalks?.toString()}
                     onChange={(e) =>
                        onTextChange({
                           propertyName: 'maxSimultaneousWalks',
                           value: Number(e.target.value),
                        })
                     }
                  />
               </Flex>
               <Flex w={'70%'}>
                  <Text>
                     This setting specifies the maximum number of SNMP walks that can run concurrently
                     across all devices during discovery. Any SNMP walk requests exceeding this limit
                     are placed in a queue and executed once the active SNMP walks have completed.
                  </Text>
               </Flex>
            </Flex>
         </Flex>
      </Panel>
   );
}
