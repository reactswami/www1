import { createApiFilter, createApiInFilter } from '@statseeker/api/internal_api';
import {
   type DeviceFilter,
   getDevices,
   getDevicesCount,
   getDevicesCountInGroup,
} from '@statseeker/api/internal_api/entities';
import { formatFieldsWithSort } from '@statseeker/utils/formatFieldsWithSort';
import { type ApiFilter } from '@statseeker/utils/types';
import { queryOptions } from '@tanstack/react-query';
import { deviceQueryKeys } from '../keys';

const retiredFilter = createApiFilter('retired', '!=', 'on');

export const devicesQueryOptions = {
   get: (filters?: DeviceFilter) =>
      queryOptions({
         queryKey: deviceQueryKeys.get(filters),
         queryFn: () =>
            getDevices({
               request: {
                  fields: filters?.sort
                     ? formatFieldsWithSort({
                        fields: ['id', 'name', 'ipaddress', 'ping_state', 'snmp_state', 'retired', 'snmp_poller_id', {
                           "key": "poller_name",
                           "name": "name",
                           "object": "device_oa",
                           "links": ["snmpPollerLink"]
                        },],
                        sort: filters.sort,
                        dir: filters.dir,
                     })
                     : ['id', 'name', 'ipaddress', 'ping_state', 'snmp_state', 'retired', 'snmp_poller_id'],
                  sort: filters?.sort ? [filters.sort] : undefined,
                  text_filter: filters?.text_filter,
                  group_id_filter: filters?.group_id_filter
                     ? [filters?.group_id_filter]
                     : undefined,
                  filter: filters?.snmp_poller_id ? (createApiInFilter('snmp_poller_id', filters?.snmp_poller_id) + ' AND ' + retiredFilter) : retiredFilter,
               },
            }),
         select: (data) => data.data,
      }),
   count: () =>
      queryOptions({
         queryKey: deviceQueryKeys.count(),
         queryFn: () => getDevicesCount(),
         select: (data) => ({
            count: data.data[0].count,
         }),
      }),

   groupWithDeviceCount: (filters: ApiFilter) =>
      queryOptions({
         queryKey: deviceQueryKeys.groupWithDeviceCount(filters),
         queryFn: () => getDevicesCountInGroup(filters),
         select: (data) => data.data,
      }),
};
