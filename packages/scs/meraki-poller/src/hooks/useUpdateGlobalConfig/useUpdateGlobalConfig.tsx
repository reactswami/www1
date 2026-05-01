import { type UseMutationOptions, useMutation, useQueryClient } from '@tanstack/react-query';
import { type AxiosResponse } from 'axios';
import { updateGlobalConfig } from 'packages/scs/meraki-poller/src/api/updateGlobalConfig';
import {
   type APIGlobalSchema,
   type ApiDatatype,
   type ApiGlobalConfig,
   type ApiNetworkCustomRule,
   type ApiOrganizationCustomRule,
   type DeepPartial,
} from 'packages/scs/meraki-poller/src/types';
import { queryKeys } from '~/lib/ReactQuery';

/*
 * We are doing optimistic updates here, which means that we manually update the state before the API even reply.
 * If there's an error, we revert to the previous state.
 * This allows to have a GUI that appear to be much faster, whilst avoiding to have to keep track of an internal state.
 * Once the API reply, we update the cache.
 * https://tanstack.com/query/v4/docs/guides/optimistic-updates
 */
export const useUpdateGlobalConfig = (
   options?: UseMutationOptions<AxiosResponse<ApiGlobalConfig>, any, any>
) => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: (newConfig: DeepPartial<APIGlobalSchema>) => updateGlobalConfig(newConfig),
      ...options,
      onSuccess: (data, variables, context) => {
         return options?.onSuccess && options.onSuccess(data, variables, context);
      },
      onMutate: async (data) => {
         // eslint-disable-next-line @typescript-eslint/no-unused-expressions
         options?.onMutate && options.onMutate(data);
         await queryClient.cancelQueries({ queryKey: queryKeys.globalConfig });
         const previousConfig = queryClient.getQueryData(queryKeys.globalConfig);
         queryClient.setQueryData(
            queryKeys.globalConfig,
            // @ts-ignore
            (old: AxiosResponse<APIGlobalSchema> | undefined) => {
               if (!old || !old.data) {
                  return undefined;
               }
               return deepMergeConfig(old.data, data);
            }
         );
         return { previousConfig };
      },
      onError: (err, data, context) => {
         // eslint-disable-next-line @typescript-eslint/no-unused-expressions
         options?.onError && options.onError(err, data, context);
         queryClient.setQueryData(
            queryKeys.globalConfig,
            (context as { previousConfig: undefined | APIGlobalSchema }).previousConfig
         );
      },
      onSettled: (data, error, variables, context) => {
         // eslint-disable-next-line @typescript-eslint/no-unused-expressions
         options?.onSettled && options.onSettled(data, error, variables, context);
         queryClient.invalidateQueries({ queryKey: queryKeys.globalConfig });
      },
   });
};

function deepMergeConfig(
   old: APIGlobalSchema,
   data: DeepPartial<APIGlobalSchema>
): { data: APIGlobalSchema } {
   const deepMergeEntity = (type: 'organizations' | 'networks') =>
      Object.entries(data[type] ?? {})
         .map(([id, values]) => ({
            [id]: { ...old[type][id], ...values },
         }))
         .reduce((current, previous) => ({ ...current, ...previous }), old[type]);

   const result: APIGlobalSchema = {
      networks: deepMergeEntity('networks'),
      organizations: deepMergeEntity('organizations'),
      is_polling: old.is_polling,
      down_message: old.down_message,
      is_exceeded: old.is_exceeded,
      exceeded_message: old.exceeded_message,
      global_request_limit: old.global_request_limit,
      global_request_timeout: old.global_request_timeout,
      disable_polling: data.disable_polling ?? old.disable_polling,
      cleanup_rules: { ...old.cleanup_rules, ...data.cleanup_rules },
      base_url: old.base_url,
      rules: {
         organization: old.rules.organization.map(({ id, ...rest }) => {
            const newRule = data.rules?.organization?.find((newRule) => newRule?.id === id);
            if (newRule) {
               return { id, ...rest, ...newRule } as ApiOrganizationCustomRule;
            }
            return { id, ...rest };
         }),
         network: old.rules.network.map(({ id, ...rest }) => {
            const newRule = data.rules?.network?.find((newRule) => newRule?.id === id);
            if (newRule) {
               return { id, ...rest, ...newRule } as ApiNetworkCustomRule;
            }
            return { id, ...rest };
         }),
      },
      api_key: data.api_key ?? old.api_key,
      rate_limit: data.rate_limit ?? old.rate_limit,
      request_limit: old.request_limit,
      max_retries: old.max_retries,
      request_timeout: old.request_timeout,
      config_poll_interval: data.config_poll_interval ?? old.config_poll_interval,
      disabled_data_types: (data.disabled_data_types as ApiDatatype[]) ?? old.disabled_data_types,
   };
   return { data: result };
}
