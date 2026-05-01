import { ApiGetRequest, api_delete, api_execute, api_get } from '@statseeker/api/internal_api';
import { type Discover, type DiscoverExecuteOptions } from './type';

export async function executeDiscover(
   options:
      | {
           mode: DiscoverExecuteOptions['mode'];
           devices?: DiscoverExecuteOptions['devices'];
           discover_config?: DiscoverExecuteOptions['discover_config'];
        }
      | DiscoverExecuteOptions
) {
   return api_execute({
      object_type: 'discover',
      options,
   });
}

export async function getDiscover() {
   return api_get(
      new ApiGetRequest<Discover>({
         object_type: 'discover',
         fields: [
            'id',
            'mode',
            { key: 'config', hide: true },
            {
               key: 'credential_length',
               name: 'config',
               formula: 'JQ(".snmp_versions | length", {config})',
            },
         ],
      })
   );
}

export async function deleteDiscovery() {
   return api_delete({ object_type: 'discover', ids: [1] });
}
