import {
   FormControl,
   FormLabel,
   Heading,
   Input,
   List,
   ListItem,
   Text,
   type UseDisclosureReturn,
} from '@chakra-ui/react';
import { SSModal } from '@statseeker/components/Layout/Modal';
import { memo, useState } from 'react';
import { type NetworkRow } from '~/features/networks/components';
import { type OrganizationRow } from '~/features/organizations/components';
import { useAssignExistingRule, useFetchGlobalConfig } from '~/hooks';
import { type ApiNetworkCustomRule } from '~/types/api';
import { regexpSearch } from '~/utils/regexpSearch';

interface Props {
   disclosure: UseDisclosureReturn;
   selectedRows: NetworkRow[] | OrganizationRow[];
   type: 'networks' | 'organizations';
}

export const ModalAssignToExisting = memo(({ disclosure, selectedRows, type }: Props) => {
   const { isOpen, onClose } = disclosure;
   const { data } = useFetchGlobalConfig();
   const [search, setSearch] = useState('');
   const { mutate, isPending } = useAssignExistingRule({ onClose, type });

   const handleClick = (id: string) => {
      const updatedEntities = selectedRows
         .map((row) => ({ [row.id]: { rule: id } }))
         .reduce((previous, current) => ({ ...previous, ...current }), {});
      mutate({ [type]: updatedEntities });
   };

   const ruleType = type === 'networks' ? 'network' : 'organization';
   const rules = (data?.data.rules[ruleType] ?? []) as ApiNetworkCustomRule[];
   const filteredRules = rules.filter(({ name }) => regexpSearch(search, name));

   return (
      <SSModal
         isOpen={isOpen}
         onClose={onClose}
         closeOnOverlayClick={false}
         modalProps={{ blockScrollOnMount: false }}
         title="Assign to existing rule"
         cancelButton={{ label: 'Cancel', onClick: onClose }}
      >
         <Text mb="1rem">
            Click on an existing rule to assign the selected {type}
            {selectedRows.length > 1 && 's'} to this rule.
         </Text>
         <FormControl>
            <FormLabel>Search by name</FormLabel>
            <Input onChange={(e) => setSearch(e.target.value)} />
         </FormControl>
         <Heading size="sm" paddingY={2} marginTop={2}>Existing rules</Heading>
         <List maxHeight={'40vh'} overflowY="auto">
            {filteredRules.length > 0 && filteredRules.map(({ name, id }) => (
               <ListItem
                  key={id as string}
                  transition={'100ms ease-in background'}
                  padding={1}
                  borderRadius="base"
                  borderTop="1px"
                  marginRight={4}
                  borderColor="gray.50"
                  _hover={{ backgroundColor: 'gray.50' }}
                  cursor="pointer"
                  onClick={() => isPending ? null : handleClick(id as string)}
                  opacity={isPending ? 0.5 : 1}
               >
                  {name}
               </ListItem>
            ))}
            {rules.length > 0 && filteredRules.length === 0 && (
               <ListItem transition={'100ms ease-in background'} padding={1} borderRadius="base" marginRight={4} _hover={{ backgroundColor: 'gray.50' }} cursor="pointer" opacity={isPending ? 0.5 : 1}>
                  No rules found for your search terms.
               </ListItem>
            )}
            {rules.length === 0 && (
               <ListItem transition={'100ms ease-in background'} padding={1} borderRadius="base" marginRight={4} opacity={isPending ? 0.5 : 1}>
                  You don't have any existing rules.
               </ListItem>
            )}
         </List>
      </SSModal>
   );
});
