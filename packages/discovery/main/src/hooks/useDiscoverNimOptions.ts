import { type DiscoverExecuteOptions } from '@statseeker/api/internal_api/entities';
import { useNimOptions } from '@statseeker/hooks';
import { type DiscoverOptions } from '~/types';

export function useDiscoverNimOptions() {

   const { getAll, getValueByKey, getRawValueByKey, isSuccess } = useNimOptions();

   function getDefaultDiscoverConfig(mode?: DiscoverExecuteOptions['mode']): Partial<DiscoverOptions> {

      const DEFAULT_SNMP_OPTIONS: Partial<DiscoverOptions> = {
         maxSimultaneousWalks: 5000,
         maxSimultaneousDeviceWalks: 10,
         maxRepetitions: 50,
         useGetNext: false,
         minimalWalk: false,
         snmpErrorLog: false,
         numberOfRetries: 2,
         walkTimeout: 5,
      };

      const DEFAULT_MONITORING_OPTIONS: Partial<DiscoverOptions> = {
         operstatusPolling: getValueByKey('discover_operstatus'),
         adminStatusPolling: getValueByKey('discover_adminstatus'),
         nonUnicastPacketPolling: 'global'
      };

      const DEFAULT_POST_DISCOVERY_OPTIONS: Partial<DiscoverOptions> = {
         runAutogroupingRules: getValueByKey('discover_grouping'),
         createInterfaceSpeedGroups: getValueByKey('interface_speed_autogrouping'),
         createInterfaceTypeGroups: getValueByKey('interface_type_autogrouping'),
      };

      const DEFAULT_EXISTING_DEVICE_OPTIONS: Partial<DiscoverOptions> = {
         excludeExistingDevices: false,
         rediscoverCustomDataTypes: true,
         retestSnmpCredentials: 'down',
         mode: undefined,
         iprangeList: undefined
      };

      if (mode === undefined || mode === 'Discover' || mode === 'Rewalk') {

         return {
            ...DEFAULT_SNMP_OPTIONS,
            ...DEFAULT_MONITORING_OPTIONS,
            ...DEFAULT_POST_DISCOVERY_OPTIONS,
            ...DEFAULT_EXISTING_DEVICE_OPTIONS
         };

      } else if (mode === 'Ping Only Discover') {
         return {
            ...DEFAULT_POST_DISCOVERY_OPTIONS,
            ...DEFAULT_EXISTING_DEVICE_OPTIONS
         };

      } else if (mode === 'Manual') {
         return {
            ...DEFAULT_SNMP_OPTIONS,
            ...DEFAULT_MONITORING_OPTIONS,
            ...DEFAULT_POST_DISCOVERY_OPTIONS,
         };
      } else {
         return {
            ...DEFAULT_SNMP_OPTIONS,
            ...DEFAULT_MONITORING_OPTIONS,
            ...DEFAULT_POST_DISCOVERY_OPTIONS,
            ...DEFAULT_EXISTING_DEVICE_OPTIONS
         };
      }
   }

   return { getAll, getValueByKey, getRawValueByKey, getDefaultDiscoverConfig, isSuccess };
}
