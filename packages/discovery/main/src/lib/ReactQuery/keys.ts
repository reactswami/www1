/**
 * Contains the query keys for the queries to ensure they get unique cache entries
 * @see https://tanstack.com/query/v5/docs/framework/react/guides/query-keys
 */

import {
   type TaskFilter,
   type DiscoverHistoryFilter,
   type IpRangeConfigFilters,
} from '@statseeker/api/internal_api/entities';
import { type ApiFilter } from '@statseeker/utils/types';

export const discoverQueryKeys = {
   current: ['discover'],
};

export const discoverHistoryQueryKeys = {
   get: (params?: DiscoverHistoryFilter) => ['discover_history', params] as const,
   describe: () => [...discoverHistoryQueryKeys.get(), 'describe'] as const,
   id: (id: number) => [...discoverHistoryQueryKeys.get(), id] as const,
};

export const discoverTaskQueryKeys = {
   get: (params?: TaskFilter) => ['discover_task', params] as const,
   id: (id: number) => [...discoverTaskQueryKeys.get(), id] as const,
};

export const discoverHistoryTask = {
   get: (params?: TaskFilter) => ['discover_history_task', params] as const,
   id: (id: number) => [...discoverTaskQueryKeys.get(), id] as const,
};

export const discoverConfigQueryKeys = {
   get: ['discover_config'],
};

export const snmpCredentialsKeys = {
   get: (params?: { text_filter?: string; sort?: string; dir?: string }) =>
      ['snmp_credential', params] as const,
   describe: () => [...snmpCredentialsKeys.get(), 'describe'] as const,
};

export const ipRangeConfigKeys = {
   get: (params?: IpRangeConfigFilters) => ['ip_range_config', params],
};

export const discoverHostsQueryKeys = {
   get: ['discover_hosts'],
   count: () => [...discoverConfigQueryKeys.get, 'count'] as const,
};

export const deviceQueryKeys = {
   get: (filters?: ApiFilter) => ['device', filters],
   count: () => [...deviceQueryKeys.get(), 'count'] as const,
   groupWithDeviceCount: (filters?: ApiFilter) => [...deviceQueryKeys.get(), 'groupCount', filters],
};

export const nimOptionsQueryKeys = {
   get: ['nim_options'],
};
