/*
 * All software Copyright 2024 of Techniche Technologies Pty Ltd., All rights reserved.
 * Any redistribution or reproduction of part or all of the contents in any form is
 * prohibited without express written permission of the company.
 */

import { ApiGetRequest, api_add, type ApiField, type ApiObject } from "@statseeker/api/internal_api";
import { type SNMPCredential } from "@statseeker/api/internal_api/entities";
import { formatFieldsWithSort } from '@statseeker/utils/formatFieldsWithSort';



async function getCredentials(params?: { text_filter?: string; sort?: string; dir?: string }) {
   const text_filter = params?.text_filter;
   let fields: (string | ApiField)[] = [
      { key: 'id', text_filter_include: false },
      'name',
      'version',
      {
         key: 'type',
         formula: '"SNMP v" || {version}',
      },
      'community',
      'auth_method',
      'auth_user',
      'auth_pass',
      'priv_method',
      'priv_pass',
      'context',
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

   if (params?.sort) {
      const sort = [params?.sort];
      option = { ...option, sort };
   }

   return await new ApiGetRequest<Pick<SNMPCredential, 'id' | 'name' | 'version'>>({
      ...option,
   }).run_api_request();
}

async function addCredential({
   originalCred,
   newCred,
}: {
   originalCred?: SNMPCredential;
   newCred: Omit<SNMPCredential, 'id'>;
}) {
   return await api_add<SNMPCredential>({
      object_type: 'snmp_credential',
      rows: [newCred],
      context: 'addCredential',
      options: {
         auth_pass_encrypted: originalCred?.auth_pass === newCred.auth_pass,
         priv_pass_encrypted: originalCred?.priv_pass === newCred.priv_pass,
      },
   });
}

export { addCredential, getCredentials };
