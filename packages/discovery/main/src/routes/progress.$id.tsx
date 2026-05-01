import {
   Button,
   Grid,
   GridItem,
   Text,
   Heading,
   Alert,
   AlertIcon,
   AlertTitle,
   AlertDescription,
   Spinner,
} from '@chakra-ui/react';
import { ChevronLeftIcon } from '@radix-ui/react-icons';
import {
   AdminLayout,
   AdminPage,
   RadarIcon,
   RotateCwIcon,
   SearchIcon,
   SquarePenIcon,
} from '@statseeker/components';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import * as z from 'zod';
import { NavBar } from '~/components';
import { DeviceIpsFound } from '~/components/progress/DeviceIpsFound';
import { DevicesErrors } from '~/components/progress/DevicesErrors';
import { FilteredOut } from '~/components/progress/FilteredOut';
import { IpsToScan } from '~/components/progress/IpsToScan';
import { NewDevices } from '~/components/progress/NewDevices';
import { NewInterfaces } from '~/components/progress/NewInterfaces';
import { ProcessingDevices } from '~/components/progress/ProcessingDevices';
import { RewalkDevices } from '~/components/progress/RewalkDevices';
import { RewalkDevicesReachable } from '~/components/progress/RewalkDevicesReachable';
import { SNMPFound } from '~/components/progress/SNMPFound';
import { SNMPTests } from '~/components/progress/SNMPTests';
import { SNMPWalks } from '~/components/progress/SNMPWalks';
import { useStopDiscovery } from '~/hooks';
import { getDiscoverHistoryByIdQuery } from '~/lib';
import { getModeDisplayName, getModeTypeDisplayName } from '~/utils';

export const Route = createFileRoute('/progress/$id')({
   parseParams: (params) => ({
      id: z.number().int().parse(Number(params.id)),
   }),
   loader: ({ context, params }) => {
      context?.queryClient.ensureQueryData(getDiscoverHistoryByIdQuery({ id: params.id }));
   },
   component: ProgressIdRoute,
});

