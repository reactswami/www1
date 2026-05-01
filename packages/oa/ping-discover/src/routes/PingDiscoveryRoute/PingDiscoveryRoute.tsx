import { AdminLayout, AdminPage } from '@statseeker/components';
import {
   PingDiscover,
} from 'packages/oa/ping-discover/src/components';

export const PingDiscoveryRoute = () => {
   return (
      <AdminLayout title="Observability Appliances" subtitle="Remote Ping Discovery">
         <AdminPage className="oa-ping-discover" padding={6} gap="sm">
            <PingDiscover />
         </AdminPage>
      </AdminLayout>
   );
};
