/**
 * Contains the query options which combine the keys and functions
 */
import { describeSNMPCredential } from '@statseeker/api/internal_api/entities';
import { queryOptions } from '@tanstack/react-query';
import { snmpCredentialsKeys } from '../keys';
import { getCredentials } from '~/api';

export const snmpCredentialQueryOptions = {
   get: (params?: { text_filter?: string; sort?: string; dir?: string }) =>
      queryOptions({
         queryKey: snmpCredentialsKeys.get(params),
         queryFn: () => getCredentials(params),
      }),
   describe: () =>
      queryOptions({
         queryKey: snmpCredentialsKeys.describe(),
         queryFn: () => describeSNMPCredential(),
      }),
};
