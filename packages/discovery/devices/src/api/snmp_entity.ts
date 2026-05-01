import {
   api_describe,
   ApiGetRequest,
   type ApiResponse,
   api_bulk_update,
   api_delete,
} from '@statseeker/api/internal_api';
import {
   type SNMPEntityUpdateFilter,
   type SNMPEntityFilter,
} from '@statseeker/api/internal_api/entities';
import { type ColumnDef } from '@statseeker/components/Legacy/SSDataTable';
import { formatFieldsWithSort } from '@statseeker/utils/formatFieldsWithSort';
import { type ApiFilter } from '@statseeker/utils/types';
import { type SNMPEntityListItem } from '~/types/general';

const getDataTypeColumns = async (data_type: string): Promise<(string | { key: string; name?: string; object: string; links?: string[]; hide?: boolean })[]> => [
   ...(await getSNMPEntityColumns(data_type)).map((column) =>
      column.field === 'device' ? { key: 'device', name: 'name', object: 'device' } : column.field
   ),
   'id',
];

export async function getAllSNMPEntities(
   filters?: ApiFilter & SNMPEntityFilter
): Promise<ApiResponse<SNMPEntityListItem>> {
   if (!filters?.data_type) {
      return Promise.resolve({
         success: true,
         errcode: 0,
         errmsg: '',
         time: 0,
         sequence: 0,
         data_total: 0,
         data: [],
      });
   }
   const fields = (await getDataTypeColumns(filters.data_type)).concat([
      { key: 'deviceRetired', name: 'retired', object: 'device' },
      { key: 'devicePoll', name: 'snmp_poll', object: 'device' },
      { key: 'snmp_poller_id', hide: true, "links": ["deviceLink"], "object": "device", },
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
   ]);

   return new ApiGetRequest<SNMPEntityListItem>({
      object_type: filters.data_type,
      fields: filters?.sort
         ? formatFieldsWithSort({ sort: filters.sort, dir: filters.dir, fields })
         : fields,
      sort: filters?.sort ? [filters.sort] : undefined,
      text_filter: filters?.text_filter ? filters.text_filter : undefined,
      group_id_filter: filters?.group_id_filter ? [filters.group_id_filter] : undefined,
      limit: filters?.limit ?? undefined,
      offset: filters?.offset ?? undefined,
      filter: buildFilterString({ filters }),
   }).run_api_request();
}

export async function getSNMPEntityColumns(dataType?: string): Promise<ColumnDef[]> {
   if (!dataType) {
      return [];
   }

   const resp = await api_describe({ object_type: dataType });

   const columns: ColumnDef[] = [
      {
         field: 'device',
         headerName: 'Device',
         showTooltip: true,
      },
      {
         field: 'name',
         headerName: 'Name',
         showTooltip: true,
      },
      {
         field: 'poll',
         headerName: 'SNMP Poll',
         maxWidth: 110,
         minWidth: 110,
      },
      {
         field: 'idx',
         headerName: 'Index',
         showTooltip: true,
         maxWidth: 110,
         minWidth: 110,
      },
   ];

   const ignore_fields = ['id', 'table', 'deviceid'];
   const fields = resp.describe?.fields ?? {};
   for (const field of Object.keys(fields)) {
      if (
         fields[field].polltype === 'cfg' &&
         !columns.some((column) => column.field === field) &&
         !ignore_fields.includes(field)
      ) {
         columns.push({
            field,
            headerName: fields[field].title,
            headerDescription: fields[field].description,
            showTooltip: true,
         });
      }
   }

   return columns;
}

export async function toggleSNMPEntities(filters: SNMPEntityUpdateFilter, poll: string) {
   return api_bulk_update({
      req: new ApiGetRequest({
         object_type: filters.data_type,
         fields: await getDataTypeColumns(filters.data_type),
         text_filter: filters?.text_filter ? filters.text_filter : undefined,
         group_id_filter: filters?.group_id_filter ? [filters.group_id_filter] : undefined,
         filter: buildFilterString({ filters }),
         id_filter: filters?.selectedIds,
      }),
      row: {
         poll,
      },
      options: {
         ignore_discover_lock: true,
      },
   });
}

export async function enableSNMPEntities(filters: SNMPEntityUpdateFilter) {
   return toggleSNMPEntities(filters, 'on');
}

export async function disableSNMPEntities(filters: SNMPEntityUpdateFilter) {
   return toggleSNMPEntities(filters, 'off');
}

export async function deleteSNMPEntities(filters: SNMPEntityUpdateFilter) {
   const entities = await new ApiGetRequest<SNMPEntityListItem>({
      object_type: filters.data_type,
      fields: await getDataTypeColumns(filters.data_type),
      text_filter: filters?.text_filter ? filters.text_filter : undefined,
      group_id_filter: filters?.group_id_filter ? [filters.group_id_filter] : undefined,
      filter: buildFilterString({ filters }),
      id_filter: filters?.selectedIds,
   }).run_api_request();
   return api_delete({
      ids: entities.data.map((entity) => entity.id),
      object_type: filters.data_type,
      options: {
         ignore_discover_lock: true,
      },
   });
}

function buildFilterString({ filters }: { filters?: SNMPEntityFilter }) {
   const conditions: string[] = ['{idx} IS NOT NULL'];

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

   return conditions.join(' AND ');
}
