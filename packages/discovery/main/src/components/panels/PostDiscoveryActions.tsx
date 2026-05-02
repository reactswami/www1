import { Code, Flex, FormLabel, Switch, Text } from '@statseeker/components/Layout';
import { Input } from '@statseeker/components';
import { Panel } from '@statseeker/components/Disclosure/Panel';
import { type ChangeEvent, useRef } from 'react';
import { type PostDiscoveryActionOptions } from '~/types';

export function PostDiscoveryActionsPanel({
   defaultValues = {
      runAutogroupingRules: true,
      createInterfaceSpeedGroups: true,
      createInterfaceTypeGroups: true,
   },
   onChange,
   showInterfaceGroups = true,
}: {
   defaultValues?: PostDiscoveryActionOptions;
   onChange: (data: PostDiscoveryActionOptions) => void;
   showInterfaceGroups?: boolean;
}) {
   const isDirty = useRef(false);

   function onEmailChange(e: ChangeEvent<HTMLInputElement>) {
      const newObj: PostDiscoveryActionOptions = { ...defaultValues, email: e.target.value };
      onChange(newObj);
      isDirty.current = true;
   }

   function onSwitchChange(
      propertyName:
         | 'runAutogroupingRules'
         | 'createInterfaceTypeGroups'
         | 'createInterfaceSpeedGroups',
      value: boolean
   ) {
      const newObj: PostDiscoveryActionOptions = { ...defaultValues };
      newObj[propertyName] = value;
      onChange(newObj);
      isDirty.current = true;
   }

   return (
      <Panel
         title="Post-Discovery Actions"
         className="panel-post-discovery-actions"
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
               <Flex w={'30%'}>
                  <Input
                     label="Email Result To"
                     defaultValue={defaultValues?.email}
                     onChange={onEmailChange}
                  />
               </Flex>
               <Flex w={'70%'}>
                  <Text>Email the discovery output to the nominated address</Text>
               </Flex>
            </Flex>
            <Flex gap={4}>
               <Flex flexDir={'column'} w={'30%'}>
                  {' '}
                  <FormLabel>Run Auto Grouping Rules</FormLabel>
                  <Switch
                     isChecked={defaultValues?.runAutogroupingRules}
                     colorScheme="green"
                     onChange={(e) => onSwitchChange('runAutogroupingRules', e.target.checked)}
                  />
               </Flex>
               <Flex w={'70%'}>
                  <Text>Process Auto-Grouping rules once discovery is complete</Text>
               </Flex>
            </Flex>
            {showInterfaceGroups ? (
               <>
                  <Flex gap={4}>
                     <Flex flexDir={'column'} w={'30%'}>
                        <FormLabel>Create Interface Type Groups</FormLabel>
                        <Switch
                           isChecked={defaultValues?.createInterfaceTypeGroups}
                           colorScheme="green"
                           onChange={(e) =>
                              onSwitchChange('createInterfaceTypeGroups', e.target.checked)
                           }
                        />
                     </Flex>
                     <Flex w={'70%'}>
                        <Text>
                           Create and populate groups for each interface type discovered. Group
                           naming format:
                           <Code>Interface: Type: {'<TYPE>'}</Code>
                        </Text>
                     </Flex>
                  </Flex>
                  <Flex gap={4}>
                     <Flex flexDir={'column'} w={'30%'}>
                        <FormLabel>Create Interface Speed Groups</FormLabel>
                        <Switch
                           isChecked={defaultValues?.createInterfaceSpeedGroups}
                           colorScheme="green"
                           onChange={(e) =>
                              onSwitchChange('createInterfaceSpeedGroups', e.target.checked)
                           }
                        />
                     </Flex>
                     <Flex w={'70%'}>
                        <Text>
                           Create and populate groups for each interface speed discovered. Group
                           naming format:
                           <Code>Interface: Speed: {'<SPEED>'}</Code>
                        </Text>
                     </Flex>
                  </Flex>
               </>
            ) : null}
         </Flex>
      </Panel>
   );
}
