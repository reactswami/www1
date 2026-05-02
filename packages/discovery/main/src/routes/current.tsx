import { Flex, Spinner, Text } from '@statseeker/components/Layout';
import { AdminLayout, AdminPage } from '@statseeker/components';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { discoverQueryOptions } from '~/lib';

export const Route = createFileRoute('/current')({
   loader: (opts) =>
      opts.context.queryClient.ensureQueryData(
         discoverQueryOptions.currentDiscoverQueryOptions({ refetchInterval: 5000 })
      ),
   component: CurrentDiscovery,
});

function CurrentDiscovery() {
   const { data } = useSuspenseQuery(
      discoverQueryOptions.currentDiscoverQueryOptions({ refetchInterval: 5000 })
   );
   const navigate = useNavigate();

   function navigateToProgressPage() {
      navigate({
         search: true,
         to: '/progress/$id',
         params: {
            id: data.id,
         },
      });
   }

   return Object.keys(data).length > 0 ? navigateToProgressPage() : <LoadingSpinner />;
}

function LoadingSpinner() {
   return (
      <AdminLayout title="">
         <AdminPage className="discovery-history" alignItems={'center'} gap={5}>
            <Flex
               flex={1}
               flexDirection={'column'}
               alignItems={'center'}
               justifyContent={'center'}
               gap={4}
            >
               <Spinner size={'xl'}></Spinner>
               <Text>Waiting for discovery to start...</Text>
            </Flex>
         </AdminPage>
      </AdminLayout>
   );
}
