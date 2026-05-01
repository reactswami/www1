import {
   api_add,
   api_delete,
   api_update,
   type ApiField,
   ApiGetRequest,
} from '@statseeker/api/internal_api';
import { formatFieldsWithSort } from '@statseeker/utils/formatFieldsWithSort';
import { type Task, type TaskFilter, TASK_OBJECT_TYPE } from './type';

const taskFields: (string | ApiField)[] = [
   'id',
   'name',
   'status',
   'enabled',
   'type',
   'progress',
   {
      key: 'cron',
      name: 'time',
      format: 'cron',
   },
   {
      key: 'unix',
      name: 'time',
      format: 'unix',
   },
   {
      key: 'time',
      formula: 'COALESCE({cron}, {unix})',
   },
   'commands',
   'results',
   {
      aggr_format: "last",
      key: "history_id",
      name: "id",
      links: ["historyLink"],
      object: "discover_history"
   },
   {
      key: "start",
      name: "start",
      links: ["historyLink"],
      object: "discover_history"
   },
   {
      key: "finish",
      name: "finish",
      links: ["historyLink"],
      object: "discover_history"
   },
   {
      key: "duration",
      links: ["historyLink"],
      object: "discover_history"
   },
   {
      key: "discovery_status",
      name: "status",
      links: ["historyLink"],
      object: "discover_history"
   },
   {
      hide: true,
      aggr_format: "last",
      name: "id",
      links: ["historyLink"],
      object: "discover_history"
   },
   {
      "hide": true,
      key: "config",
      name: "config",
      links: ["historyLink"],
      object: "discover_history"
   },
   {
      key: 'poller_name',
      formula: "JQ('.poller', {config})",
      links: ["historyLink"],
      name: 'poller_name',
   },
   {
      key: 'last_run_state',
      formula: "JQ('.[0]?.success', {results})",
      name: 'last_run',
   },
   {
      key: "poller_status",
      links: [
         'historyLink', 'snmpPollerLink'
      ],
      name: "status",
      object: "device_oa"
   },
];

export async function getTask(filters?: TaskFilter) {
   let fields: (string | ApiField)[] = taskFields;

   if (filters) {
      const { sort, dir } = filters;
      if (sort && dir) {
         fields = formatFieldsWithSort({ sort, dir, fields });
      }
   }

   return new ApiGetRequest<Task>({
      fields,
      ...TASK_OBJECT_TYPE,
      text_filter: filters?.text_filter ?? undefined,
      filter: buildFilterString({ filters }),
      limit: filters?.limit ?? undefined,
      offset: filters?.offset ?? undefined,
      sort: filters?.sort ? [filters.sort] : undefined,
      context: 'getTask',
      links: {
         historyLink: {
            src: "task",
            src_fields: {
               id: {}
            },
            src_query: "{id}",
            dst: "discover_history",
            dst_fields: {
               id: {}
            },
            dst_query: "JQ('.api_task_id | tonumber', {config})"
         },
         snmpPollerLink: {
            dst: "device_oa",
            dst_fields: {
               id: {}
            },
            dst_query: "{id}",
            src: "discover_history",
            src_fields: {
               id: {}
            },
            src_query: "JQ('.poller_id | tonumber', {config})"
         }
      },
   }).run_api_request();
}

