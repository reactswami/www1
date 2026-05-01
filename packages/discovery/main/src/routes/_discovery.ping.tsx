import { useNimOptions } from '@statseeker/hooks';
import { createFileRoute } from '@tanstack/react-router';
import useFormActions from './-components/schedule/hooks/useFormActions';
import {
   DiscoveryPanelContainer,
   ExistingDevicesPanel,
   IPAddressRangePanel,
   PostDiscoveryActionsPanel,
} from '~/components';
import useDiscoveryConfig from '~/hooks/useDiscoveryConfig';
import { discoverConfigQueryOptions } from '~/lib';

export const Route = createFileRoute('/_discovery/ping')({
   loader: (opts) => opts.context.queryClient.ensureQueryData(discoverConfigQueryOptions.get()),
   component: PinOnlyDiscoveryRoute,
});

function PinOnlyDiscoveryRoute() {

   const { getValueByKey } = useNimOptions();
   const { displayScheduleAddForm, addDisclosure } = useFormActions();
   const { options, selectedPoller, defaultConfigValues, handlePostDiscoveryActionsPanelChange, runNowMutation, isPending,
      handleExistingDeviceChange, handleModeChange, runPingDiscover,
      handleIPAddressRangesPanelChange, handlePollerChange, handleSaveConfig } = useDiscoveryConfig({ mode: 'Ping Only Discover' });

   return (
      <DiscoveryPanelContainer
         onStartClick={runNowMutation}
         props={{ className: 'discovery-ping' }}
         infoCardText={`Ping-Only Discovery: select IP Address Range configurations or the Hosts file to locate devices for monitoring via ICMP only`}
         advancedOptions={
            <>
               <ExistingDevicesPanel
                  defaultValues={defaultConfigValues ?? {
                     pingOnlyForceAdd: false,
                  }}
                  discoverMode="Ping Only Discover"
                  onChange={handleExistingDeviceChange}
               />
               <PostDiscoveryActionsPanel
                  defaultValues={defaultConfigValues ?? {
                     runAutogroupingRules: getValueByKey('discover_grouping'),
                     createInterfaceSpeedGroups: getValueByKey('interface_speed_autogrouping'),
                     createInterfaceTypeGroups: getValueByKey('interface_type_autogrouping'),
                  }}
                  onChange={handlePostDiscoveryActionsPanelChange}
                  showInterfaceGroups={false}
               />
            </>
         }
         isRunning={isPending}
         openSchedule={addDisclosure.onOpen}
         onSaveConfig={handleSaveConfig}
         runPingDiscover={runPingDiscover}
      >
         {displayScheduleAddForm({ discoveryType: 'Ping-only', options })}
         <IPAddressRangePanel
            onRangeChange={handleIPAddressRangesPanelChange}
            onModeChange={handleModeChange}
            poller={selectedPoller}
            onPollerChange={handlePollerChange}
            defaultMode='Ping Only Discover'
            defaultValues={
               defaultConfigValues.mode === 'iprange' ?
                  { mode: options?.mode === 'Hosts' ? 'hostsfile' : defaultConfigValues.mode, iprangeList: defaultConfigValues.iprangeList ?? [] }
                  : { mode: options?.mode === 'Hosts' ? 'hostsfile' : defaultConfigValues.mode }

            }
         />
      </DiscoveryPanelContainer>
   );
}
