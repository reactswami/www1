import { AdminLayout } from '@statseeker/components';
import { PingTable } from '~/components';
import { PingTableProvider } from '~/contexts';

export const PingManageDeviceRoute = () => {
   /* The provider is also in charge of fetching the data, as we're using server side it makes it simpler to bundle the pagination and state with the data fetching */
   return (
      <AdminLayout
         title="Observability Appliances"
         subtitle="Assign Device Ping Pollers"
      >
         <PingTableProvider>
            <PingTable />
         </PingTableProvider>
      </AdminLayout>
   );
};
