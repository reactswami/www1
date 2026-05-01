import { useCallback } from 'react';
import {
   ExistingDevicesPanel,
   MonitoringOptionsPanel,
   PostDiscoveryActionsPanel,
   SNMPOptionsPanel,
} from './panels';
import { type ACTIONTYPE, useDiscoverNimOptions } from '~/hooks';
import {
   type DiscoverOptions as DefaultValues,
   type ExistingDeviceOptions,
   type MonitoringOptions,
   type PostDiscoveryActionOptions,
   type SNMPOptions,
} from '~/types';

export function AdvancedOptions({ defaultValues, discoverMode, dispatch, hiddenPanels, isEdit = false }:
   {
      discoverMode: 'Discover' | 'Rewalk' | 'Manual' | 'Ping Only Discover';
      dispatch: (value: ACTIONTYPE) => void;
      defaultValues?: Partial<DefaultValues>;
      hiddenPanels?: ('snmp' | 'existing_device' | '')[];
      isEdit?: boolean;
   }) {

   const { getValueByKey } = useDiscoverNimOptions();
   const handleExistingDeviceChange = useCallback(
      (data: ExistingDeviceOptions) =>
         dispatch({ type: 'SET_EXISTING_DEVICE_OPTIONS', payload: data }),
      [dispatch]
   );

   const handleSNMPOptionsPanelChange = useCallback(
      (data: Partial<SNMPOptions>) => dispatch({ type: 'SET_SNMP_OPTIONS', payload: data }),
      [dispatch]
   );

   const handleMonitoringOptionsPanelChange = useCallback(
      (data: MonitoringOptions) => dispatch({ type: 'SET_MONITORING_OPTIONS', payload: data }),
      [dispatch]
   );

   const handlePostDiscoveryActionsPanelChange = useCallback(
      (data: PostDiscoveryActionOptions) =>
         dispatch({ type: 'SET_POST_DISCOVERY_ACTIONS', payload: data }),
      [dispatch]
   );

   return (
      <>
         {!hiddenPanels?.includes('existing_device') &&
            <ExistingDevicesPanel
               defaultValues={defaultValues ?? {
                  excludeExistingDevices: false,
               }}
               discoverMode={discoverMode}
               onChange={handleExistingDeviceChange}
            />
         }


         {!hiddenPanels?.includes('snmp') &&
            <SNMPOptionsPanel onChange={handleSNMPOptionsPanelChange} defaultValues={defaultValues ?? {
               maxSimultaneousWalks: 5000,
               maxSimultaneousDeviceWalks: 10,
               maxRepetitions: 50,
               useGetNext: false,
               minimalWalk: false,
               snmpErrorLog: false,
               numberOfRetries: 2,
               walkTimeout: 5,
            }} />
         }

         <MonitoringOptionsPanel
            defaultValues={defaultValues ?? {
               operstatusPolling: getValueByKey('discover_operstatus'),
               adminStatusPolling: getValueByKey('discover_adminstatus'),
            }}
            onChange={handleMonitoringOptionsPanelChange}
         />
         <PostDiscoveryActionsPanel
            defaultValues={defaultValues ?? {
               runAutogroupingRules: getValueByKey('discover_grouping'),
               createInterfaceSpeedGroups: getValueByKey('interface_speed_autogrouping'),
               createInterfaceTypeGroups: getValueByKey('interface_type_autogrouping'),
            }}
            onChange={handlePostDiscoveryActionsPanelChange}
         />
      </>
   );
}
