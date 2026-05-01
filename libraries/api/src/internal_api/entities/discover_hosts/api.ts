import { ApiGetRequest, createApiFilter } from '../../api-request';

export async function getDiscoverHostsCount() {
   return await new ApiGetRequest<{ count: number }>({
      object_type: 'discover_hosts',
      fields: [
         { key: 'count', name: 'id', aggr_format: 'count' },
         { key: 'enable', hide: true },
      ],
      group_by: ['enable'],
      filter: createApiFilter('enable', '=', 1),
   }).run_api_request();
}
