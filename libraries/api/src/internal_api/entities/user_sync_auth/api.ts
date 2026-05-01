import { api_update, api_add, api_get, ApiGetRequest, api_execute } from '../../api-request';
import { type updateUserSyncAuthFields, type getUserSyncAuthFields, type addUserSyncAuthFields } from './index';


export async function updateUserSyncAuth(
   row: updateUserSyncAuthFields
) {
   return await api_update<updateUserSyncAuthFields>({
      object_type: 'user_sync_auth',
      rows: [row],
   });
}


export async function addUserSyncAuth(
   row: addUserSyncAuthFields
) {
   return await api_add<addUserSyncAuthFields>({
      object_type: 'user_sync_auth',
      rows: [row]
   });
}


export async function getUserSyncAuth(
) {
   return await api_get(
      new ApiGetRequest<getUserSyncAuthFields>({
         fields: [
            'id',
            'ldap_server',
            'ldap_port',
            'ldap_base_dn',
            'ldap_secure_mode',
            'ldap_bind_dn',
            'ldap_bind_password',
            'ldap_ad_domain',
            'ldap_certificate',
         ],
         object_type: 'user_sync_auth'
      })
   );
}


export async function executeUserSyncAuth(
   options: addUserSyncAuthFields | updateUserSyncAuthFields | getUserSyncAuthFields
) {
   return await api_execute({
      object_type: 'user_sync_auth',
      options: { ...options }
   });
}

