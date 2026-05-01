import { ApiGetRequest, api_describe } from '../../api-request';
import { type ApiObject } from '../../types';
import { type SNMPCredential } from '../snmp_credential';

export const getSNMPCredentials = async (request: Omit<ApiObject, 'object_type'>) =>
   new ApiGetRequest<SNMPCredential>({
      ...request,
      object_type: 'snmp_credential',
   }).run_api_request();

export const describeSNMPCredential = async () =>
   await api_describe({ object_type: 'snmp_credential' });
