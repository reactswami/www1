import { ApiGetRequest, api_get } from '@statseeker/api/internal_api/api-request';
import { type DiscoverConfig } from './type';

export async function getDiscoveryConfig() {
   return api_get(
      new ApiGetRequest<DiscoverConfig>({
         object_type: 'discover_config',
         fields: [
            'snmp_credentials',
            'iftype',
            'ip_range_configurations',
            'sysdescr',
            'ping_count',
            'ping_rate',
            'ranges',
            'ping_skip',
         ],
      })
   );
}
