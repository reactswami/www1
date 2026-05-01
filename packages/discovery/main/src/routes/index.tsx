import { Alert, AlertDescription, AlertTitle, Spinner } from '@chakra-ui/react';
import {
   executeDiscover,
   type DiscoverExecuteOptions,
} from '@statseeker/api/internal_api/entities';
import {
   AdminLayout,
   ListRestartIcon,
   RadarIcon,
   RotateCwIcon,
   SearchIcon,
   SquarePenIcon,
   HistoryIcon,
} from '@statseeker/components';
import { NavLayout } from '@statseeker/components/Layout/NavLayout';
import { NavCard, NavCardBuilder } from '@statseeker/components/Layout/NavLayout/components';
import { useNimOptions, useToast } from '@statseeker/hooks';
import { getAllPollers } from '@statseeker/utils/apiOptions';
import { getProductName } from '@statseeker/utils/environment';
import { useMutation, useSuspenseQuery, useQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import useFormActions from './-components/schedule/hooks/useFormActions';
import { useDisplayPanel, useStopDiscovery } from '~/hooks';
import { discoverQueryOptions } from '~/lib/ReactQuery';
import '../styles.css';
import { getModeDisplayName } from '~/utils';

export const Route = createFileRoute('/')({
   loader: (opts) =>
      opts.context.queryClient.ensureQueryData(
         discoverQueryOptions.currentDiscoverQueryOptions({ refetchInterval: 15000 })
      ),
   component: IndexRoute,
});

const canShowDiscoveryCards = ({
   deviceName,
   allowedPanels,
}: {
   deviceName: string | undefined;
   allowedPanels: {
      range: boolean;
      rewalk: boolean;
      manual: boolean;
      pingOnly: boolean;
      remotePingOnly: boolean;
      history: boolean;
      schedule: boolean;
   };
}) => {
   const { range, rewalk, manual, pingOnly, remotePingOnly, history, schedule } = allowedPanels;

   const hasDeviceName = deviceName ? true : false;
   const showNetworkDiscovery = !hasDeviceName && range;
   const showRewalk = rewalk;
   const showManualDevice = !hasDeviceName && manual;
   const showPingOnlyDiscovery = !hasDeviceName && pingOnly;
   const showRemotePingOnlyDiscovery = !hasDeviceName && remotePingOnly;
   const showHistory = history;
   const showSchedule = schedule;

   return {
      showNetworkDiscovery,
      showRewalk,
      showManualDevice,
      showPingOnlyDiscovery,
      showRemotePingOnlyDiscovery,
      showHistory,
      showSchedule,
   };
};

function IndexRoute() {
   const toast = useToast();
   const search = Route.useSearch();
   const { getAll, getRawValueByKey } = useNimOptions();
   const { allowedPanels } = useDisplayPanel(getAll(), getRawValueByKey);
   useQuery(getAllPollers());

   const { displayScheduleAddForm: addNetworkForm, addDisclosure: addDiscloseNetwork } =
      useFormActions();
   const { displayScheduleAddForm: addRewalkForm, addDisclosure: addDiscloseRewalk } =
      useFormActions();

   const currentDiscover = useSuspenseQuery(
      discoverQueryOptions.currentDiscoverQueryOptions({ refetchInterval: 15000 })
   ).data;
   const { stopDiscovery } = useStopDiscovery();
   const [isStopping, setStopping] = useState(false);

   const discoverStop = useCallback(() => {
      setStopping(true);
      stopDiscovery();
   }, [stopDiscovery]);

   const discoveryInProgress = currentDiscover && Object.keys(currentDiscover).length > 0;
   const navigate = useNavigate();

   const {
      mutate: runNowMutation,
      isPending,
      variables,
   } = useMutation({
      mutationFn: ({
         mode,
         devices,
      }: {
         mode: DiscoverExecuteOptions['mode'];
         devices?: DiscoverExecuteOptions['devices'];
      }) => executeDiscover({ mode, devices }),
      onSuccess: () => {
         navigate({
            to: '/current',
            search: true,
         });
      },
      onError: () => {
         toast({
            title: 'Error',
            description: 'Failed to start discovery',
            status: 'error',
         });
      },
   });

   const { isNetworkDiscoverRunning, isRewalkRunning, isPingOnlyRunning, iManualRunning } = useMemo(() =>
   ({
      isNetworkDiscoverRunning: (isPending && variables.mode === 'Discover') ||
         (currentDiscover && currentDiscover.mode === 'Discover') ||
         (currentDiscover &&
            currentDiscover.mode === 'Hosts' &&
            currentDiscover.credential_length > 0)
      , isRewalkRunning: (isPending && variables?.mode === 'Rewalk') ||
         (currentDiscover && currentDiscover.mode === 'Rewalk'),
      isPingOnlyRunning: (currentDiscover && currentDiscover.mode === 'Ping Only Discover') ||
         (currentDiscover &&
            currentDiscover.mode === 'Hosts' &&
            currentDiscover.credential_length === 0),
      iManualRunning: currentDiscover && currentDiscover.mode === 'Manual'
   }), [currentDiscover, isPending, variables?.mode]);

   const stopLabel = useMemo(() => isStopping ? 'Stopping' : 'Stop', [isStopping]);

   useEffect(() => {
      if (!isNetworkDiscoverRunning || !isRewalkRunning || !iManualRunning || !isPingOnlyRunning) {
         setStopping(false);
      }
   }, [isNetworkDiscoverRunning, isRewalkRunning, iManualRunning, isPingOnlyRunning]);

   const buildProgressCard = useCallback((builder: NavCardBuilder, mode: string) => builder
      .header(createSpinnerHeader())
      .addLinkButton('View Progress', '/current')
      .addStandardButton(
         `${stopLabel} ${getModeDisplayName(mode)}`,
         discoverStop,
         { type: 'warning', disabled: isStopping }
      )
      .build(), [discoverStop, stopLabel, isStopping]);
   const deviceName = search?.device;
   const {
      showNetworkDiscovery,
      showRewalk,
      showManualDevice,
      showPingOnlyDiscovery,
      showHistory,
      showSchedule,
   } = canShowDiscoveryCards({ deviceName, allowedPanels });

   const getExecuteRewalk = useCallback(() =>
      deviceName
         ? runNowMutation({ mode: 'Rewalk', devices: [deviceName] })
         : runNowMutation({ mode: 'Rewalk' }),
      [deviceName, runNowMutation]
   );

   const title = `Discover My Network`;
   const discoveryTitle = deviceName ? `${title} - ${deviceName}` : title;

   // Helper to create spinner header
   const createSpinnerHeader = () => (
      <Spinner margin={'auto'} display={'block'} color="primary.500" size={'lg'} />
   );

   // Build Network Discovery Card
   const networkDiscoveryCard = useMemo(() => {
      const builder = new NavCardBuilder()
         .text('Network Discovery')
         .description('Scan the network for devices to monitor via ICMP and SNMP')
         .className('network-discovery')
         .visible(showNetworkDiscovery);

      if (isNetworkDiscoverRunning) {
         return buildProgressCard(builder, 'Discover');
      }

      return builder
         .icon(<SearchIcon size="xl" />)
         .addLinkButton('Customize', '/network', { ...search, from: undefined }, {
            disabled: discoveryInProgress
         })
         .addDropdownButton([
            {
               buttonText: 'Run Now',
               link: () => runNowMutation({ mode: 'Discover' }),
               disabled: discoveryInProgress,
            },
            {
               buttonText: 'Save',
               link: () => addDiscloseNetwork.onOpen(),
               disabled: discoveryInProgress,
            },
         ])
         .build();
   }, [showNetworkDiscovery, isNetworkDiscoverRunning, buildProgressCard, discoveryInProgress, addDiscloseNetwork, runNowMutation, search]);

   // Build Rewalk Card
   const rewalkCard = useMemo(() => {
      const builder = new NavCardBuilder()
         .text('Rewalk')
         .description(
            `Re-discover the devices that ${getProductName()} is already monitoring to detect any changes in available information`
         )
         .className('rewalk')
         .visible(showRewalk);

      if (isRewalkRunning) {
         return buildProgressCard(builder, 'Rewalk');
      }

      return builder
         .icon(<RotateCwIcon size="xl" />)
         .addLinkButton('Customize', '/rewalk', { ...search, from: undefined }, {
            disabled: discoveryInProgress
         })
         .addDropdownButton([
            {
               buttonText: 'Run Now',
               link: () => getExecuteRewalk(),
               disabled: discoveryInProgress,
            },
            {
               buttonText: 'Save',
               link: () => addDiscloseRewalk.onOpen(),
               disabled: discoveryInProgress,
            },
         ])
         .build();
   }, [isRewalkRunning, discoveryInProgress, buildProgressCard, addDiscloseRewalk, getExecuteRewalk, showRewalk, search]);

   // Build Manual Device Addition Card
   const manualDeviceCard = useMemo(() => {
      const builder = new NavCardBuilder()
         .text('Manual Device Addition')
         .description('Manually specify one or more devices for discovery')
         .visible(showManualDevice)
         .className('manual-add');

      if (iManualRunning) {
         return buildProgressCard(builder, 'Manual');
      }

      return builder
         .cardAction('/manual')
         .disable(discoveryInProgress)
         .icon(<SquarePenIcon size="xl" />)
         .addLinkButton('Customize and Run', '/manual', { ...search, from: undefined }, {
            disabled: discoveryInProgress
         })
         .build();
   }, [iManualRunning, discoveryInProgress, buildProgressCard, showManualDevice, search]);

   // Build Ping-only Discovery Card
   const pingOnlyCard = useMemo(() => {
      const builder = new NavCardBuilder()
         .text('Ping-only Discovery')
         .description('Scan the network for devices to monitor via ICMP only')
         .className('ping-only')
         .visible(showPingOnlyDiscovery);

      if (isPingOnlyRunning) {
         return buildProgressCard(builder, 'Ping Only Discover');
      }

      return builder
         .cardAction('/ping')
         .disable(discoveryInProgress)
         .icon(<RadarIcon size="xl" />)
         .addLinkButton('Customize and Run', '/ping', { ...search, from: undefined }, {
            disabled: discoveryInProgress
         })
         .build();
   }, [isPingOnlyRunning, discoveryInProgress, buildProgressCard, showPingOnlyDiscovery, search]);

   // Build View Recent Discoveries Card
   const historyCard = useMemo(() => {
      return new NavCardBuilder()
         .text('View Recent Discoveries')
         .description('View Discovery and Rewalk logs')
         .visible(showHistory)
         .icon(<ListRestartIcon size="xl" />)
         .className('view-recent')
         .cardAction('/history')
         .addLinkButton('View Discovery Summaries', '/history')
         .build();
   }, [showHistory]);

   // Build View Schedules Card
   const scheduleCard = useMemo(() => {
      return new NavCardBuilder()
         .text('View Saved Configurations')
         .description('View all the saved configurations for discovery')
         .visible(showSchedule)
         .icon(<HistoryIcon size="xl" />)
         .className('view-schedule')
         .cardAction('/schedule')
         .addLinkButton('View Saved Configurations', '/schedule')
         .build();
   }, [showSchedule]);

   return (
      <>
         {addNetworkForm({ discoveryType: 'Network', options: { mode: 'Discover' } })}
         {addRewalkForm({ discoveryType: 'Rewalk', options: { mode: 'Rewalk' } })}
         <AdminLayout title={discoveryTitle} subtitle="Menu" height='max-content'>
            {discoveryInProgress ? (
               <Alert status="info" marginBottom={'10px'}>
                  <Spinner marginRight={'10px'}></Spinner>
                  <AlertTitle>Discovery In Progress.</AlertTitle>
                  <AlertDescription>
                     Please wait for current discovery process to complete before starting another.
                  </AlertDescription>
               </Alert>
            ) : null}
            <NavLayout>
               <NavCard {...networkDiscoveryCard} />
               <NavCard {...rewalkCard} />
               <NavCard {...manualDeviceCard} />
               <NavCard {...pingOnlyCard} />
               <NavCard {...historyCard} />
               <NavCard {...scheduleCard} />
            </NavLayout>
         </AdminLayout >
      </>
   );
}