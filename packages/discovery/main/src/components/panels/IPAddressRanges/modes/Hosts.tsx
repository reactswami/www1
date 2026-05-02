import { Text } from '@statseeker/components/Layout';
import { useQuery } from '@tanstack/react-query';
import { discoverHostsQueryOptions } from '~/lib';

export function Hosts() {
   const numberOfIps = useQuery(discoverHostsQueryOptions.count()).data;

   return (
      <Text>
         Will use {numberOfIps?.data ? numberOfIps.data[0]?.count ?? 0 : 0} IP Addresses defined in
         the Host file.
      </Text>
   );
}
