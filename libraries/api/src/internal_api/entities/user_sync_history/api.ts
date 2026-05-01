import { type ApiField } from '@statseeker/api/internal_api/types';
import { formatFieldsWithSort } from '@statseeker/utils/formatFieldsWithSort';
import { ApiGetRequest } from '../../api-request';
import { type UserSyncHistoryFilter, type UserSyncHistory } from './type';


export async function getUserSyncHistoryById(id: number) {
   return await new ApiGetRequest<UserSyncHistory>({
      object_type: 'user_sync_history',
      fields: [
         'id',
         { key: 'finish', name: 'finish', timefmt: '%c' },
         'duration',
         'dry_run',
         'force',
         'status',
         'user',
         'details',
         { key: 'config', hide: true },
      ],
      id_filter: [id],
      context: 'getDiscoveryHistoryById',
   }).run_api_request();
};


export async function getUserSyncHistory(filters?: UserSyncHistoryFilter) {
   let fields: (string | ApiField)[] = [
      'id',
      'start',
      { key: 'finish', name: 'finish', timefmt: '%c' },
      'duration',
      'dry_run',
      'force',
      'status',
      'user',
      'details',
      { key: 'config', hide: true },
   ];

   if (filters) {
      const { sort, dir } = filters;
      if (sort && dir) {
         fields = formatFieldsWithSort({ sort, dir, fields });
      }
   }

   return new ApiGetRequest<UserSyncHistory & { credential_length: number }>({
      fields,
      object_type: 'user_sync_history',
      text_filter: filters?.text_filter ?? undefined,
      filter: buildFilterString({ filters }),
      limit: filters?.limit ?? undefined,
      offset: filters?.offset ?? undefined,
      sort: filters?.sort ? [filters.sort] : undefined,
      context: 'getUserSyncHistory',
   }).run_api_request();
}


function buildFilterString({ filters }: { filters?: UserSyncHistoryFilter }) {
   const conditions: string[] = [];

   if (filters?.status !== undefined) {
      conditions.push(`{status} REGEXP '${filters.status}'`);
   }
   if (filters?.dry_run !== undefined) {
      conditions.push(`{dry_run}='${filters.dry_run ? '1' : '0'}'`);
   }
   if (filters?.force !== undefined) {
      conditions.push(`{force}='${filters.force ? '1' : '0'}'`);
   }

   if (conditions.length === 0) {
      return undefined;
   }

   return conditions.join(' AND ');
}

