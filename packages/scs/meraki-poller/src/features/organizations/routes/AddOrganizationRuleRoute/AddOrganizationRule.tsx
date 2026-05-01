
import { type SubmitHandler } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { Layout } from '~/components/Layout';
import {
   type OrganizationRuleFieldValues,
   OrganizationRuleForm,
} from '~/features/organizations/components/OrganizationRuleForm';
import { useAddOrganizationRule } from '~/hooks/useAddOrganizationRule/useAddOrganizationRule';
import { useFetchGlobalConfig } from '~/hooks/useFetchGlobalConfig';
import { useToast } from '~/lib/Chakra';
import { type SelectedEntityRouterState } from '~/types/app';

export const AddOrganizationRule = () => {
   const toast = useToast();
   const navigate = useNavigate();
   const location = useLocation();
   const selectOrganizations = location.state as SelectedEntityRouterState;
   const selectOrganizationsId = selectOrganizations.map(({ id }) => id);
   const selectOrganizationsName = selectOrganizations.map(({ name }) => name);
   const { data } = useFetchGlobalConfig();
   const defaultValues = { rate_limit: data?.data.rate_limit };
   const { mutate, isPending } = useAddOrganizationRule({
      onSuccess: () => {
         toast({
            status: 'success',
            title: 'Success',
            description: 'The rule has been added successfully',
         });
         navigate(-1);
      },
      onError: () => {
         toast({
            status: 'error',
            title: 'Error',
            description:
               'The rule has not been added. If the problem persists, please contact Statseeker support.',
         });
      },
   });
   const onSubmit = async (data: OrganizationRuleFieldValues) => {
      mutate({
         rules: {
            organization: [
               {
                  ...data,
                  new_ids: selectOrganizationsId,
               },
            ],
         },
      });
   };

   return (
      <Layout subtitle="Add organization rule">
         <OrganizationRuleForm
            isLoading={isPending}
            onSubmit={onSubmit as SubmitHandler<OrganizationRuleFieldValues>}
            defaultValues={defaultValues}
            selectedOrganizations={selectOrganizationsName}
            shouldEnsureUniqueName={true}
         />
      </Layout>
   );
};