export async function getTaskById(id: number) {
   return await new ApiGetRequest<Task>({
      ...TASK_OBJECT_TYPE,
      fields: taskFields,
      id_filter: [id],
      context: 'getTaskById',
      links: {
         historyLink: {
            src: "task",
            src_fields: {
               id: {}
            },
            src_query: "{id}",
            dst: "discover_history",
            dst_fields: {
               config: {}
            },
            dst_query: "JQ('.api_task_id | tonumber', {config})"
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

const discoverTaskFields: (string | ApiField)[] = [
   'id',
   'name',
   'status',
   'enabled',
   'type',
   'progress',
   {
      key: 'cron',
      name: 'time',
      format: 'cron',
   },
   {
      key: 'unix',
      name: 'time',
      format: 'unix',
   },
   {
      key: 'time',
      formula: 'COALESCE({cron}, {unix})',
   },
   'commands',
   'results',
   {
      aggr_format: "last",
      key: "history_id",
      name: "id",
      links: ["historyLink"],
      object: "discover_history"
   },
   {
      key: "start",
      name: "start",
      links: ["historyLink"],
      object: "discover_history"
   },
   {
      key: "finish",
      name: "finish",
      links: ["historyLink"],
      object: "discover_history"
   },
   {
      key: "duration",
      links: ["historyLink"],
      object: "discover_history"
   },
   {
      key: "discovery_status",
      name: "status",
      links: ["historyLink"],
      object: "discover_history"
   },
   {
      hide: true,
      aggr_format: "last",
      name: "id",
      links: ["historyLink"],
      object: "discover_history"
   },
   {
      "hide": true,
      key: "config",
      name: "config",
      links: ["historyLink"],
      object: "discover_history"
   },
   {
      key: 'poller_name',
      formula: "JQ('.poller', {config})",
      links: ["historyLink"],
      name: 'poller_name',
   },
   {
      key: 'mode',
      formula: "JQ('.mode', {config})",
      links: ["historyLink"],
      name: 'mode',
   },
   {
      key: 'last_run_state',
      formula: "JQ('.[0]?.success', {results})",
      name: 'last_run',
   },
   {
      key: "poller_status",
      links: [
         'historyLink', 'snmpPollerLink'
      ],
      name: "status",
      object: "device_oa"
   },
];

export async function getDiscoverTask(filters?: TaskFilter) {
   let fields: (string | ApiField)[] = discoverTaskFields;

   if (filters) {
      const { sort, dir } = filters;
      if (sort && dir) {
         fields = formatFieldsWithSort({ sort, dir, fields });
      }
   }

   return new ApiGetRequest<Task>({
      fields,
      ...TASK_OBJECT_TYPE,
      text_filter: filters?.text_filter ?? undefined,
      filter: buildFilterString({ filters }),
      limit: filters?.limit ?? undefined,
      offset: filters?.offset ?? undefined,
      sort: filters?.sort ? [filters.sort] : undefined,
      context: 'getTask',
      links: {
         historyLink: {
            src: "task",
            src_fields: {
               id: {}
            },
            src_query: "{id}",
            dst: "discover_history",
            dst_fields: {
               id: {}
            },
            dst_query: "JQ('.api_task_id | tonumber', {config})"
         },
         snmpPollerLink: {
            dst: "device_oa",
            dst_fields: {
               id: {}
            },
            dst_query: "{id}",
            src: "discover_history",
            src_fields: {
               id: {}
            },
            src_query: "JQ('.poller_id | tonumber', {config})"
         }
      },
   }).run_api_request();
}

export async function getDiscoverTaskById(id: number) {
   return await new ApiGetRequest<Task>({
      ...TASK_OBJECT_TYPE,
      fields: discoverTaskFields,
      id_filter: [id],
      context: 'getDiscoverTaskById',
      links: {
         historyLink: {
            src: "task",
            src_fields: {
               id: {}
            },
            src_query: "{id}",
            dst: "discover_history",
            dst_fields: {
               config: {}
            },
            dst_query: "JQ('.api_task_id | tonumber', {config})"
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

function buildFilterString({ filters }: { filters?: TaskFilter }) {
   const conditions: string[] = [];

   /* Ignore any task that has no time, these are one off immetiate tasks */
   if (filters?.time !== undefined) {
      if (!isNaN(filters?.time as number)) {
         conditions.push(`{unix} = ${filters?.time as number / 1000}`);
      } else {
         conditions.push(`{cron} = '${filters?.time}'`);
      }
   } else {
      conditions.push('({cron} IS NOT NULL OR {unix} > 0)');
   }
   if (filters?.name_filter !== undefined) {
      conditions.push(`{name} REGEXP '${filters.name_filter}'`);
   }

   if (filters?.enabled !== undefined) {
      conditions.push(`{enabled} = ${filters.enabled}`);
   }

   if (filters?.type !== undefined) {
      conditions.push(`{type} = '${filters.type}'`);
   }

   if (filters?.poller_status !== undefined) {
      conditions.push(`{poller_status}='${filters.poller_status}' OR {poller_status} IS NULL`);
   }

   if (filters?.poller_name !== undefined) {
      conditions.push(`{poller_name}='${filters.poller_name}'`);
   }

   return conditions.join(' AND ');
}

export async function addTask({ task }: { task: Task }) {
   return await api_add<Task>({
      ...TASK_OBJECT_TYPE,
      rows: [task],
      context: 'addTask',
   });
}

export async function deleteTask({ ids }: { ids: number[] }) {
   return await api_delete<Task>({
      ...TASK_OBJECT_TYPE,
      ids,
      context: 'deleteTask',
   });
}

export async function updateTask({ task }: { task: Task[] }) {
   return await api_update<Task>({
      ...TASK_OBJECT_TYPE,
      rows: task,
      context: 'updateTask',
   });
}
