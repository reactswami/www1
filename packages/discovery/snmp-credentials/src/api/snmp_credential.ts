/*
 * All software Copyright 2024 of Techniche Technologies Pty Ltd., All rights reserved.
 * Any redistribution or reproduction of part or all of the contents in any form is
 * prohibited without express written permission of the company.
 */

import {
   ApiGetRequest,
   api_add,
   api_delete,
   api_update,
   type ApiField,
   type ApiObject,
} from '@statseeker/api/internal_api';
import { type SNMPCredential } from '@statseeker/api/internal_api/entities';
import { formatFieldsWithSort } from '@statseeker/utils/formatFieldsWithSort';
import {
   type SNMPCredentialListEntry,
   type GetCredentialsQueryParams,
   type AddSNMPCredentialData,
   type SNMPCredentialListEntryFromAPI,
} from '~/types';

async function getDeviceCredentialCount(
   params: GetCredentialsQueryParams & { snmp_credential_id?: number }
) {
   let command: ApiObject = {
      object_type: 'snmp_credential',
      links: {
         deviceCountLink: {
            src: 'snmp_credential',
            src_fields: {
               id: {},
            },
            src_query: '{id}',
            dst: 'device',
            dst_fields: {
               snmp_credential: {},
               table: {},
               retired: {},
            },
            dst_query:
               'CASE WHEN {table} == "device_oa" OR {retired} == "on" THEN NULL ELSE {snmp_credential} END',
         },
      },
      context: 'getDeviceCredentialCount',
   };

   let fields = [
      { key: 'id', text_filter_include: false },
      { key: 'name' },
      { key: 'version', hide: true },
      { key: 'type', formula: '"SNMP v" || {version}' },
      // Work around an ancient API bug where if you only link to a single thing, then it ignores the aggregation format and returns the value as is
      // By using the snmp_poll field instead of ID, if there is only 1 result, then it will come back as "on or "off".
      // The formula then checks if the value isnt a number, which means it must be a single entry that was linked to
      {
         key: '_devices',
         object: 'device',
         name: 'snmp_poll',
         links: ['deviceCountLink'],
         aggr_format: 'count_all',
         hide: true,
      },
      {
         key: 'devices',
         name: 'id',
         formula:
            'CASE WHEN {_devices} IS NULL THEN 0 WHEN {_devices}*1 IS NULL THEN 1 ELSE {_devices} END',
      },
   ];

   if (params?.snmp_credential_id) {
      command.id_filter = [params.snmp_credential_id];
   }

   // Common params
   command.fields = params?.sort
      ? formatFieldsWithSort({ fields, sort: params.sort, dir: params.dir })
      : fields;
   if (params?.text_filter) {
      command.text_filter = params.text_filter;
   }
   if (params?.limit) {
      command.limit = params.limit;
   }
   if (params?.sort) {
      command.sort = [params.sort];
   }
   return await new ApiGetRequest<SNMPCredentialListEntry>(command).run_api_request();
}

async function getCredentials(params?: GetCredentialsQueryParams) {
   const text_filter = params?.text_filter;
   const limit = params?.limit;
   let fields: (string | ApiField)[] = [
      { key: 'id', text_filter_include: false },
      'name',
      'version',
      {
         key: 'type',
         formula: '"SNMP v" || {version}',
      },
   ];

   fields = params?.sort
      ? formatFieldsWithSort({ fields, sort: params.sort, dir: params.dir })
      : fields;

   let option: ApiObject = {
      object_type: 'snmp_credential',
      fields,
      text_filter,
      context: 'getCredentials',
   };

   if (text_filter) {
      option = { ...option, text_filter };
   }

   if (limit) {
      option = { ...option, limit };
   }

   if (params?.sort) {
      const sort = [params?.sort];
      option = { ...option, sort };
   }

   return await new ApiGetRequest<SNMPCredentialListEntryFromAPI>({
      ...option,
   }).run_api_request();
}

async function getCredentialById(id: number) {
   return await new ApiGetRequest<SNMPCredential>({
      object_type: 'snmp_credential',
      fields: [
         'id',
         'name',
         'version',
         'community',
         'auth_method',
         'priv_method',
         'context',
         'auth_user',
         'auth_pass',
         'priv_pass',
      ],
      id_filter: [id],
      context: 'getCredentialById',
   }).run_api_request();
}

function formatCredentialBeforeSave<T extends AddSNMPCredentialData | SNMPCredential>(
   credential: T
): T {
   let newCred = { ...credential };
   if (credential.version === 2) {
      // V2 empty values need to be null (except for methods)
      newCred.context = null;
      newCred.auth_method = '';
      newCred.priv_method = '';
   } else if (credential.version === 3) {
      // V3 empty values can't be null for the backend uniqueness check
      if (!credential.context) {
         newCred.context = '';
      }
      if (!credential.auth_method) {
         newCred.auth_method = '';
      }
      if (!credential.priv_method) {
         newCred.priv_method = '';
      }
   }
   return newCred;
}

async function addCredential({ newCred }: { newCred: AddSNMPCredentialData }) {
   newCred = formatCredentialBeforeSave(newCred);
   return await api_add<SNMPCredential>({
      object_type: 'snmp_credential',
      rows: [newCred],
      context: 'addCredential',
   });
}

async function deleteCredentials({ ids }: { ids: number[] }) {
   return await api_delete<SNMPCredential>({
      object_type: 'snmp_credential',
      ids,
      context: 'deleteCredentials',
   });
}

async function updateCredential({ newCred }: { newCred: SNMPCredential }) {
   // Need to process credential to ensure certain logic for optional v3 fields
   newCred = formatCredentialBeforeSave(newCred);
   return await api_update<SNMPCredential>({
      object_type: 'snmp_credential',
      rows: [newCred],
      context: 'updateCredential',
   });
}

export {
   addCredential,
   deleteCredentials,
   getCredentialById,
   getCredentials,
   getDeviceCredentialCount,
   updateCredential,
};
