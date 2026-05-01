
import { Flex, FormControl, Select, Text } from '@chakra-ui/react';
import {
   type IpRangeConfig,
   type DiscoverExecuteOptions,
   type PollerListItem,
} from '@statseeker/api/internal_api/entities';
import { Panel } from '@statseeker/components/Disclosure/Panel';
import EntityTypeAhead from '@statseeker/components/Legacy/EntityTypeAhead/EntityTypeAhead';
import { FormLabel } from '@statseeker/components/Legacy/Input/Label/Label';
import { filterStatseekerServer, getAllPollers, pingPollerSelect, type PollerSelect } from '@statseeker/utils/apiOptions';
import React, { useState, useMemo, useCallback } from 'react';
import { Hosts, SavedRanges } from './modes';
import { type IPRangeOptions } from '~/types';

export default function IPAddressRangePanel({
   onRangeChange,
   onModeChange,
   poller,
   onPollerChange,
   defaultValues,
   defaultMode,
}: {
   onRangeChange: (data: IpRangeConfig[] | undefined) => void;
   onModeChange: (mode: DiscoverExecuteOptions['mode']) => void;
   poller?: PollerListItem;
   onPollerChange?: (data?: PollerListItem | null) => void;
   defaultValues?: IPRangeOptions | undefined;
   defaultMode: DiscoverExecuteOptions['mode'];
}) {
   const SOURCE_SAVED_RANGES = 'savedRanges';
   const SOURCE_HOST_FILE = 'hostFile';
   const [selectedSource, setSelectedSource] = useState(defaultValues?.mode === 'hostsfile' ? SOURCE_HOST_FILE : SOURCE_SAVED_RANGES);
   const defaultSource = useMemo(() => defaultValues?.mode === 'hostsfile' ? SOURCE_HOST_FILE : SOURCE_SAVED_RANGES, [defaultValues?.mode]);
   const [subTitle, setSubTitle] = useState<string>(defaultSource);

   const onChangeSource = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
      if (e.target.value === 'hostFile') {
         onModeChange('Hosts');
         setSubTitle('Hosts file');
      } else {
         onModeChange(defaultMode);
      }
      setSelectedSource(e.target.value);
   }, [onModeChange, defaultMode]);

   function renderSource() {
      switch (selectedSource) {
         case SOURCE_SAVED_RANGES:
            return <SavedRanges onChange={onRangeChange} setSubTitle={setSubTitle} defaultValues={defaultValues} />;
         case SOURCE_HOST_FILE:
            return <Hosts />;
         default:
            return <SavedRanges onChange={onRangeChange} setSubTitle={setSubTitle} defaultValues={defaultValues} />;
      }
   }

   return (
      <Panel title="IP Address Ranges" className="panel-ip-address-ranges" subTitle={subTitle}>
         <Flex gap={4} flexDir={'column'}>
            <Text>
               The following IP Address Ranges will be scanned via ICMP during the discovery
               process.
            </Text>
            {onPollerChange &&
               <FormControl width={'30%'}>
                  <FormLabel label="Pollers">
                     <EntityTypeAhead<PollerListItem, PollerSelect> entityQueryOption={getAllPollers} initialize defaultValue={poller} onChange={(e) => {
                        if (e) {
                           onPollerChange?.(e);
                        }
                     }}
                        filterInitialValue={filterStatseekerServer}
                        queryParams={pingPollerSelect}
                     />
                  </FormLabel>
               </FormControl>
            }
            <FormControl width={'30%'}>
               <FormLabel label="Ranges Source">
                  <Select
                     backgroundColor={'white.500'}
                     onChange={onChangeSource}
                     defaultValue={defaultSource}
                  >
                     <option value={SOURCE_SAVED_RANGES}>Saved IP address ranges</option>
                     <option value={SOURCE_HOST_FILE}>Use ranges from Hosts file</option>
                  </Select></FormLabel>

            </FormControl>
            {renderSource()}
         </Flex>
      </Panel>
   );
}
