import { Button, Flex } from '@chakra-ui/react';
import { ChevronLeftIcon } from '@radix-ui/react-icons';
import { AdminLayout } from '@statseeker/components';
import { Outlet, createFileRoute, useLocation, useRouter } from '@tanstack/react-router';
import { NavBar } from '~/components';
import { environment } from '~/config';

export const Route = createFileRoute('/_discovery')({
   component: DiscoveryLayoutRoute,
});

function DiscoveryLayoutRoute() {
   const location = useLocation();
   const router = useRouter();
   const search = Route.useSearch();


   function formatTitle(pathname: string) {
      let formattedPathName = pathname;

      if (environment.baseRouteName) {
         formattedPathName = pathname.replace(environment.baseRouteName, '');
      } else {
         formattedPathName = pathname.replace('/', '');
      }

      const routes: Record<string, string> = {
         network: 'Network Discovery',
         rewalk: 'Rewalk',
         manual: 'Manual Device Addition',
         ping: 'Ping-only Discovery',
      };

      return routes[formattedPathName] ?? pathname;
   }
   const deviceName = search?.device;

   const title = `Discover My Network`;
   const discoveryTitle = deviceName ? `${title} - ${deviceName}` : title;
   const backTo = search.from ? `/${search.from}` : '/';

   return (
      <>
         {search.initial ? <NavBar /> : null}
         <AdminLayout
            title={discoveryTitle}
            subtitle={formatTitle(location.pathname)}
            customBackButtonComponent={
               <Button
                  variant="link"
                  leftIcon={<ChevronLeftIcon />}
                  onClick={() => {
                     if (search.initial) {
                        window.location.href = '/cgi/initialsetup';
                     } else {
                        router.navigate({
                           to: backTo, search: (prev) => ({
                              ...prev,
                              poller: undefined,
                              include_ranges: undefined,
                              exclude_ranges: undefined
                           })
                        });
                     }
                  }}
               >
                  {search.initial ? 'Back to server summary' : 'Back to main menu'}
               </Button>
            }
            isInitialSetup={search.initial}
         >
            <Flex
               width={'100%'}
               maxWidth={'container.lg'}
               marginX={'auto'}
               overflowY={'auto'}
               paddingX={'1rem'}
            >
               <Outlet />
            </Flex>
         </AdminLayout>
      </>
   );
}
