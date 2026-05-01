// ============================================================
// useManualDeviceManagement - hook for Manual device management
// ============================================================

import { type ManualConfig } from '@statseeker/api/internal_api/entities/discover/type';
import { DEFAULT_DEVICE, AUTO_CONFIG_SNMP, DEFAULT_SNMP_OPTIONS, type Device } from '@statseeker/components/Legacy/DevicePanel';
import { type EntityErrors } from '@statseeker/hooks';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';
import { snmpCredentialQueryOptions } from '~/lib/ReactQuery/queryOptions';
interface Credential {
   id: number;
   name: string;
}

// ============================================================
// Constants
// ============================================================

const SNMP_MODES = {
   NO_CREDENTIALS: 'no-credentials',
   AUTO_CONFIG: AUTO_CONFIG_SNMP.value,
} as const;

const INITIAL_DEVICE: Omit<Device, 'id'> = {
   ...DEFAULT_DEVICE
};

// ============================================================
// Helpers
// ============================================================

/**
 * Generate a unique ID using timestamp and random number
 */
const generateId = (() => {
   let counter = 0;
   return () => {
      const timestamp = Date.now();
      const random = Math.floor(Math.random() * 1000);
      return timestamp * 10000 + counter++ + random;
   };
})();

/**
 * Find credential ID by SNMP value
 */
function findCredentialId(snmpValue: string, credentials?: Credential[]): number | undefined {
   const numericValue = Number(snmpValue);
   return credentials?.find(cred => cred.id === numericValue)?.id;
}

/**
 * Find snmp config name from credential
 */
function findCredentialName(credential_id: number, credentials?: Credential[]): string | undefined {
   return credentials?.find(cred => cred.id === credential_id)?.name;
}

/**
 * Transform Device to ManualConfig (Manual Mode)
 */
function deviceToManualConfig(device: Device, credentials?: Credential[]): ManualConfig {
   const { ipaddress, manual_name, snmp } = device;
   const credentialId = findCredentialId(snmp, credentials);

   if (snmp === SNMP_MODES.NO_CREDENTIALS || !credentialId) {
      return {
         ipaddress,
         manual_name,
         ping_only: true,
      };
   }

   return {
      ipaddress,
      manual_name,
      ping_only: false,
      id: credentialId,
   };
}

/**
 * Transform Device to ManualConfig (Auto Mode)
 */
function deviceToManualConfigAuto(
   device: Device,
   existingConfig: ManualConfig | undefined,
   credentials?: Credential[]
): ManualConfig {
   const { ipaddress, manual_name, snmp, index } = device;

   // No credentials mode
   if (snmp === SNMP_MODES.NO_CREDENTIALS) {
      return {
         ipaddress,
         manual_name,
         ping_only: true,
         index,
      };
   }

   // Auto config mode - preserve existing config
   if (snmp === SNMP_MODES.AUTO_CONFIG) {
      return {
         ...existingConfig,
         ipaddress,
         manual_name,
         index,
      };
   }

   // Custom credential mode
   const credentialId = findCredentialId(snmp, credentials);
   if (credentialId) {
      return {
         ipaddress,
         manual_name,
         ping_only: false,
         id: credentialId,
         index,
         encrypted: true,
      };
   }

   // Fallback to ping only
   return {
      ipaddress,
      manual_name,
      ping_only: true,
      index,
   };
}

/**
 * Transform imported ManualConfigs to Devices
 */
function manualConfigsToDevices(configs: ManualConfig[], credentials?: Credential[]): Device[] {
   return configs.map(({ ipaddress, manual_name, index, credential_id }) => {
      return ({
         id: generateId(),
         ipaddress,
         manual_name: manual_name ?? '',
         snmp: credential_id ? findCredentialName(credential_id, credentials) ? String(credential_id) : SNMP_MODES.AUTO_CONFIG : SNMP_MODES.AUTO_CONFIG,
         index,
      });
   });
}

// ============================================================
// Custom Hook for Device Management
// ============================================================

export function useManualDeviceManagement() {
   const [devices, setDevices] = useState<Device[]>(() => {
      return [{ ...DEFAULT_DEVICE },];
   });
   const { data: credentialsResponse } = useQuery(
      snmpCredentialQueryOptions.get()
   );
   const [isManualMode, setIsManualMode] = useState(true);
   const [previousConfigs, setPreviousConfigs] = useState<ManualConfig[]>([]);
   const credentials: Credential[] | undefined = credentialsResponse?.data;

   /**
    * Transform devices to manual configs based on current mode
    */
   const manualConfigs = useMemo(() => {
      if (devices.length === 0) return [];

      if (isManualMode) {
         return devices.map(device => deviceToManualConfig(device, credentials));
      }

      return devices.map(device => {
         const existingConfig = previousConfigs.find(cfg => cfg.index === device.index);
         return deviceToManualConfigAuto(device, existingConfig, credentials);
      });
   }, [devices, isManualMode, credentials, previousConfigs]);

   /**
    * Handle device changes from DeviceCard
    */
   const handleDeviceChange = useCallback((updatedDevices: Device[]) => {
      setDevices(updatedDevices);
   }, []);

   /**
    * Handle import from CSV/file
    */
   const handleImport = useCallback((configs: ManualConfig[]) => {
      const indexedConfigs = configs.map(config => ({
         ...config,
         index: generateId(),
      }));

      setPreviousConfigs(indexedConfigs);
      setDevices(manualConfigsToDevices(indexedConfigs, credentials));
      setIsManualMode(false);
   }, [credentials]);

   const snmpOptions = useMemo(() => {
      const credOptions = credentials?.map(cred => ({
         label: cred.name,
         value: String(cred.id),
      })) ?? [];

      const baseOptions = [...DEFAULT_SNMP_OPTIONS, ...credOptions];

      return isManualMode ? baseOptions : [
         ...DEFAULT_SNMP_OPTIONS,
         AUTO_CONFIG_SNMP,
         ...credOptions,
      ];
   }, [credentials, isManualMode]);


   /**
    * Reset to manual mode with empty state
    */
   const resetToManualMode = useCallback(() => {
      setDevices([{ id: generateId(), ...INITIAL_DEVICE }]);
      setPreviousConfigs([]);
      setIsManualMode(true);
   }, []);

   return {
      devices,
      manualConfigs,
      isManualMode,
      snmpOptions,
      handleDeviceChange,
      handleImport,
      resetToManualMode,
   };
}
