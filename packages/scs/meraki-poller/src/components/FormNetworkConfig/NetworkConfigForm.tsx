import { Checkbox, Flex, Heading, Text } from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';
import { FormNetworkConfigPollingIntervalRadio, Loader } from '~/components';
import { POLLING_INTERVAL_OPTIONS } from '~/config/defaults';
import { type FieldValues } from '~/features/settings/types/form';
import { useFetchGlobalConfig } from '~/hooks/useFetchGlobalConfig';
import { ApiDatatype } from '~/types/api';

export type Props = {
   value: 300 | 3600 | 86400;
   label: string;
   isSelected: boolean;
};

export const NetworkConfigForm = () => {
   const { register, setValue, watch, getValues } = useFormContext<FieldValues>();
   const { data, isLoading } = useFetchGlobalConfig({
      onSuccess: (data) => {
         if (!getValues('config_poll_interval')) {
            // If there are no config interval set, use the default one
            setValue('config_poll_interval', data.data.config_poll_interval);
         }
      },
   });
   const currentPollingIntervalValue = watch('config_poll_interval');

   if (isLoading) {
      return <Loader />;
   }

   const dataTypeValues = Object.values(ApiDatatype)
      .map((name) => ({
         [`datatype-${name}`]:
            getValues(`datatype-${name}` as keyof FieldValues) ??
            !data?.data.disabled_data_types.includes(name),
      }))
      .reduce((prev, curr) => ({ ...prev, ...curr }), {});

   return (
      <Flex gap="xxl">
         <Flex flexDirection="column" gap="sm">
            <Heading size="sm">API Endpoint collection</Heading>
            <Text>Define which Meraki API endpoints are configured for data collection.</Text>
            <Flex direction="column" gap="sm">
               {Object.entries(dataTypeValues)
                  .sort(([name1, _], [name2, __]) => (name1 > name2 ? 1 : -1))
                  .map(([name, isEnabled]) => (
                     <Flex
                        as="label"
                        key={name}
                        alignItems="center"
                        cursor="pointer"
                        transition="all 200ms ease-in"
                        gap={2}
                        borderRadius={2}
                        padding={2}
                        _hover={{
                           background: 'gray.100',
                        }}
                     >
                        <Checkbox
                           {...register(name as keyof FieldValues, {
                              value: isEnabled,
                           })}
                        />
                        {getDisplayNameForDatatype(name.replace(/datatype?-/g, '') as ApiDatatype)}
                     </Flex>
                  ))}
            </Flex>
         </Flex>

         <Flex flexDirection="column" gap="sm">
            <Heading size="sm">Configuration polling interval</Heading>
            <Text>How often configuration and topology data is retrieved.</Text>
            <Flex flexDirection="column" gap="sm">
               {POLLING_INTERVAL_OPTIONS.map(({ value, label }) => (
                  <FormNetworkConfigPollingIntervalRadio
                     key={value}
                     value={value}
                     setValue={setValue}
                     isSelected={value === currentPollingIntervalValue}
                     label={label}
                  />
               ))}
            </Flex>
         </Flex>
      </Flex>
   );
};

export const getDisplayNameForDatatype = (datatype: ApiDatatype) => {
   switch (datatype) {
      case ApiDatatype.clientApplications:
         return 'Client Applications';
      case ApiDatatype.clientConfiguration:
         return 'Clients';
      case ApiDatatype.events:
         return 'Event Log';
      case ApiDatatype.switchPorts:
         return 'Interfaces';
      case ApiDatatype.topology:
         return 'Topology';
      case ApiDatatype.wirelessConnectionStats:
         return 'Wireless Connections';
      case ApiDatatype.wirelessLatencyStats:
         return 'Wireless Latency';
   }
};
