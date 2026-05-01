import { type DiscoverExecuteOptions, getTask, type Task } from '@statseeker/api/internal_api/entities';
import { type SNMPCredential } from '@statseeker/api/internal_api/entities/snmp_credential';
import cronstrue from 'cronstrue';
import { type DiscoverOptions, type DiscoverModeRoute } from './types';

export function getUniqueVersions(credentials: SNMPCredential[]) {
   const versions = credentials.map((credential) => credential.version);

   if (versions.length === 0) {
      return [2, 3];
   }

   return Array.from(new Set(versions));
}

export function getModeDisplayName(mode?: string) {
   switch (mode) {
      case 'Discover':
      case 'Hosts':
         return 'Network Discovery';
      case 'Rewalk':
         return mode;
      case 'Manual':
         return 'Manual Device Addition';
      case 'Ping Only Discover':
         return 'Ping-only Discovery';
      default:
         return 'Network Discovery';
   }
}

export function getModeTypeDisplayName(mode?: string, task_name?: string) {
   if (task_name && task_name.length > 0) {
      return `${task_name} - ${getModeDisplayName(mode)}`;
   }
   return getModeDisplayName(mode);
}

const errorMessages: Record<string, string> = {
   'Unable to insert entry: Another entry already exists':
      'Another IP Address range already exists with this information.',
   'Unable to insert entry: Data provided is incorrect - Please look at logs for further information':
      'The information provided for this IP Address range is invalid.',
};

export function getErrorMessage(error: string) {
   return errorMessages[error] || error;
}

export const validateDuplicateSchedule = async (id?: number, value?: string | number) => {
   if (typeof value === 'undefined') {
      return;
   }

   const getValidateValue = (val: string | number) => {
      if (typeof val === 'string') {
         return cronstrue.toString(val, { verbose: true });
      }
      if (typeof val === 'number') {
         return val;
      }
      return '';
   };

   const result = await getTask({ type: 'DiscoverSchedule' });
   const validateValue = getValidateValue(value);
   const tasks = result?.data.filter((task: Task) => {
      if (task.id === id || task.enabled === 0) {
         return false; // Skip the current task or disabled tasks
      }
      if (typeof task.time === 'undefined') {
         return false; // Skip tasks with no time
      }
      const testCron = getValidateValue(
         typeof task.time === 'number' ? task.time * 1000 : task.time // Convert to milliseconds if it's a number
      );
      return testCron === validateValue;
   });

   if (tasks.length > 0) {
      return `A schedule "${tasks[0].name}" is enabled for the same time`;
   }
};

export const ModesRouteMap: DiscoverModeRoute = {
   'Discover': '/network',
   'Manual': '/manual',
   'Rewalk': '/rewalk',
   'Ping Only Discover': '/ping'
};

function mapDiscoverOptions<S, T>(
   source: Partial<S>,
   mapping: Partial<Record<keyof S, keyof T>>,
   skipJoin: (keyof S)[]
): Partial<T> {
   const result = {} as Partial<T>;

   for (const [sourceKey, targetKey] of Object.entries(mapping)) {
      const value = source[sourceKey as keyof S];
      if (value !== undefined && value !== null) {
         if (Array.isArray(value)) {
            if (skipJoin.includes(sourceKey as keyof S)) {
               result[targetKey as keyof T] = value as any;
            } else {
               result[targetKey as keyof T] = value.join() as any;
            }
         } else {
            result[targetKey as keyof T] = value as any;
         }
      }
   }
   return result;
}

