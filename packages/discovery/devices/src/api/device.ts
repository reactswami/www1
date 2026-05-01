import { api_update, ApiGetRequest } from '@statseeker/api/internal_api';
import { type DeviceUpdateFilter, type DeviceFilter } from '@statseeker/api/internal_api/entities';
import { formatFieldsWithSort } from '@statseeker/utils/formatFieldsWithSort';
import { type ApiFilter } from '@statseeker/utils/types';
import axios from 'axios';
import { type DeviceListItem } from '~/types/general';

const fields = () => [
   'name',
   'hostname',
   'ipaddress',
   'region',
   'site',
   'sysLocation',
   'latitude',
   'longitude',
   'snmp_poller_id',
   {
      "key": "snmp_poller",
      "name": "name",
      "object": "device_oa",
      "links": ["snmpPollerLink"]
   },
   {
      "key": "snmp_poller_status",
      "name": "status",
      "object": "device_oa",
      "links": ["snmpPollerLink"]
   },
   { key: 'ping_state', format: 'state' },
   'ping_poll',
   {
      key: 'lastPingStateChange',
      name: 'ping_state',
      format: 'state_time',
      timefmt: '%c',
      text_filter_include: false,
   },
   { key: 'snmp_state', format: 'state' },
   'snmp_poll',
   {
      key: 'lastSNMPStateChange',
      name: 'snmp_state',
      format: 'state_time',
      timefmt: '%c',
      text_filter_include: false,
   },
   'snmp_maxoid',
   { key: 'snmp_credential_name', object: 'snmp_credential', name: 'name' },
   'sysDescr',
   'default_poller',
   {
      key: 'pollers',
      name: 'name',
      object: 'ping',
      aggr_format: 'list_unique',
   },
   { key: 'table', hide: true },
   { key: 'retired' },
   {
      key: 'pollersCountRaw',
      name: 'name',
      object: 'ping',
      aggr_format: 'count',
   },
   {
      key: 'pollersCount',
      formula: 'IIF(ABS({pollersCountRaw}) IS NULL, 1, {pollersCountRaw})',
   },
   { key: 'snmp_credential_id', object: 'snmp_credential', name: 'id' },
   'id',
];

const links = () => ({
   pingLink: {
      src: 'device',
      dst: 'ping',
      src_query: "{id} || ':on'",
      dst_query: "{deviceid} || ':' || IIF({poll} == 'exceeded', 'on', {poll})",
      src_fields: {
         id: {},
      },
      dst_fields: {
         deviceid: {},
         poll: {},
      },
   },
});

export async function getAllDevices(filters?: ApiFilter & DeviceFilter) {
   return new ApiGetRequest<DeviceListItem>({
      object_type: 'device',
      fields: filters?.sort
         ? formatFieldsWithSort({ sort: filters.sort, dir: filters.dir, fields: fields() })
         : fields(),
      sort: filters?.sort ? [filters.sort] : undefined,
      text_filter: filters?.text_filter ? filters.text_filter : undefined,
      group_id_filter: filters?.group_id_filter ? [filters.group_id_filter] : undefined,
      limit: filters?.limit ?? undefined,
      offset: filters?.offset ?? undefined,
      filter: buildFilterString({ filters }),
      links: links(),
   }).run_api_request();
}

function buildFilterString({ filters, data }: { filters?: DeviceFilter; data?: any }) {
   const conditions: string[] = [];

   /* Dont allow polling/ip changes to retired devices */
   if (data?.snmp_poll || data?.ipaddress) {
      conditions.push(`({retired} IS NULL OR {retired} != 'on')`);
   }

   if (filters?.ping_state !== undefined) {
      conditions.push(`{ping_state} = '${filters.ping_state}'`);
   }
   if (filters?.snmp_state !== undefined) {
      conditions.push(`{snmp_state} = '${filters.snmp_state}'`);
   }

   if (filters?.snmp_poller_status !== undefined) {
      conditions.push(`{snmp_poller_status} = '${filters.snmp_poller_status}'`);
   }

   if (filters?.snmp_poller_id !== undefined) {
      conditions.push(`{snmp_poller_id} IN (${filters.snmp_poller_id.join(',')})`);
   }

   if (conditions.length === 0) {
      return undefined;
   }

   return conditions.join(' AND ');
}

export async function deleteRetireCgi(mode: 'retire' | 'delete', filters: DeviceUpdateFilter) {
   const devices = await new ApiGetRequest<DeviceListItem>({
      object_type: 'device',
      fields: fields(),
      text_filter: filters?.text_filter ? filters.text_filter : undefined,
      group_id_filter: filters?.group_id_filter ? [filters.group_id_filter] : undefined,
      id_filter: filters?.selectedIds,
      filter: buildFilterString({ filters }),
      links: links(),
   }).run_api_request();

   if (devices.data.length === 0) {
      return;
   }

   const formData = new FormData();
   formData.append('action', mode);
   formData.append('device_list', JSON.stringify(devices.data.map((d) => d.id.toString())));

   return axios
      .post<string>('/cgi/nim_delete_device', formData, {
         headers: {
            'Content-Type': 'multipart/form-data',
         },
      })
      .then((result) => {
         if (result.data.toLowerCase().includes('failed')) {
            throw new Error(result.data);
         }
      });
}

export async function updateDevices({ filters, data, update_flags }: { filters: DeviceUpdateFilter; data: any; update_flags?: string }) {
   const devices = await new ApiGetRequest<DeviceListItem>({
      object_type: 'device',
      fields: fields(),
      text_filter: filters?.text_filter ? filters.text_filter : undefined,
      group_id_filter: filters?.group_id_filter ? [filters.group_id_filter] : undefined,
      id_filter: filters?.selectedIds,
      filter: buildFilterString({ filters, data }),
      links: links(),
   }).run_api_request();

   if (devices.data.length === 0) {
      return;
   }

   const rows = devices.data.map((device) => ({ ...data, id: device.id }));
   return api_update({
      object_type: 'device',
      rows,
      options: {
         update_flags,
         ignore_discover_lock: true,
      },
   });
}
