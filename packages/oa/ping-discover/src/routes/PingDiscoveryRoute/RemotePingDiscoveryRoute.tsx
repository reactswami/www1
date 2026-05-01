import { ChevronLeftIcon } from '@chakra-ui/icons';
import { AdminLayout, AdminPage, Button } from '@statseeker/components';
import {
   PingDiscover,
} from 'packages/oa/ping-discover/src/components';
import { type PingDiscoverProps } from '~/types';

export const RemotePingDiscoveryRoute = (props: PingDiscoverProps) => {
   return (
      <AdminLayout title="Discover My Network" subtitle="Remote Ping Discovery"
         customBackButtonComponent={
            <Button
               variant="link"
               icon={<ChevronLeftIcon />}
               onClick={() => {
                  history.back();
               }}
            >
               {'Back to Remote Ping Discovery'}
            </Button>
         }>
         <AdminPage className="oa-ping-discover" padding={6} gap="sm">
            <PingDiscover {...props} />
         </AdminPage>
      </AdminLayout>
   );
};
