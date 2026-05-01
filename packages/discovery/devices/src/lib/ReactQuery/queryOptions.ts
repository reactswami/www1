/**
 * Contains the query options which combine the keys and functions
 */
import {
   type DeviceFilter,
   type PortFilter,
   type SNMPEntityFilter,
} from '@statseeker/api/internal_api/entities';
import { formatSortParam } from '@statseeker/utils/formatSortParam';
import { type ApiFilter } from '@statseeker/utils/types';
import { keepPreviousData, queryOptions } from '@tanstack/react-query';
import {
   deviceQueryKeys,
   oaComponentServicesQueryKeys,
   portQueryKeys,
   SNMPEntityQueryKeys,
   snmpCredentialsQueryKeys,
} from './keys';
import { getAllDevices } from '~/api/device';
import { getPollersList } from '~/api/oa_component_service';
import { getAllPorts } from '~/api/port';
import { getSnmpCredentials } from '~/api/snmp_credential';
import { getAllSNMPEntities, getSNMPEntityColumns } from '~/api/snmp_entity';

export const deviceQueryOptions = {
   get: (filters?: DeviceFilter) => {
      filters = {
         ...filters,
         sort: filters?.sort === undefined ? 'name' : formatSortParam(filters.sort),
      };
      return queryOptions({
         queryKey: deviceQueryKeys.get(filters),
         queryFn: () => getAllDevices(filters),
         placeholderData: keepPreviousData,
         staleTime: 60000,
      });
   },
};

export const portQueryOptions = {
   get: (filters?: PortFilter) =>
      queryOptions({
         queryKey: portQueryKeys.get(filters),
         queryFn: () => getAllPorts(filters),
         placeholderData: keepPreviousData,
         staleTime: 60000,
      }),
};

export const SNMPEntityQueryOptions = {
   get: (filters?: ApiFilter & SNMPEntityFilter) =>
      queryOptions({
         queryKey: SNMPEntityQueryKeys.get(filters),
         queryFn: () => getAllSNMPEntities(filters),
         placeholderData: keepPreviousData,
         staleTime: 60000,
      }),
   getColumns: (data_type?: string) =>
      queryOptions({
         queryKey: SNMPEntityQueryKeys.getColumns(data_type),
         queryFn: () => getSNMPEntityColumns(data_type),
         placeholderData: keepPreviousData,
         staleTime: 60000,
      }),
};

export const snmpCredentialsQueryOptions = {
   get: () =>
      queryOptions({
         queryKey: snmpCredentialsQueryKeys.get(),
         queryFn: () => getSnmpCredentials(),
         select: (data) => data.data.map(({ id, name }) => ({ id, name })),
      }),
};

export const oaComponentServiceQueryOptions = {
   get: () =>
      queryOptions({
         queryKey: oaComponentServicesQueryKeys.get(),
         queryFn: () => getPollersList(),
         select: (data) => data.data.map(({ name }) => ({ value: name, label: name })),
      }),
};
