/* eslint-disable react-hooks/rules-of-hooks */
import { type ApiOrganizationCustomRule, type ApiOrganizations } from 'packages/scs/meraki-poller/src/types';
import { useCallback, useMemo } from 'react';
import { type OrganizationRow } from '~/features/organizations/components/OrganizationTable/columnsDef';
import { useFetchGlobalConfig } from '~/hooks/useFetchGlobalConfig';

interface UseRowsInterface {
   data: OrganizationRow[];
   isRefetching: boolean;
   refetch: () => void;
   isLoading: boolean;
}

export const generateData = (): UseRowsInterface => {
   const { data, isRefetching, isLoading, refetch } = useFetchGlobalConfig({
      options: { staleTime: Infinity, gcTime: Infinity },
   });
   const organizations = data?.data.organizations || {};

   const computeRawData = useCallback(
      (organizations: ApiOrganizations): OrganizationRow[] => {
         if (!organizations) {
            return [];
         }
         return Object.entries(organizations)
            .map(([id, values]) => {
               const rule: ApiOrganizationCustomRule | undefined =
                  data?.data.rules.organization.find(({ id }) => id === values.rule);

               return {
                  id: id,
                  name: values.name,
                  network_count: values.network_count,
                  api_enabled: values.api_enabled ? 'Enabled' : 'Disabled',
                  rate_limit: (rule?.rate_limit ?? data?.data.rate_limit) as number,
                  poll_requests: values.poll_requests,
                  poll_sent: values.poll_sent,
                  poll_limit: values.poll_limit,
                  rule_id: rule?.id,
                  rule_name: rule?.name,
               };
            })
            .sort((a, b) => (a.name > b.name ? 1 : -1)); // We sort by default by name to make sure the data always render between re-rerender in the same order, unless a filter/sort has been applied
      },
      [organizations]
   );

   return {
      data: useMemo(() => {
         return computeRawData(organizations);
      }, [organizations, computeRawData]),
      isLoading,
      isRefetching,
      refetch,
   };
};
