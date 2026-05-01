import {
   type SNMPCredential,
   type DiscoverConfig,
   type DiscoverExecuteOptions,
   type IpRangeConfig,
   type PollerListItem,
} from '@statseeker/api/internal_api/entities';
import { useReducer } from 'react';
import { getUniqueVersions } from '../utils';
import {
   type PostDiscoveryActionOptions,
   type MonitoringOptions,
   type SNMPOptions,
   type ExistingDeviceOptions,
} from '~/types';

export type ACTIONTYPE =
   | {
      type: 'SET_SNMP_CREDENTIALS';
      payload: {
         snmp_credentials: SNMPCredential[];
      };
   }
   | {
      type: 'SET_RANGES';
      payload: IpRangeConfig[];
   }
   | {
      type: 'SET_POST_DISCOVERY_ACTIONS';
      payload: PostDiscoveryActionOptions;
   }
   | {
      type: 'SET_MONITORING_OPTIONS';
      payload: MonitoringOptions;
   }
   | {
      type: 'SET_SNMP_OPTIONS';
      payload: Partial<SNMPOptions>;
   }
   | {
      type: 'SET_EXISTING_DEVICE_OPTIONS';
      payload: ExistingDeviceOptions;
   }
   | {
      type: 'SET_MODE';
      payload: DiscoverExecuteOptions['mode'];
   }
   | {
      type: 'SET_GROUPS';
      payload: DiscoverExecuteOptions['groups'];
   }
   | {
      type: 'SET_DEVICES';
      payload: DiscoverExecuteOptions['devices'];
   }
   | {
      type: 'SET_MANUAL_CONFIGS';
      payload: { data: DiscoverExecuteOptions['manual_config']; isManualMode: boolean };
   }
   | {
      type: 'SET_POLLER';
      payload?: PollerListItem | null;
   }
   | {
      type: 'RESET';
      payload: Partial<DiscoverExecuteOptions>;
   };

export function useDiscoverOptions({
   mode,
   snmp_versions = [2, 3],
   discoverConfig,
   discoverOptions,
}: {
   mode: DiscoverExecuteOptions['mode'];
   snmp_versions?: DiscoverExecuteOptions['snmp_versions'];
   discoverConfig: DiscoverConfig;
   discoverOptions?: Partial<DiscoverExecuteOptions> | undefined;
}) {
   const initialState: DiscoverExecuteOptions & { manual_mode?: boolean } = {
      mode,
      snmp_versions,
      block: false,
      discover_config: discoverConfig,
      logfile: '/var/tmp/statseeker/nim-discover.log',
      manual_mode: true,
      // Add the initial state, if there is initial state found,
      // this path is for editing the config, example schedule edit
      ...(discoverOptions !== undefined ? discoverOptions : {})
   };
   function reducer(
      state: DiscoverExecuteOptions,
      action: ACTIONTYPE
   ): DiscoverExecuteOptions & { manual_mode?: boolean } {

      switch (action.type) {
         case 'SET_SNMP_CREDENTIALS':
            if (state?.discover_config) {
               return {
                  ...state,
                  snmp_versions: getUniqueVersions(action.payload.snmp_credentials),
                  discover_config: {
                     ...state.discover_config,
                     snmp_credentials: [...action.payload.snmp_credentials],
                  },
               };
            } else {
               return state;
            }
         case 'SET_RANGES':
            if (state?.discover_config) {
               return {
                  ...state,
                  discover_config: {
                     ...state.discover_config,
                     ranges: {
                        include: action.payload.flatMap((range) =>
                           range.ip_range.include ? range.ip_range.include : []
                        ),
                        exclude: action.payload.flatMap((range) =>
                           range.ip_range.exclude ? range.ip_range.exclude : []
                        ),
                     },
                     ip_range_configurations: action.payload,
                  },
               };
            } else {
               return state;
            }

         case 'SET_POST_DISCOVERY_ACTIONS': {
            return {
               ...state,
               email: action.payload.email ? [action.payload.email] : [],
               runPostProcessing: action.payload.runAutogroupingRules,
               interface_type_autogrouping: action.payload.createInterfaceTypeGroups,
               interface_speed_autogrouping: action.payload.createInterfaceSpeedGroups,
            };
         }
         case 'SET_MONITORING_OPTIONS': {
            return {
               ...state,
               discover_operstatus: action.payload.operstatusPolling,
               discover_adminstatus: action.payload.adminStatusPolling,
               discover_nucast: action.payload.nonUnicastPacketPolling,
            };
         }
         case 'SET_SNMP_OPTIONS': {
            return {
               ...state,
               snmp_max_files: action.payload.maxSimultaneousWalks,
               snmp_window_size: action.payload.maxSimultaneousDeviceWalks,
               snmp_max_repetitions: action.payload.maxRepetitions,
               discover_getNext: action.payload.useGetNext,
               discover_minimal: action.payload.minimalWalk,
               snmp_retry_count: action.payload.numberOfRetries,
               snmp_timeout: action.payload.walkTimeout,
               snmperrlog: action.payload.snmpErrorLog,
            };
         }
         case 'SET_EXISTING_DEVICE_OPTIONS': {
            return {
               ...state,
               rediscover_custom_data_types: action.payload?.rediscoverCustomDataTypes,
               retest_snmp_credentials: action.payload?.retestSnmpCredentials,
               discover_prune_existing_devices: action.payload?.excludeExistingDevices,
               ping_only_force_add: action.payload?.pingOnlyForceAdd,
               manual_force_add: action.payload?.manualForceAdd,
            };
         }
         case 'SET_MODE': {
            return {
               ...state,
               mode: action.payload,
            };
         }
         case 'SET_DEVICES': {
            return {
               ...state,
               devices: action.payload,
            };
         }
         case 'SET_GROUPS': {
            return {
               ...state,
               groups: action.payload,
            };
         }
         case 'SET_MANUAL_CONFIGS': {
            return {
               ...state,
               manual_config: action.payload.data,
               manual_mode: action.payload.isManualMode,
            };
         }
         case 'SET_POLLER': {
            return {
               ...state,
               poller_id: action?.payload?.deviceid,
               poll_id: action?.payload?.id,
               poll_name: action?.payload?.name
            };
         }
         case 'RESET': {
            return {
               ...initialState,       // base defaults
               ...action.payload,     // override with incoming scheduleOptions
            };
         }
         default:
            return state;
      }
   }

   const [options, dispatch] = useReducer(reducer, initialState);

   return {
      options,
      dispatch,
   };
}
