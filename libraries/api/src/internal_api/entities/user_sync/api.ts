import { api_update, api_add, api_delete, api_get, api_execute, ApiGetRequest } from '../../api-request';
import { type UserSyncExecuteResult } from '../user_sync_history';
import { type getUserSyncFields, type addUserSyncFields, type UserSyncExecuteOptions, type updateUserSyncFields } from './index';


export async function updateUserSyncPolicies(
   rows: updateUserSyncFields[]
) {
   return await api_update<updateUserSyncFields>({
      object_type: 'user_sync',
      rows: rows,
   });
}


export async function addUserSyncPolicy(
   rows: addUserSyncFields
) {
   return await api_add<addUserSyncFields>({
      object_type: 'user_sync',
      rows: [rows]
   });
}


export async function deleteUserSyncPolicies(
   ids: number[]
) {
   return await api_delete({
      object_type: 'user_sync',
      ids,
   });
}


export async function executeUserSync(
   options: UserSyncExecuteOptions
) {
   return await api_execute<UserSyncExecuteResult>({
      object_type: 'user_sync',
      options: options,
   });
}


export async function getUserSyncPolicies(
) {
   return api_get(
      new ApiGetRequest<getUserSyncFields>({
         fields: [
            'id',
            'priority',
            'name',
            'enabled',
            'include_groups',
            'include_users',
            'exclude_users',
            'user_template'
         ],
         object_type: 'user_sync',
      })
   );
}


export async function getUserSyncPolicyById(id: number) {
   return api_get(
      new ApiGetRequest<getUserSyncFields>({
         fields: [
            'id',
            'priority',
            'name',
            'enabled',
            'include_groups',
            'include_users',
            'exclude_users',
            'user_template'
         ],
         object_type: 'user_sync',
         id_filter: [id],
      })
   );
}