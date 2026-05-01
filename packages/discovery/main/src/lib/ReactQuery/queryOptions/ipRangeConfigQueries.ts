import {
   getIpRangeConfigs,
   type IpRangeListEntry,
   type IpRangeConfigFilters,
} from '@statseeker/api/internal_api/entities';
import { formatFieldsWithSort } from '@statseeker/utils/formatFieldsWithSort';
import { queryOptions } from '@tanstack/react-query';
import { ipRangeConfigKeys } from '../keys';

export const ipRangeConfigQueryOptions = {
   getIpRangeConfigList: (filters?: IpRangeConfigFilters) =>
      queryOptions({
         queryKey: ipRangeConfigKeys.get(filters),
         queryFn: () => {
            const fields = [
               'id',
               'name',
               'ip_range',
               { key: 'enabled' },
               { key: 'enabledString', formula: "CASE WHEN {enabled} THEN 'enabled' ELSE 'disabled' END" },
            ];
            return getIpRangeConfigs<IpRangeListEntry>({
               request: {
                  fields: filters?.sort
                     ? formatFieldsWithSort({
                          fields,
                          sort: filters.sort,
                          dir: filters.dir,
                       })
                     : fields,
                  text_filter: filters?.text_filter,
                  sort: filters?.sort ? [filters.sort] : undefined,
               },
            });
         },
         select: (ipranges) => {
            return {
               ...ipranges,
               data: ipranges.data.map((ipRangeConfig) => {
                  // Exclude ip_range rule as we are only getting it to calculate the counts
                  const { id, name, ip_range, enabled, snmp_credentials, enabledString } = ipRangeConfig;
                  return {
                     id,
                     name,
                     ip_range,
                     excludesCount: ip_range?.exclude?.length || 0,
                     includesCount: ip_range?.include?.length || 0,
                     enabled,
                     snmp_credentials,
                     enabledString
                  };
               }),
            };
         },
      }),
};