export function getDiscoverExecuteOptions(discoverOptions: Partial<DiscoverOptions>): Partial<DiscoverExecuteOptions> {

   const discoverMapping: Partial<Record<keyof DiscoverOptions, keyof DiscoverExecuteOptions>> = {
      // SNMP OPTIONS
      maxSimultaneousWalks: 'snmp_window_size', // or 'snmp_max_files' - they both map to the same value
      maxRepetitions: 'snmp_max_repetitions',
      useGetNext: 'discover_getNext',
      minimalWalk: 'discover_minimal',
      numberOfRetries: 'snmp_retry_count',
      walkTimeout: 'snmp_timeout',
      snmpErrorLog: 'snmperrlog',
      // EXISTING DEVICE OPTIONS
      rediscoverCustomDataTypes: 'rediscover_custom_data_types',
      retestSnmpCredentials: 'retest_snmp_credentials',
      excludeExistingDevices: 'discover_prune_existing_devices',
      pingOnlyForceAdd: 'ping_only_force_add',
      manualForceAdd: 'manual_force_add',
      // MONITORING OPTIONS
      operstatusPolling: 'discover_operstatus',
      adminStatusPolling: 'discover_adminstatus',
      nonUnicastPacketPolling: 'discover_nucast',
      // POST DISCOVERY OPTIONS
      email: 'email',
      runAutogroupingRules: 'runPostProcessing',
      createInterfaceTypeGroups: 'interface_type_autogrouping',
      createInterfaceSpeedGroups: 'interface_speed_autogrouping',
      // MANUAL DISCOVERY OPTIONS
      manualConfig: 'manual_config',
      // POLLER OPTIONS
      poller: 'poll_name',
      poller_id: 'poll_id'
   };
   return mapDiscoverOptions<DiscoverOptions, DiscoverExecuteOptions>(discoverOptions, discoverMapping, ['manualConfig']);
}
export function getDiscoverConfig(options: DiscoverExecuteOptions, defaultDiscoverConfig?: Partial<DiscoverOptions>): Partial<Task & DiscoverOptions> {

   const discoverMapping: Partial<Record<keyof DiscoverExecuteOptions, keyof DiscoverOptions>> = {
      // SNMP OPTIONS
      snmp_max_files: 'maxSimultaneousWalks',
      snmp_window_size: 'maxSimultaneousWalks',
      snmp_max_repetitions: 'maxRepetitions',
      discover_getNext: 'useGetNext',
      discover_minimal: 'minimalWalk',
      snmp_retry_count: 'numberOfRetries',
      snmp_timeout: 'walkTimeout',
      snmperrlog: 'snmpErrorLog',
      // EXISTING DEVICE OPTIONS
      rediscover_custom_data_types: 'rediscoverCustomDataTypes',
      retest_snmp_credentials: 'retestSnmpCredentials',
      discover_prune_existing_devices: 'excludeExistingDevices',
      ping_only_force_add: 'pingOnlyForceAdd',
      manual_force_add: 'manualForceAdd',
      // MONITORING OPTIONS
      discover_operstatus: 'operstatusPolling',
      discover_adminstatus: 'adminStatusPolling',
      discover_nucast: 'nonUnicastPacketPolling',
      // POST DISCOVERY OPTIONS
      email: 'email',
      runPostProcessing: 'runAutogroupingRules',
      interface_type_autogrouping: 'createInterfaceTypeGroups',
      interface_speed_autogrouping: 'createInterfaceSpeedGroups',
      // MANUAL DISCOVERY OPTIONS
      manual_config: 'manualConfig',
      // POLLER OPTIONS
      poll_name: 'poller',
      poll_id: 'poller_id'
   };

   let discoverOptions: Partial<DiscoverOptions> = {};
   if (options) {

      discoverOptions = mapDiscoverOptions<DiscoverExecuteOptions, DiscoverOptions>(options, discoverMapping, ['manual_config']);
      if (options?.mode === 'Hosts') {
         discoverOptions = {
            ...discoverOptions,
            mode: 'hostsfile'
         };
      } else if (options?.discover_config && options?.discover_config?.ip_range_configurations) {
         const ip_range = options?.discover_config?.ip_range_configurations;
         const ids = ip_range.map(ipr => ipr.id);
         discoverOptions = {
            ...discoverOptions,
            iprangeList: ids,
            mode: 'iprange'
         };
      }
      if (options?.discover_config && options?.discover_config?.snmp_credentials) {
         const snmpCreds = options?.discover_config?.snmp_credentials;
         const ids = snmpCreds.map(creds => creds.id);
         discoverOptions = {
            ...discoverOptions,
            snmpCredentials: ids
         };
      }
   }

   return {
      // ADD THE DEFAULT CONFIGURATIONS
      ...(defaultDiscoverConfig && { ...defaultDiscoverConfig }),
      // OVER WRITE IF ANY CONFIG IS FOUND
      ...discoverOptions
   };
}

export const DiscoverTaskCommand = {
   command: 'execute',
   object_type: 'discover',
   context: 'ui-api-execute',
};

// Helper function to determine route for Hosts mode
const getHostsModeRoute = (options: DiscoverExecuteOptions) => {
   const hasSnmpVersions = (options?.snmp_versions?.length ?? 0) > 0;
   return hasSnmpVersions
      ? ModesRouteMap['Discover']
      : ModesRouteMap['Ping Only Discover'];
};


// Main function with reduced complexity
export const getModeRoute = ({
   config
}: {
   config?: DiscoverExecuteOptions;
}) => {
   if (!config?.mode) {
      return '/';
   }

   // Handle special Hosts mode case
   if (config?.mode === 'Hosts') {
      return getHostsModeRoute(config);
   }

   // Return mapped route or default
   return ModesRouteMap[config?.mode] ?? '/';
};