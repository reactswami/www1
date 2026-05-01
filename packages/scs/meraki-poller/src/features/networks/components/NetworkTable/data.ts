/* eslint-disable react-hooks/rules-of-hooks */
import { type APIGlobalSchema } from 'packages/scs/meraki-poller/src/types';
import { useCallback, useMemo } from 'react';
import { type NetworkRow } from './columnDef';
import { DEFAULT_CUSTOMRULE_NAME } from '~/config/defaults';
import { useFetchGlobalConfig } from '~/hooks/useFetchGlobalConfig';

export const generateData = () => {
   const { data, refetch, isRefetching, isLoading } = useFetchGlobalConfig({
      options: { staleTime: Infinity, gcTime: Infinity },
   });
   const networks = data?.data.networks || {};
   const organizations = data?.data.organizations || {};
   const networkRules = data?.data.rules.network || [];
   const defaultDatatypes = data?.data.disabled_data_types || [];

   const computeRawData = useCallback(
      (
         networks: APIGlobalSchema['networks'],
         organizations: APIGlobalSchema['organizations'],
         rules: APIGlobalSchema['rules']['network']
      ): NetworkRow[] =>
         Object.entries(networks)
            .map(([id, values]) =>
               prepareRow({
                  networkId: id,
                  networkValues: values,
                  defaultDatatypes,
                  organizations,
                  rules,
               })
            )
            .sort((a, b) => (a.name > b.name ? 1 : -1)),
      []
   );

   return {
      isLoading,
      isRefetching,
      refetch,
      data: useMemo(
         () => computeRawData(networks, organizations, networkRules),
         [computeRawData, networks, organizations, networkRules]
      ),
   };
};

/*
 * This function compute the data for each row and return an object with the row cvalues
 */
function prepareRow({
   networkId,
   networkValues,
   organizations,
   rules,
   defaultDatatypes,
}: {
   networkId: string;
   networkValues: APIGlobalSchema['networks'][0];
   organizations: APIGlobalSchema['organizations'];
   rules: APIGlobalSchema['rules']['network'];
   defaultDatatypes: APIGlobalSchema['disabled_data_types'];
}) {
   const organization = Object.entries(organizations)
      .map(([id, values]) => ({ id, ...values }))
      .find(({ id }) => id === networkValues.organization);

   const rule = rules.find(({ id }) => id === networkValues.rule);

   const rows: NetworkRow = {
      id: networkId,
      name: networkValues.name,
      organization_name: organization?.name ?? '-',
      device_count: networkValues.device_count,
      port_count: networkValues.port_count,
      poll_requests: networkValues.poll_requests,
      enabled:
         !rule || rule.enabled
            ? networkValues.poll_status ?? 'disabled'
            : 'disabled',
      priority: rule?.priority_network ?? false,
      disabled_datatypes: rule ? rule.disabled_data_types : defaultDatatypes,
      rule_id: rule?.id as string | undefined,
      rule_name: rule?.name ?? DEFAULT_CUSTOMRULE_NAME,
   };

   return rows;
}
