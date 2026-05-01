import { api_describe } from '@statseeker/api/internal_api';
import { queryOptions } from '@tanstack/react-query';

export const describeCredentialsQuery = () =>
   queryOptions({
      queryKey: ['credentials', 'describe'],
      queryFn: () => describeCredentials(),
   });

async function describeCredentials() {
   return await api_describe({ object_type: 'snmp_credential' });
}
