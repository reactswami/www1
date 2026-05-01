
import { FormProvider, type SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Layout } from '~/components/Layout';
import { AddNetworkRuleForm } from '~/features/networks/components';
import { type FieldValues } from '~/features/networks/components/NetworkRuleForm';
import { useFetchGlobalConfig } from '~/hooks/useFetchGlobalConfig';
import { useGetRuleByURLParams } from '~/hooks/useGetNetworkRuleByURLParams';
import { useUpdateNetworkRule } from '~/hooks/useUpdateNetworkRule';
import { useToast } from '~/lib/Chakra';
import { ApiDatatype } from '~/types/api';
import { Routes } from '~/types/routes';

export const EditNetworkCustomRule = () => {
   const toast = useToast();
   const { data } = useFetchGlobalConfig();
   const rule = useGetRuleByURLParams();
   const navigate = useNavigate();
   const dataTypeValues = Object.values(ApiDatatype)
      .map((name) => ({
         [`datatype-${name}`]: !(rule.disabled_data_types || []).includes(name),
      }))
      .reduce((prev, curr) => ({ ...prev, ...curr }), {});

   const methods = useForm<FieldValues>({
      defaultValues: { ...rule, ...dataTypeValues },
   });

   const { mutate: updateRule, isPending } = useUpdateNetworkRule({
      onSuccess: () => {
         toast({
            status: 'success',
            title: 'Rule updated',
            description: 'The rule has been updated successfully',
         });
      },
      onError: () => {
         toast({
            status: 'error',
            title: 'Error',
            description:
               'An error has occurred, the rule has not been updated. If the problem persists, please contact Statseeker support.',
         });
      },
   });

   const selectedNetworks = Object.entries(data?.data.networks || {})
      .filter(([_, values]) => values.rule?.toString() === rule.id.toString())
      .map(([_, { name }]) => name);

   const onSubmit = async (data: FieldValues) => {
      updateRule({
         rules: {
            network: [
               {
                  ...data,
                  disabled_data_types: getDisabledDatatypes(data),
                  id: rule.id,
               },
            ],
         },
      });
      navigate(Routes.networkExplorer);
   };

   return (
      <Layout subtitle="Edit network rule">
         <FormProvider {...methods}>
            <AddNetworkRuleForm
               defaultValues={{ ...rule, ...dataTypeValues }}
               isLoading={isPending}
               onSubmit={onSubmit as SubmitHandler<FieldValues>}
               selectedNetworks={selectedNetworks}
               shouldEnsureUniqueName={false}
            />
         </FormProvider>
      </Layout>
   );
};

export const getDisabledDatatypes = (formValues: FieldValues): ApiDatatype[] =>
   Object.entries(formValues)
      .filter(([name, value]) => /datatype-/.test(name) && value === false)
      .map(([name, _]) => name.replace(/datatype-/, '') as ApiDatatype);
