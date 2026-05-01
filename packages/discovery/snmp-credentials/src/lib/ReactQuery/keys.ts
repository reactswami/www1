/**
 * Contains the query keys for the queries
 * @see https://tanstack.com/query/v4/docs/guides/query-keys
 */

import { type DeviceFilter } from '@statseeker/api/internal_api/entities/device/type';
import { type GetCredentialsQueryParams } from '~/types/snmpCredential';

export const queryKeys = {
   CREDENTIALS: ['snmp_credential'] as const,
   GET_CREDENTIALS: (params?: GetCredentialsQueryParams) =>
      [...queryKeys.CREDENTIALS, params] as const,
   GET_CREDENTIALS_WITH_DEVICE_COUNT: (params?: GetCredentialsQueryParams) =>
      [...queryKeys.CREDENTIALS, 'device_count', params] as const,
   DESCRIBE_CREDENTIALS: () => [...queryKeys.CREDENTIALS, 'describe'] as const,
   GET_CREDENTIAL_BY_ID: (id: number) => [...queryKeys.CREDENTIALS, id] as const,
   DEVICES: ['device'] as const,
   GET_DEVICES_WITH_CREDENTIAL: (params?: DeviceFilter) =>
      [...queryKeys.DEVICES, params] as const,
};
