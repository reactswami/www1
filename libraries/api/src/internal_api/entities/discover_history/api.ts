import { type ApiField, ApiGetRequest, api_describe } from '@statseeker/api/internal_api';
import { formatFieldsWithSort } from '@statseeker/utils/formatFieldsWithSort';
import { type DiscoverHistoryTask, type DiscoverHistory, type DiscoverHistoryFilter } from './type';

export async function getDiscoverHistory(filters?: DiscoverHistoryFilter) {
   let fields: (string | ApiField)[] = [
      'id',
      { key: 'finish', name: 'start', timefmt: '%c' },
      'mode',
      'duration',
      'status',
      'user',
      { key: 'config', hide: true },
      {
         key: 'credential_length',
         name: 'config',
         formula: 'JQ(".snmp_versions | length", {config})',
      },
      {
         key: 'task_name',
         name: 'config',
         formula: 'JQ(".api_task_name", {config})',
      },
      {
         key: 'task_type',
         name: 'config',
         formula: 'CASE WHEN {task_name} IS NULL THEN "Manual" ELSE "Scheduled" END'
      },
   ];

   if (filters) {
      const { sort, dir, device } = filters;
      if (sort && dir) {
         fields = formatFieldsWithSort({ sort, dir, fields });
      }

      if (device) {
         fields.push({
            key: 'devices',
            name: 'id',
            formula: 'JQ(".devices", {config})',
            filter: `= '["${device}"]'`,
         });
      }
   }

   return new ApiGetRequest<DiscoverHistory & { credential_length: number }>({
      fields,
      object_type: 'discover_history',
      text_filter: filters?.text_filter ?? undefined,
      filter: buildFilterString({ filters }),
      limit: filters?.limit ?? undefined,
      offset: filters?.offset ?? undefined,
      sort: filters?.sort ? [filters.sort] : undefined,
      context: 'getDiscoveryHistory',
   }).run_api_request();
}

export async function getDiscoveryHistoryById(id: number) {
   return await new ApiGetRequest<DiscoverHistory & { credential_length: number }>({
      object_type: 'discover_history',
      fields: [
         'id',
         { key: 'start', name: 'start', timefmt: '%c' },
         { key: 'finish', name: 'finish', timefmt: '%c' },
         'mode',
         'status',
         'user',
         'logfile',
         'details',
         'duration',
         "config",
         {
            key: 'credential_length',
            name: 'config',
            formula: 'JQ(".snmp_versions | length", {config})',
         },
         {
            key: 'task_name',
            name: 'config',
            formula: 'JQ(".api_task_name", {config})',
         },
         {
            key: 'task_type',
            name: 'config',
            formula: 'CASE WHEN {task_name} IS NULL THEN "Manual" ELSE "Scheduled" END'
         },
      ],
      id_filter: [id],
      context: 'getDiscoveryHistoryById',
   }).run_api_request();
}

function buildFilterString({ filters }: { filters?: DiscoverHistoryFilter }) {
   const conditions: string[] = [];

   if (filters?.discoverMode !== undefined) {
      const modeSet = new Set(filters?.discoverMode);

      if (filters.discoverMode.includes('Hosts') || filters.discoverMode.includes('Discover')) {
         modeSet.add('Hosts');
         modeSet.add('Discover');
      }
      const modes = Array.from(modeSet).map(m => "'" + m + "'").join();
      conditions.push(`{mode} IN (${modes})`);
   }
   if (filters?.status !== undefined) {
      conditions.push(`{status} REGEXP '${filters.status}'`);
   }
   if (filters?.user !== undefined) {
      conditions.push(`{user}='${filters.user}'`);
   }
   if (filters?.task_type !== undefined) {
      const types = filters.task_type.map(t => "'" + t + "'").join();
      conditions.push(`{task_type} IN (${types})`);
   }
   if (filters?.task_name !== undefined) {
      conditions.push(`{task_name}='${filters.task_name}'`);
   }

   if (filters?.task_enabled !== undefined) {
      conditions.push(`{task_enabled}='${Number(filters.task_enabled)}'`);
   }

   if (filters?.poller_status !== undefined) {
      conditions.push(`{poller_status}='${filters.poller_status}' OR {poller_status} IS NULL`);
   }

   if (filters?.poller_name !== undefined) {
      conditions.push(`{poller_name}='${filters.poller_name}'`);
   }

   if (conditions.length === 0) {
      return undefined;
   }

   return conditions.join(' AND ');
}

