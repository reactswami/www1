import {
   type ApiField,
   ApiGetRequest,
   api_bulk_update,
   createApiInFilter,
   api_get,
} from '@statseeker/api/internal_api';
import { type DeviceFilter, type Device, type DeviceWithCredentialName } from '@statseeker/api/internal_api/entities/device';
import { formatFieldsWithSort } from '@statseeker/utils/formatFieldsWithSort';

async function bulkUpdateDevicesBySNMPCredentialIds({
   credentialIds,
   device,
}: {
   credentialIds: number[];
   device: Partial<Device>;
}) {
   return api_bulk_update({
      req: new ApiGetRequest({
         fields: [
            'snmp_credential',
            { key: 'table', hide: true },
            { key: 'retired', hide: true },
         ],
         object_type: 'device',
         filter: createApiInFilter('snmp_credential', credentialIds) + ' AND {table} != "device_oa" AND {retired} != "on"',
      }),
      row: device,
   });
}

async function bulkUpdateDevices({
   filters,
   selectedDeviceIds,
   device,
}: {
   filters?: DeviceFilter;
   selectedDeviceIds: number[] | undefined;
   device: Pick<Device, 'snmp_credential'>;
}) {
   const devices = await api_get(
      new ApiGetRequest<Device>({
         fields: [
            'id',
            'name',
            'ipaddress',
            { key: 'snmp_credential_id', name: 'snmp_credential' },
            { key: 'snmp_credential_name', object: 'snmp_credential', name: 'name' },
            { key: 'ping_state', format: 'state' },
            { key: 'snmp_state', format: 'state' },
            { key: 'lastSNMPStateChange', name: 'snmp_state', format: 'state_time', timefmt: '%c' },
            { key: 'lastPingStateChange', name: 'ping_state', format: 'state_time', timefmt: '%c' },
            { key: 'table', hide: true },
            { key: 'retired', hide: true },
         ],
         object_type: 'device',
         id_filter: selectedDeviceIds,
         group_id_filter: filters?.group_id_filter ? [filters.group_id_filter] : undefined,
         text_filter: filters?.text_filter ?? undefined,
         filter: buildFilterString({ filters }),
      })
   );
   const filteredDeviceIds = devices.data.map((device) => device.id);

   return api_bulk_update({
      req: new ApiGetRequest<Device>({
         object_type: 'device',
         id_filter: filteredDeviceIds,
      }),
      row: device,
   });
}

async function getDevicesWithCredential(filters?: DeviceFilter) {
   let fields: (string | ApiField)[] = [
      'id',
      'name',
      'ipaddress',
      { key: 'snmp_credential_id', name: 'snmp_credential' },
      { key: 'snmp_credential_name', object: 'snmp_credential', name: 'name' },
      { key: 'ping_state', format: 'state' },
      { key: 'snmp_state', format: 'state' },
      { key: 'lastSNMPStateChange', name: 'snmp_state', format: 'state_time', timefmt: '%c', text_filter_include: false },
      { key: 'lastPingStateChange', name: 'ping_state', format: 'state_time', timefmt: '%c', text_filter_include: false },
      { key: 'table', hide: true },
      { key: 'retired', hide: true },
   ];

   fields = filters?.sort
      ? formatFieldsWithSort({ fields, sort: filters.sort, dir: filters.dir })
      : fields;

   return new ApiGetRequest<DeviceWithCredentialName>({
      fields,
      object_type: 'device',
      group_id_filter: filters?.group_id_filter ? [filters.group_id_filter] : undefined,
      text_filter: filters?.text_filter ?? undefined,
      filter: buildFilterString({ filters }),
      limit: filters?.limit ?? undefined,
      offset: filters?.offset ?? undefined,
      sort: filters?.sort ? [filters.sort] : undefined,
      context: 'getDevicesWithCredential',
   }).run_api_request();
}

function buildFilterString({ filters }: { filters?: DeviceFilter }) {
   const conditions: string[] = [
      '{table} != "device_oa" AND {retired} != "on"'
   ];

   if (filters?.snmp_credential_id !== undefined) {
      conditions.push(`{snmp_credential_id} = ${filters.snmp_credential_id}`);
   }
   if (filters?.ping_state !== undefined) {
      conditions.push(`{ping_state} = '${filters.ping_state}'`);
   }
   if (filters?.snmp_state !== undefined) {
      conditions.push(`{snmp_state} = '${filters.snmp_state}'`);
   }

   if (conditions.length === 0) {
      return undefined;
   }

   return conditions.join(' AND ');
}

export { bulkUpdateDevices, bulkUpdateDevicesBySNMPCredentialIds, getDevicesWithCredential };
