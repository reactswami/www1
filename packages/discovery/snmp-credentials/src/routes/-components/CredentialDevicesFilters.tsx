import { Box, Flex, FormControl, FormLabel, Select } from '@chakra-ui/react';
import GlobalFilterInput from '@statseeker/components/Legacy/GlobalFilterInput/GlobalFilterInput';
import { useDebounce } from '@statseeker/hooks';
import React, { memo, useCallback } from 'react';
import { CredentialsTypeahed } from './CredentialsTypeahead';
import { GroupTypeahead } from './GroupTypeahead';

export type CredentialDevicesFiltersProps = {
   group?: number;
   ping_state?: string;
   snmp_credential_id?: number;
   snmp_state?: string;
   text_filter?: string;
   showCredential?: boolean;
   onCredentialChange?: (value: number) => void;
   onGroupChange: (value: number) => void;
   onPingChange: (value: string | undefined) => void;
   onSearch: (value: string | undefined) => void;
   onSNMPChange: (value: string | undefined) => void;
};

export const CredentialDevicesFilters = memo(function CredentialDevicesFilters({
   group,
   ping_state,
   snmp_credential_id,
   snmp_state,
   text_filter,
   showCredential = true,
   onCredentialChange,
   onGroupChange,
   onPingChange,
   onSearch,
   onSNMPChange,
}: CredentialDevicesFiltersProps) {
   const handleSearchChange = useDebounce((text: string | undefined) => {
      onSearch(text && text.length > 0 ? text : undefined);
   }, 500);

   const handlePingChange = useCallback(
      (event: React.ChangeEvent<HTMLSelectElement>) => {
         onPingChange(event.target.value ? event.target.value : undefined);
      },
      [onPingChange]
   );

   const handleSNMPChange = useCallback(
      (event: React.ChangeEvent<HTMLSelectElement>) => {
         onSNMPChange(event.target.value ? event.target.value : undefined);
      },
      [onSNMPChange]
   );

   let credentialsFilter = null;
   if (showCredential !== false && onCredentialChange !== undefined) {
      credentialsFilter = (
         <Box>
            <CredentialsTypeahed defaultValue={snmp_credential_id} onChange={onCredentialChange} />
         </Box>
      );
   }

   return (
      <Flex className="filters" gap={2}>
         <GlobalFilterInput defaultValue={text_filter} onChange={handleSearchChange} width="30ch" />
         <Box>
            <GroupTypeahead defaultValue={group} onChange={onGroupChange} />
         </Box>
         {credentialsFilter}
         <Box>
            <FormControl>
               <FormLabel whiteSpace={'nowrap'}>Ping State</FormLabel>
               <Select
                  defaultValue={ping_state}
                  size={'md'}
                  minWidth={'100%'}
                  onChange={handlePingChange}
                  placeholder="Select..."
               >
                  <option value="up">up</option>
                  <option value="down">down</option>
                  <option value="disabled">disabled</option>
                  <option value="poller_down">poller down</option>
               </Select>
            </FormControl>
         </Box>
         <Box>
            <FormControl>
               <FormLabel whiteSpace="nowrap">SNMP State</FormLabel>
               <Select
                  size={'md'}
                  minWidth={'100%'}
                  onChange={handleSNMPChange}
                  defaultValue={snmp_state}
                  _placeholder={{ color: 'gray.500' }}
                  placeholder="Select..."
               >
                  <option value="up">up</option>
                  <option value="down">down</option>
                  <option value="disabled">disabled</option>
               </Select>
            </FormControl>
         </Box>
      </Flex>
   );
});
