import { ApiGetRequest, type ApiField } from '@statseeker/api/internal_api';
import { type SNMPCredential } from '@statseeker/api/internal_api/entities';

export async function getSnmpCredentials() {
   const fields: (string | ApiField)[] = ['id', 'name'];

   return new ApiGetRequest<SNMPCredential>({
      object_type: 'snmp_credential',
      fields: fields,
   }).run_api_request();
}
