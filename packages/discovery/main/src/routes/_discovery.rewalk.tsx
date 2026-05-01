import {
   executeDiscover,
} from '@statseeker/api/internal_api/entities';
import { getProductName } from '@statseeker/utils/environment';
import { createFileRoute } from '@tanstack/react-router';
import useFormActions from './-components/schedule/hooks/useFormActions';
import {
   AdvancedOptions,
   DiscoveryPanelContainer,
   RewalkDevicesPanel,
   SNMPCredentialsPanel,
} from '~/components';
import useDiscoveryConfig from '~/hooks/useDiscoveryConfig';
import { discoverConfigQueryOptions } from '~/lib';

export const Route = createFileRoute('/_discovery/rewalk')({
   loader: (opts) => opts.context.queryClient.ensureQueryData(discoverConfigQueryOptions.get()),
   component: DiscoverRewalkRoute,
});

function DiscoverRewalkRoute() {
   const search = Route.useSearch();
   const { options, defaultConfigValues, scheduleOptions, dispatch, runNowMutation,
      handleSNMPCredentialsPanelChange, handleDeviceChange, handlePollerChange, handleSaveConfig } = useDiscoveryConfig({
         mode: 'Rewalk', customDiscoverFn: (opts) => {
            const customOptions = {
               mode: 'Rewalk' as const,
               ...(deviceName && { devices: [deviceName] }),
            };
            return executeDiscover({ ...opts, ...customOptions });
         },
      });
   const { displayScheduleAddForm, addDisclosure } = useFormActions();

   const deviceName = search?.device;
   // if device name is not found display the devices panel
   // device name will be found only for the device viewer page.
   const showDevicesPanel = !deviceName;

   return (
      <DiscoveryPanelContainer
         key={1}
         onStartClick={runNowMutation}
         props={{ className: 'discovery-rewalk' }}
         infoCardText={`The Rewalk process re-discovers the devices that ${getProductName()} is already monitoring to refresh their SNMP data.`}
         advancedOptions={<AdvancedOptions discoverMode="Rewalk" dispatch={dispatch} hiddenPanels={['existing_device']} defaultValues={defaultConfigValues} isEdit={scheduleOptions !== undefined} />}
         openSchedule={addDisclosure.onOpen}
         onSaveConfig={handleSaveConfig}
      >
         {displayScheduleAddForm({ discoveryType: 'Rewalk', options })}
         {
            showDevicesPanel &&
            <RewalkDevicesPanel poller={{ pollerID: options.poller_id }}
               onPollerChange={({ poller }) => handlePollerChange(poller)} onChange={handleDeviceChange}
               groups={options?.groups} devices={options?.devices}
               isEdit={scheduleOptions !== undefined}
            />
         }
         <SNMPCredentialsPanel onChange={handleSNMPCredentialsPanelChange} defaultValues={options?.discover_config?.snmp_credentials?.map(snmp => snmp?.id)} />
      </DiscoveryPanelContainer >
   );
}
