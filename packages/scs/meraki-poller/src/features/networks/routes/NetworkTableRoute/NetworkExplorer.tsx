import { Layout } from 'packages/scs/meraki-poller/src/components';
import { NetworkTable } from '../../components/NetworkTable/NetworkTable';

export const NetworkExplorer = () => {
   return (
      <Layout subtitle="Networks">
         <NetworkTable />
      </Layout>
   );
};
