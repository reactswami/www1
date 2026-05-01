import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import { getProductName } from '@statseeker/utils/environment';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
   component: IndexRoute,
});

export default function IndexRoute() {
   return (
      <Flex padding={2} flexDirection={'column'}>
         <div>
            <Heading size="lg" className="text-2xl font-normal">
               About this page
            </Heading>
            <Box h="5"></Box>
            <Text>
               This page shows the list of all IP Address Ranges configured in {getProductName()}.
               You can select an existing range to edit it or select multiple ranges to either
               enable/disable or delete them in bulk. New ranges can be added or an existing
               range copied.
            </Text>
            <Box h="15"></Box>
            <Heading size="lg" className="text-2xl font-normal">
               About IP Address Ranges
            </Heading>
            <Box h="5"></Box>
            <Text>
               {getProductName()}'s Network Discovery process is used to find devices in your network and
               add them into {getProductName()} for monitoring via ICMP and SNMP. IP Address Ranges inform
               the discovery process which IP Address ranges to scan for devices and what SNMP
               Credentials to try for those devices.
            </Text>
            <Box h="15"></Box>
            <Text>
               By default the discovery process considers all enabled IP Address Ranges and if a
               device is found that matches more than one range, the lists of SNMP Credentials
               will be combined before being tested against the device.
            </Text>
            <Box h="30"></Box>
         </div>
      </Flex>
   );
}
