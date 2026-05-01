import { type SNMPEntityFilter } from '@statseeker/api/internal_api/entities';
import { type ApiFilter } from '@statseeker/utils/types';
import { getColumns } from 'ag-grid-community/dist/types/src/columns/columnApi';

/**
 * Contains the query keys for the queries to ensure they get unique cache entries
 * @see https://tanstack.com/query/v4/docs/guides/query-keys
 */
export const deviceQueryKeys = {
   devices: ['devices'] as const,
   get: (params?: ApiFilter) => [...deviceQueryKeys.devices, params] as const,
};

export const portQueryKeys = {
   ports: ['ports'] as const,
   get: (params?: ApiFilter) => [...portQueryKeys.ports, params],
};

export const SNMPEntityQueryKeys = {
   get: (params?: ApiFilter & SNMPEntityFilter) => [params] as const,
   getColumns: (data_type?: string) => ['columns', data_type] as const,
};

export const snmpCredentialsQueryKeys = {
   get: () => ['snmp_credentials'],
};

export const oaComponentServicesQueryKeys = {
   get: () => ['oa_component_services'],
};