export default function ProgressIdRoute() {
   const [refetchInterval, setRefetchInterval] = useState<number>(5000);
   const id = Route.useParams().id;
   const search = Route.useSearch();
   const { data } = useSuspenseQuery(
      getDiscoverHistoryByIdQuery({ id, refetchInterval: () => refetchInterval })
   );
   const { stopDiscovery } = useStopDiscovery();
   const deviceName = search?.device;
   const detailedLogUrl = `/cgi/nim-cfg-discover-wrapper?command=Display&hist_id=${id}`;
   const [stopping, setStopping] = useState(false);

   const discoverData = data?.data[0];
   const mode = discoverData?.mode;
   const start = discoverData?.start;
   const finish = discoverData?.finish;
   const user = discoverData?.user;
   const duration = discoverData?.duration;
   const status = discoverData?.status;
   const api_task = discoverData?.task_name;

   // if the mode is hosts and there are no snmp credentials it is actually a ping only discovery
   const isPingDiscover =
      mode === 'Ping Only Discover' || (mode === 'Hosts' && discoverData.credential_length === 0);


   let isInProgress = !finish;
   if (!isInProgress && refetchInterval !== 0) {
      setRefetchInterval(0);
   }

   useEffect(() => {
      if (!isInProgress) {
         setStopping(false);
      }
   }, [isInProgress]);

   let statusMessage = `<b>Started</b> ${start}, `;
   if (!isInProgress) {
      statusMessage += `<b>Completed</b> ${finish},`;
      statusMessage += ` (${duration})`;
   }
   if (user !== 'System') {
      statusMessage += `<b>User</b> ${user}`;
   }

   const title = `View Discovery Summary`;
   const discoveryTitle = deviceName ? `${title} - ${deviceName}` : title;

   let modeLabel = isPingDiscover
      ? getModeTypeDisplayName('Ping Only Discover', api_task)
      : getModeTypeDisplayName(mode, api_task);
   let modeIcon = <SearchIcon size="xl" />;
   if (mode === 'Rewalk') {
      modeIcon = <RotateCwIcon size="xl" />;
   } else if (mode === 'Manual') {
      modeIcon = <SquarePenIcon size="xl" />;
   } else if (isPingDiscover) {
      modeIcon = <RadarIcon size="xl" />;
   }

   let pageSubtitle = modeLabel;

   if (isInProgress) {
      pageSubtitle += ' Progress';
   } else {
      pageSubtitle += ' Summary';
   }

   function renderBackButton() {
      if (search.initial) {
         if (isInProgress) {
            return undefined;
         } else {
            return (
               <a href="/cgi/initialsetup">
                  <Button variant="link" leftIcon={<ChevronLeftIcon />}>
                     Back to server summary
                  </Button>
               </a>
            );
         }
      } else {
         return (
            <Link
               to={'/history'}
               search={(prev) => ({
                  ...prev,
                  dir: 'desc',
                  sort: 'finish',
               })}
            >
               <Button variant="link" leftIcon={<ChevronLeftIcon />}>
                  Back to discovery history
               </Button>
            </Link>
         );
      }
   }

   return (
      <>
         {search.initial ? <NavBar /> : null}
         <AdminLayout
            title={discoveryTitle}
            subtitle={pageSubtitle}
            customBackButtonComponent={renderBackButton()}
            isInitialSetup={search.initial}
         >
            <AdminPage className="discovery-history" alignItems={'center'} gap={5}>
               <Grid
                  templateColumns={`repeat(${isPingDiscover ? 3 : 4}, 1fr)`}
                  gap={6}
                  width={'100%'}
                  maxWidth={'container.xl'}
                  marginX={'auto'}
                  paddingX={'1rem'}
                  justifyContent={'center'}
               >
                  <GridItem
                     alignItems={'center'}
                     colSpan={4}
                     justifySelf={'center'}
                     display={'flex'}
                     gap={3}
                  >
                     {modeIcon}
                     <Heading>{modeLabel}</Heading>
                  </GridItem>
                  <GridItem justifySelf={'center'} colSpan={4}>
                     {isInProgress ? (
                        <Alert status="info" textAlign={'center'}>
                           <Spinner marginRight={'10px'}></Spinner>
                           <AlertTitle>Current Status</AlertTitle>
                           <AlertDescription>{status}</AlertDescription>
                        </Alert>
                     ) : (
                        <Alert
                           status={status !== 'Success' ? 'error' : 'success'}
                           textAlign={'center'}
                        >
                           <AlertIcon />
                           <AlertTitle>Overall Status</AlertTitle>
                           <AlertDescription>{status}</AlertDescription>
                        </Alert>
                     )}
                  </GridItem>
                  <GridItem justifySelf={'center'} colSpan={4}>
                     <Text
                        textAlign={'center'}
                        dangerouslySetInnerHTML={{ __html: statusMessage }}
                     ></Text>
                  </GridItem>
                  {isInProgress ? (
                     <GridItem justifySelf={'center'} colSpan={4} display={'flex'} gap={4}>
                        <a href={detailedLogUrl} target="_blank" rel="noopener noreferrer">
                           <Button>Show Detailed Log</Button>
                        </a>
                        <Button colorScheme="red" onClick={() => {
                           setStopping(true);
                           stopDiscovery();
                        }} isDisabled={stopping}>
                           {stopping ? 'Stopping' : 'Stop'} {getModeDisplayName(mode)}
                        </Button>
                     </GridItem>
                  ) : (
                     <GridItem justifySelf={'center'} colSpan={4} display={'flex'} gap={4}>
                        <a href={detailedLogUrl} target="_blank" rel="noopener noreferrer">
                           <Button>Show Detailed Log</Button>
                        </a>
                        <a
                           href={`/cgi/nim-cfg-discover-wrapper?command=Download&hist_id=${id}`}
                           download
                        >
                           <Button>Download Detailed Log</Button>
                        </a>
                        <a
                           href={`/cgi/nim-cfg-discover-wrapper?command=Download&type=full&hist_id=${id}`}
                           download
                        >
                           <Button>Download Full Data</Button>
                        </a>
                        {search.initial ? (
                           <a href="/">
                              <Button>Finish</Button>
                           </a>
                        ) : null}
                     </GridItem>
                  )}
                  <RewalkDevices
                     details={discoverData?.details}
                     discoverInProgress={isInProgress}
                     mode={mode}
                  />
                  <RewalkDevicesReachable
                     details={discoverData?.details}
                     discoverInProgress={isInProgress}
                     mode={mode}
                  />
                  <IpsToScan details={discoverData?.details} discoverInProgress={isInProgress} />
                  <DeviceIpsFound
                     details={discoverData?.details}
                     discoverInProgress={isInProgress}
                  />
                  {!isPingDiscover ? (
                     <SNMPTests details={discoverData?.details} discoverInProgress={isInProgress} />
                  ) : null}
                  {!isPingDiscover ? (
                     <SNMPFound details={discoverData?.details} discoverInProgress={isInProgress} />
                  ) : null}
                  {!isPingDiscover ? (
                     <FilteredOut
                        details={discoverData?.details}
                        discoverInProgress={isInProgress}
                     />
                  ) : null}
                  {!isPingDiscover ? (
                     <SNMPWalks details={discoverData?.details} discoverInProgress={isInProgress} />
                  ) : null}
                  {!isPingDiscover ? (
                     <ProcessingDevices
                        details={discoverData?.details}
                        discoverInProgress={isInProgress}
                     />
                  ) : null}
                  <NewDevices details={discoverData?.details} discoverInProgress={isInProgress} />
                  {!isPingDiscover ? (
                     <NewInterfaces
                        details={discoverData?.details}
                        discoverInProgress={isInProgress}
                     />
                  ) : null}
                  {!isPingDiscover ? (
                     <DevicesErrors
                        details={discoverData?.details}
                        discoverInProgress={isInProgress}
                     />
                  ) : null}
               </Grid>
            </AdminPage>
         </AdminLayout>
      </>
   );
}
