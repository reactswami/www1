import { Layout } from 'packages/scs/meraki-poller/src/components';
import { OrganizationTable } from '../../components/OrganizationTable/OrganizationTable';
import { generateData } from '~/features/organizations/components';

export const OrganizationTableRoute = () => {
   const { data, isRefetching, isLoading, refetch } = generateData();

   return (
      <Layout subtitle="Organizations">
         <OrganizationTable
            data={data}
            isRefetching={isRefetching}
            isLoading={isLoading}
            refetch={refetch}
         />
      </Layout>
   );
};
