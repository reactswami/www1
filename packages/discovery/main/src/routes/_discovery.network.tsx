import { type PollerListItem } from '@statseeker/api/internal_api/entities';
import { getAllPollers } from '@statseeker/utils/apiOptions';
import { getProductName } from '@statseeker/utils/environment';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useMemo } from 'react';
import useFormActions from './-components/schedule/hooks/useFormActions';
import {
   IPAddressRangePanel,
   SNMPCredentialsPanel,
   AdvancedOptions,
   DiscoveryPanelContainer,
   PollerPanel,
} from '~/components';
import useDiscoveryConfig from '~/hooks/useDiscoveryConfig';
import { discoverConfigQueryOptions } from '~/lib';


export const Route = createFileRoute('/_discovery/network')({
   loader: (opts) => opts.context.queryClient.ensureQueryData(discoverConfigQueryOptions.get()),
   component: DiscoverNetworkRoute,
});

function DiscoverNetworkRoute() {
   const search = Route.useSearch();
   const { options, selectedPoller, defaultConfigValues, dispatch, runNowMutation, isPending,
      handleSNMPCredentialsPanelChange, handleModeChange,
      handleIPAddressRangesPanelChange, handlePollerChange, handleSaveConfig } = useDiscoveryConfig({ mode: 'Discover' });
   const { displayScheduleAddForm, addDisclosure } = useFormActions();

   return (
      <DiscoveryPanelContainer
         infoCardText={`The Network Discovery process scans a network range to find devices and test them for what information they provide via SNMP. Devices that match the relevant criteria will be added to ${getProductName()} for ongoing monitoring.`}
         onStartClick={runNowMutation}
         advancedOptions={<AdvancedOptions discoverMode="Discover" dispatch={dispatch} defaultValues={defaultConfigValues} />}
         isRunning={isPending}
         props={{
            className: 'discovery-network',
         }}
         showAdvancedOptionsButton={!search.initial === true}
         openSchedule={addDisclosure.onOpen}
         onSaveConfig={handleSaveConfig}
      >
         {displayScheduleAddForm({ discoveryType: 'Network', options })}
         <PollerPanel onChange={handlePollerChange} defaultValues={selectedPoller} />
         <IPAddressRangePanel
            onRangeChange={handleIPAddressRangesPanelChange}
            onModeChange={handleModeChange}
            defaultMode='Discover'
            defaultValues={
               defaultConfigValues.mode === 'iprange' ?
                  { mode: options?.mode === 'Hosts' ? 'hostsfile' : defaultConfigValues.mode, iprangeList: defaultConfigValues.iprangeList ?? [] }
                  : { mode: options?.mode === 'Hosts' ? 'hostsfile' : defaultConfigValues.mode }

            }
         />
         <SNMPCredentialsPanel onChange={handleSNMPCredentialsPanelChange} />
      </DiscoveryPanelContainer>
   );
}
