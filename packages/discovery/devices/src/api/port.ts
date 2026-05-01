import { api_bulk_update, ApiGetRequest } from '@statseeker/api/internal_api';
import {
   type PortUpdateFilter,
   type Port,
   type PortFilter,
} from '@statseeker/api/internal_api/entities';
import { formatFieldsWithSort } from '@statseeker/utils/formatFieldsWithSort';
import { type ApiFilter } from '@statseeker/utils/types';
import { type PortListItem } from '~/types/general';

const fields = () => [
   { key: 'deviceName', object: 'device', name: 'name' },
   'name',
   'ifTitle',
   'ifDescr',
   'ifSpeed',
   'ifOutSpeed',
   'ifInSpeed',
   'poll',
   { key: 'ifOperStatusPoll', name: 'ifOperStatus', format: 'poll' },
   { key: 'ifOperStatus', format: 'state' },
   { key: 'ifAdminStatusPoll', name: 'ifAdminStatus', format: 'poll' },
   { key: 'ifAdminStatus', format: 'state' },
   'ifNonUnicast',
   'idx',
   'if90day',
   'id',
   { key: 'deviceRetired', name: 'retired', object: 'device' },
   { key: 'devicePoll', name: 'snmp_poll', object: 'device' },
   {
      "key": "snmp_poller_id",
      "hide": true,
      "links": [
         "deviceLink"
      ],
      "object": "device"
   },
   {
      "key": "snmp_poller",
      "name": "name",
      "object": "device_oa",
      "links": ["deviceLink", "snmpPollerLink"]
   },
   {
      "key": "snmp_poller_status",
      "name": "status",
      "object": "device_oa",
      "links": ["deviceLink", "snmpPollerLink"]
   },
];

export async function getAllPorts(filters?: ApiFilter & PortFilter) {
   return new ApiGetRequest<PortListItem>({
      object_type: 'port',
      fields: filters?.sort
         ? formatFieldsWithSort({ sort: filters.sort, dir: filters.dir, fields: fields() })
         : fields(),
      sort: filters?.sort ? [filters.sort] : undefined,
      text_filter: filters?.text_filter ? filters.text_filter : undefined,
      group_id_filter: filters?.group_id_filter ? [filters.group_id_filter] : undefined,
      limit: filters?.limit ?? undefined,
      offset: filters?.offset ?? undefined,
      filter: buildFilterString({ filters }),
      output_single_format: true,
   }).run_api_request();
}

function buildFilterString({ filters }: { filters?: PortFilter }) {
   const conditions: string[] = ['{idx} IS NOT NULL'];

   if (filters?.ifAdminStatus === 'disabled') {
      conditions.push(`({ifAdminStatus} = '${filters.ifAdminStatus}' OR {ifAdminStatus} IS NULL)`);
   } else if (filters?.ifAdminStatus !== undefined) {
      conditions.push(`{ifAdminStatus} = '${filters.ifAdminStatus}'`);
   }

   if (filters?.ifOperStatus === 'disabled') {
      conditions.push(`({ifOperStatus} = '${filters.ifOperStatus}' OR {ifOperStatus} IS NULL)`);
   } else if (filters?.ifOperStatus !== undefined) {
      conditions.push(`{ifOperStatus} = '${filters.ifOperStatus}'`);
   }

   if (filters?.poll !== undefined) {
      conditions.push(`{poll} = '${filters.poll}'`);
   }

   if (filters?.snmp_poller_status !== undefined) {
      if (filters.snmp_poller_status === 'up') {
         conditions.push(`({snmp_poller_status} = '${filters.snmp_poller_status}' OR {snmp_poller_status} IS NULL)`);
      } else {
         conditions.push(`{snmp_poller_status} = '${filters.snmp_poller_status}'`);
      }
   }

   if (filters?.snmp_poller_id !== undefined) {
      conditions.push(`{snmp_poller_id} IN (${filters.snmp_poller_id.join(',')})`);
   }

   if (conditions.length === 0) {
      return undefined;
   }

   return conditions.join(' AND ');
}

export async function updateInterfaces({
   filters,
   data,
   update_flags,
}: {
   filters: PortUpdateFilter;
   data: Partial<Port>;
   update_flags?: string;
}) {
   return api_bulk_update({
      req: new ApiGetRequest({
         object_type: 'port',
         fields: fields(),
         text_filter: filters?.text_filter ? filters.text_filter : undefined,
         group_id_filter: filters?.group_id_filter ? [filters.group_id_filter] : undefined,
         id_filter: filters?.selectedIds,
         filter: buildFilterString({ filters }),
      }),
      row: data,
      options: {
         update_flags,
         ignore_discover_lock: true,
      },
   });
}
