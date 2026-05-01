import { type DeviceFilter } from '@statseeker/api/internal_api/entities/device/type';
import { ROWS_PER_PAGE } from '@statseeker/components/Legacy/SSDataTable';
import { formatSortParam } from '@statseeker/utils/formatSortParam';
import { queryOptions } from '@tanstack/react-query';
import { queryKeys } from './keys';
import { getDevicesWithCredential } from '~/api';
import { getCredentialById, getCredentials, getDeviceCredentialCount } from '~/api/snmp_credential';
import {
   type SNMPCredentialListEntry,
   type GetCredentialsQueryParams,
} from '~/types/snmpCredential';

export const getCredentialsQuery = (params?: GetCredentialsQueryParams) =>
   queryOptions({
      queryKey: queryKeys.GET_CREDENTIALS(params),
      queryFn: () => getCredentials(params),
   });

export const getCredentialsWithDeviceCountQuery = (
   params: GetCredentialsQueryParams & { snmp_credential_id?: number }
) => {
   params.limit = params?.limit || ROWS_PER_PAGE;
   return queryOptions({
      queryKey: queryKeys.GET_CREDENTIALS_WITH_DEVICE_COUNT(params),
      queryFn: async () => {
         const credsWithCounts = (await getDeviceCredentialCount(params));
         return {
            credentials: credsWithCounts.data,
            data_total: credsWithCounts?.data_total,
            success: credsWithCounts?.success === undefined ? false : credsWithCounts.success,
         } as {
            credentials: SNMPCredentialListEntry[];
            data_total: number;
            success: boolean;
         };
      },
   });
};

export const getCredentialByIdQuery = (id: number) =>
   queryOptions({
      queryKey: queryKeys.GET_CREDENTIAL_BY_ID(id),
      queryFn: () => getCredentialById(id),
   });

export const getDevicesWithCredentialQuery = (params: DeviceFilter, credentialId?: number) => {
   params = {
      limit: params.limit === undefined ? ROWS_PER_PAGE : params.limit,
      offset: params.offset === undefined ? 0 : params.offset,
      snmp_credential_id: params.snmp_credential_id ? params.snmp_credential_id : credentialId,
      sort: params.sort === undefined ? 'name' : formatSortParam(params.sort),
      dir: params.dir,
      text_filter: params.text_filter,
      group_id_filter: params.group_id_filter,
      ping_state: params.ping_state,
      snmp_state: params.snmp_state,
   };
   return queryOptions({
      queryKey: queryKeys.GET_DEVICES_WITH_CREDENTIAL(params),
      queryFn: () => getDevicesWithCredential(params),
   });
};
