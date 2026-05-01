import { FormProvider, type SubmitHandler, useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { getDisabledDatatypes } from '../EditNetworkCustomRuleRoute/EditNetworkCustomRule';
import { Layout } from '~/components/Layout';
import { AddNetworkRuleForm, type FieldValues } from '~/features/networks/components';
import { useAddNetworkRule } from '~/hooks/useAddNetworkRule/useAddNetworkRule';
import { useToast } from '~/lib/Chakra';
import { type ApiNetworkCustomRule } from '~/types/api';
import { type SelectedEntityRouterState } from '~/types/app';

export const AddNetworkRule = () => {
   const toast = useToast();
   const { mutate, isPending } = useAddNetworkRule({
      onSuccess: () => {
         toast({
            status: 'success',
            title: 'Rule added',
            description: 'The rule was successfully added',
         });
         navigate(-1);
      },
      onError: () => {
         toast({
            status: 'error',
            title: 'Error',
            description:
               'An error has occurred. If the problem persists, please contact Statseeker support.',
         });
      },
   });
   const navigate = useNavigate();
   const location = useLocation();
   const methods = useForm<FieldValues>();

   const selectedNetworks = location.state as SelectedEntityRouterState;
   const selectedNetworksName = selectedNetworks.map(({ name }) => name);
   const selectedNetworksId = selectedNetworks.map(({ id }) => id);

   const onSubmit = async (data: FieldValues) => {
      const newRule: Omit<ApiNetworkCustomRule, 'id'> = {
         name: data.name,
         priority_network: data.priority_network,
         enabled: data.enabled,
         config_poll_interval: data.config_poll_interval,
         disabled_data_types: getDisabledDatatypes(data),
      };
      mutate({
         rules: {
            network: [{ ...newRule, new_ids: selectedNetworksId }],
         },
      });
   };

   return (
      <Layout subtitle="Add network rule">
         <FormProvider {...methods}>
            <AddNetworkRuleForm
               isLoading={isPending}
               onSubmit={onSubmit as SubmitHandler<FieldValues>}
               selectedNetworks={selectedNetworksName}
            />
         </FormProvider>
      </Layout>
   );
};