export async function describeDiscoverHistory() {
   return await api_describe({ object_type: 'discover_history' });
}

const TASK_HISTORY_FIELDS: (string | ApiField)[] = [
   {
      aggr_format: "last",
      key: "id"
   },
   {
      key: "start"
   },
   {
      key: "finish"
   },
   {
      key: "duration"
   },
   {
      key: "status"
   },
   {
      key: "config",
   },
   {
      key: "task_progress",
      links: [
         "taskLink"
      ],
      name: "progress",
      object: "task"
   },
   {
      key: "task_type",
      links: [
         "taskLink"
      ],
      name: "type",
      object: "task"
   },
   {
      key: "task_enabled",
      links: [
         "taskLink"
      ],
      name: "enabled",
      object: "task"
   },
   {
      key: "task_status",
      links: [
         "taskLink"
      ],
      name: "status",
      object: "task"
   },
   {
      key: "task_name",
      links: [
         "taskLink"
      ],
      name: "name",
      object: "task"
   },
   {
      key: "task_result",
      links: [
         "taskLink"
      ],
      name: "results",
      object: "task"
   },
   {
      links: [
         "taskLink"
      ],
      key: 'cron',
      name: 'time',
      hide: true,
      format: 'cron',
      object: "task"
   },
   {
      links: [
         "taskLink"
      ],
      key: 'unix',
      name: 'time',
      hide: true,
      format: 'unix',
      object: "task"
   },
   {
      links: [
         "taskLink"
      ],
      key: 'task_time',
      formula: 'COALESCE({cron}, {unix})',
      object: "task"
   },
   {
      key: "task_id",
      links: [
         "taskLink"
      ],
      name: "id",
      object: "task",
      filter: "!= 'null'",
   },
   {
      key: 'poller_name',
      formula: "JQ('.poller', {config})",
      name: 'poller_name',
   },
   {
      key: 'mode',
      formula: "JQ('.mode', {config})",
      name: 'mode',
   },
   {
      key: "poller_status",
      links: [
         "snmpPollerLink"
      ],
      name: "status",
      object: "device_oa"
   },
];
export async function getDiscoverTasksFromHistory(filters?: DiscoverHistoryFilter) {
   let fields = TASK_HISTORY_FIELDS;

   if (filters) {
      const { sort, dir } = filters;
      if (sort && dir) {
         fields = formatFieldsWithSort({ sort, dir, fields });
      }
   }

   return await new ApiGetRequest<DiscoverHistoryTask>({
      object_type: 'discover_history',
      fields,
      context: 'getDiscoverTasksFromHistory',
      text_filter: filters?.text_filter ?? undefined,
      filter: buildFilterString({ filters }),
      limit: filters?.limit ?? undefined,
      offset: filters?.offset ?? undefined,
      sort: filters?.sort ? [filters.sort] : undefined,
      group_by: ['task_id'],
      links: {
         taskLink: {
            dst: "task",
            dst_fields: {
               id: {},
               name: {},
               status: {}
            },
            dst_query: "{id}",
            src: "discover_history",
            src_fields: {
               config: {}
            },
            src_query: "JQ('.api_task_id | tonumber', {config})"
         },
         snmpPollerLink: {
            dst: "device_oa",
            dst_fields: {
               status: {}
            },
            dst_query: "{status}",
            src: "discover_history",
            src_fields: {
               config: {}
            },
            src_query: "JQ('.poller_id | tonumber', {config})"
         }
      },
   }).run_api_request();
}

export async function getDiscoverTasksFromHistoryById(id: number) {
   return await new ApiGetRequest<DiscoverHistoryTask>({
      object_type: 'discover_history',
      fields: TASK_HISTORY_FIELDS,
      id_filter: [id],
      context: 'getDiscoveryHistoryById',
      group_by: ['task_id'],
      links: {
         taskLink: {
            dst: "task",
            dst_fields: {
               id: {},
               name: {},
               status: {}
            },
            dst_query: "{id}",
            src: "discover_history",
            src_fields: {
               config: {}
            },
            src_query: "JQ('.api_task_id | tonumber', {config})"
         },
         snmpPollerLink: {
            dst: "device_oa",
            dst_fields: {
               status: {}
            },
            dst_query: "{status}",
            src: "discover_history",
            src_fields: {
               config: {}
            },
            src_query: "JQ('.poller_id | tonumber', {config})"
         }
      },
   }).run_api_request();
}