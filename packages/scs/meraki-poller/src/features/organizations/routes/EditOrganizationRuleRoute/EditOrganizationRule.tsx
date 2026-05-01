import { type SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Layout } from '~/components/Layout';
import { DEFAULT_RATE_LIMIT } from '~/config/defaults';
import {
   type OrganizationRuleFieldValues,
   OrganizationRuleForm,
} from '~/features/organizations/components/OrganizationRuleForm';
import { useFetchGlobalConfig, useGetOrganizationRuleByURLParams } from '~/hooks';
import { useUpdateOrganizationRule } from '~/hooks/useUpdateOrganizationRule';
import { useToast } from '~/lib/Chakra';
import { Routes } from '~/types/routes';

export const EditOrganizationRule = () => {
   const toast = useToast();
   const { data } = useFetchGlobalConfig();
   const rule = useGetOrganizationRuleByURLParams();
   const navigate = useNavigate();
   const { mutate: updateRule, isPending } = useUpdateOrganizationRule({
      onSuccess: () => {
         toast({
            status: 'success',
            title: 'Rule updated',
            description: 'The rule has been successfully updated',
         });
         navigate(Routes.organizationExplorer);
      },
      onError: () => {
         toast({
            status: 'error',
            title: 'Error',
            description:
               'Error updating the rule. If the problem persists, please contact Statseeker support.',
         });
      },
   });

   const onSubmit = async (data: OrganizationRuleFieldValues) => {
      updateRule({ rules: { organization: [{ ...rule, ...data }] } });
   };

   return (
      <Layout subtitle="Edit organization rule">
         <OrganizationRuleForm
            isLoading={isPending}
            defaultValues={{
               name: rule.name,
               rate_limit: rule.rate_limit ?? DEFAULT_RATE_LIMIT,
               enabled: rule.enabled ?? true,
            }}
            onSubmit={onSubmit as SubmitHandler<OrganizationRuleFieldValues>}
            selectedOrganizations={Object.entries(data?.data.organizations || {})
               .filter(([id, values]) => values.rule === rule.id)
               .map(([_, values]) => values.name)}
         />
      </Layout>
   );
};
