import {
   ApiGetRequest,
   api_delete,
   api_get,
   createApiFormulaString,
   type ApiObject,
} from '@statseeker/api/internal_api';
import { formatFieldsWithSort } from '@statseeker/utils/formatFieldsWithSort';
import { type ApiFilter } from '@statseeker/utils/types';
import { type Device, type DeviceCountWithGroup } from './type';

export async function getDevices({ request }: { request: Omit<ApiObject, 'object_type'> }) {
   return api_get(
      new ApiGetRequest<Device>({
         object_type: 'device',
         context: 'devices',
         ...request,
      })
   );
}

export async function getDevicesCount() {
   return new ApiGetRequest<{ count: number }>({
      object_type: 'device',
      fields: [
         {
            key: 'count',
            name: 'id',
            aggr_format: 'count',
         },
         { key: 'table', hide: true },
         { key: 'retired', hide: true },
      ],
      filter: '{table} != "device_oa" AND {retired} != "on"',
      group_by_all: true,
      context: 'deviceCount',
   }).run_api_request();
}

export async function getDevicesCountInGroup(filters?: ApiFilter) {
   const fields = [
      { key: 'groupid', name: '~groupid~' },
      { key: 'group', name: '~group~' },
      { key: 'devices', name: 'id', aggr_format: 'count' },
      { key: 'table', hide: true },
      { key: 'retired', hide: true },
   ];

   const escapedTextFilter = filters?.text_filter
      ? createApiFormulaString(filters?.text_filter)
      : null;

   return new ApiGetRequest<DeviceCountWithGroup>({
      object_type: 'device',
      fields: filters?.sort
         ? formatFieldsWithSort({
              fields,
              sort: filters.sort,
              dir: filters.dir,
           })
         : fields,
      filter: '{table} != "device_oa" AND {retired} != "on"',
      post_filter: escapedTextFilter
         ? `{groupid} IS NOT NULL AND ({group} REGEXPI ${escapedTextFilter} OR {devices} REGEXPI ${escapedTextFilter})`
         : '{groupid} IS NOT NULL',
      group_by: ['~group~'],
      context: 'devicesCountWithGroups',
      sort: filters?.sort ? [filters.sort] : undefined,
      text_filter: filters?.text_filter,
   }).run_api_request();
}

export async function deleteDevices(ids: Device['id'][]) {
   return await api_delete<Device>({
      object_type: 'snmp_credential',
      ids,
      context: 'deleteCredentials',
   });
}
