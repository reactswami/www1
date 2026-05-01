import { ChevronDownIcon } from '@chakra-ui/icons';
import {
   Box,
   Button,
   Collapse,
   Container,
   Flex,
   Heading,
   useDisclosure,
} from '@chakra-ui/react';
import {
   type APIGlobalSchema,
   ApiDatatype,
   ApiStalableDatatype,
   type DeepPartial,
   Routes,
} from 'packages/scs/meraki-poller/src/types';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { useNavigate } from 'react-router-dom';
import { CleanupIntervalsSection } from '../CleanupIntervalsSection/CleanupIntervalsSection';
import { ConnectionSettingsSection } from '../ConnectionSettingsSection';
import { DisablePollerButton } from '../DisablePollerButton/DisablePollerButton';
import { GlobalConfiguration } from '../GlobalConfiguration';
import { Section } from '../Section';
import ErrorScreen from '~/components/ErrorBoundary/ErrorBoundary';
import { OrganizationConfigForm } from '~/components/FormOrganizationConfig';
import { Loader } from '~/components/Loader';
import { type FieldValues } from '~/features/settings/types/form';
import { useFetchGlobalConfig } from '~/hooks/useFetchGlobalConfig';
import { useUpdateGlobalConfig } from '~/hooks/useUpdateGlobalConfig/useUpdateGlobalConfig';
import { useToast } from '~/lib/Chakra';

export const SettingsForm = () => {
   const navigate = useNavigate();
   const toast = useToast();
   const methods = useForm<FieldValues>();
   const { isOpen: isOpenPollingSettings, onToggle: onTogglePollingSettings } =
      useDisclosure({ defaultIsOpen: false });
   const { mutate, isPending: isSaving } = useUpdateGlobalConfig({
      onSuccess: () =>
         toast({
            status: 'success',
            title: 'Settings updated',
            description: 'Your settings have been saved.',
         }),
      onError: () =>
         toast({
            status: 'error',
            title: 'Error',
            description:
               'An error has occurred. Your settings have not been saved. Please retry. If the problem persists, please contact Statseeker support.',
         }),
   });
   const {
      isSuccess,
      data,
      isLoading: isLoadingDefaultValues,
      isError,
   } = useFetchGlobalConfig();

   // Handle success
   useEffect(() => {
      if (!data || !isSuccess) {
         return;
      }
      methods.reset(getDefaultValues(data.data));
   }, [isSuccess, data]);

   if (isLoadingDefaultValues) {
      return <Loader />;
   }

   if (isError) {
      return (
         <ErrorScreen message="Error fetching the configuration settings." />
      );
   }

   const onSubmit = async (formValues: FieldValues) => {
      const newConfig: DeepPartial<APIGlobalSchema> = {
         cleanup_rules: getCleanupRules(formValues),
         disabled_data_types: getDisabledDatatypes(formValues),
         config_poll_interval: formValues.config_poll_interval,
         rate_limit: formValues.rate_limit,
      };
      mutate(newConfig);
   };

   return (
      <FormProvider {...methods}>
         <Container maxW="container.lg">
            {isSaving && (
               <Flex
                  position={'absolute'}
                  height="100%"
                  width={'100%'}
                  backdropBlur={'md'}
                  justify="center"
                  alignItems={'center'}
                  background={'whiteAlpha.200'}
               >
                  <Loader message="Saving form" />
               </Flex>
            )}
            <Flex gap="md" flexWrap={'wrap'} direction="column">
               <ConnectionSettingsSection />
               <Section>
                  <Flex
                     onClick={onTogglePollingSettings}
                     justifyContent="space-between"
                     transition="background 100ms ease-in"
                     cursor="pointer"
                     borderRadius="md"
                     _hover={{
                        background: 'gray.50',
                     }}
                     margin={0}
                     paddingX={2}
                     paddingY={1}
                  >
                     <Heading size="md">Polling settings</Heading>
                     <Flex
                        justifyContent={'center'}
                        alignItems="center"
                        transition="all 100ms ease-in"
                        transformOrigin={'center'}
                        transform={`rotate(${
                           isOpenPollingSettings ? '180deg' : '0deg'
                        })`}
                     >
                        <ChevronDownIcon />
                     </Flex>
                  </Flex>
                  <Collapse in={isOpenPollingSettings}>
                     <Box paddingX={3} paddingBottom={2}>
                        <OrganizationConfigForm />
                        <Flex
                           marginTop={6}
                           flexDirection="column"
                           justifyContent={'flex-start'}
                           alignItems="flex-start"
                           gap="sm"
                        >
                           <Heading size="sm">
                              Enable/Disable data collection
                           </Heading>
                           <DisablePollerButton />
                        </Flex>
                     </Box>
                  </Collapse>
               </Section>
               <CleanupIntervalsSection />
               <Section>
                  <GlobalConfiguration />
               </Section>
               <Flex gap="md">
                  <Button
                     onClick={methods.handleSubmit(onSubmit as any)}
                     isLoading={isSaving}
                  >
                     Save
                  </Button>
                  <Button
                     variant="ghost"
                     onClick={() => navigate(Routes.menu)}
                     isDisabled={isSaving}
                  >
                     Cancel
                  </Button>
               </Flex>
            </Flex>
         </Container>
      </FormProvider>
   );
};

const getDefaultValues = (data: APIGlobalSchema): FieldValues => ({
   Device: data.cleanup_rules.Device,
   Interface: data.cleanup_rules.Interface,
   Wireless: data.cleanup_rules.Wireless,
   Client: data.cleanup_rules.Client,
   Application: data.cleanup_rules.Application,
   Uplink: data.cleanup_rules.Uplink,
   VPN: data.cleanup_rules.VPN,
   Topology: data.cleanup_rules.Topology,
   rate_limit: data.rate_limit,
   'datatype-wireless_latency_stats': !data.disabled_data_types.includes(
      ApiDatatype.wirelessLatencyStats
   ),
   'datatype-wireless_connection_stats': !data.disabled_data_types.includes(
      ApiDatatype.wirelessConnectionStats
   ),
   'datatype-client_configuration': !data.disabled_data_types.includes(
      ApiDatatype.clientConfiguration
   ),
   'datatype-client_applications': !data.disabled_data_types.includes(
      ApiDatatype.clientApplications
   ),
   'datatype-switch_ports': !data.disabled_data_types.includes(
      ApiDatatype.switchPorts
   ),
   'datatype-events': !data.disabled_data_types.includes(ApiDatatype.events),
   'datatype-topology': !data.disabled_data_types.includes(
      ApiDatatype.topology
   ),
   config_poll_interval: data.config_poll_interval,
});

const getCleanupRules = (formValues: FieldValues) =>
   Object.values(ApiStalableDatatype)
      .map((name) => ({
         [name]: formValues[name],
      }))
      .reduce((previous, current) => ({ ...previous, ...current }), {});

export const getDisabledDatatypes = (formValues: FieldValues): ApiDatatype[] =>
   Object.entries(formValues)
      .filter(([name, value]) => /datatype-/.test(name) && value === false)
      .map(([name, _]) => name.replace(/datatype-/, '') as ApiDatatype);
