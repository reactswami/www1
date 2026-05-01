import { Box, Flex, Heading, ListItem, Text, UnorderedList } from '@chakra-ui/react';
import { getProductName } from '@statseeker/utils/environment';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_credentials/')({
   component: IndexRoute,
});

export default function IndexRoute() {
   return (
      <Flex padding={2} flexDirection={'column'}>
         <div>
            <Heading size="lg" className="text-2xl font-normal">
               About SNMP Credentials
            </Heading>
            <Box h="5"></Box>
            <Text>
               {getProductName()} monitors health and performance data from devices via Simple Network
               Management Protocol (SNMP) communication. There are 3 versions of SNMP and the
               version employed by {getProductName()} can be specified on a per-device basis:
            </Text>
            <Box h="15"></Box>
            <UnorderedList spacing={1.5} marginLeft={'2em'}>
               <ListItem>
                  SNMPv2 - the default SNMP version used by {getProductName()} when attempting to
                  communicate with a device.
               </ListItem>
               <ListItem>
                  SNMPv3 - offers added security, encrypting all SNMP communications between
                  the {getProductName()} server and the device.
               </ListItem>
               <ListItem>
                  SNMPv1 - typically employed as a fallback when a device doesn't support, or has
                  trouble with, SNMPv2 communications.
               </ListItem>
            </UnorderedList>
            <Box h="15"></Box>
            <Text>
               <Text as="b">NOTE: </Text>
               Some devices will have separate SNMP Credentials for <Text as="samp">read</Text> and <Text as="samp">write</Text> communications, {getProductName()} only requires SNMP <Text as="samp">read</Text> Credentials.
            </Text>
            <Box h="15"></Box>
            <Text>
               This page presents the list of SNMP Credentials configured on the server and the
               number of devices that are currently monitored using each set of SNMP Credentials.
            </Text>
            <Box h="15"></Box>
            <UnorderedList spacing={1.5} marginLeft={'2em'}>
               <ListItem>
                  Editing a set of SNMP Credentials applies those changes to the {getProductName()} configuration
                  for the assigned devices but does not push any changes to the devices themselves.
               </ListItem>
               <ListItem>
                  Deleting a set of SNMP Credentials will impact all devices currently polled using those
                  SNMP Credentials. You will be prompted to choose an alternative set of SNMP Credentials for
                  polling the devices via SNMP. Alternatively, you can acknowledge that SNMP polling
                  via {getProductName()} will be disabled for these devices until new SNMP Credentials are
                  specified.
               </ListItem>
            </UnorderedList>
            <Box h="15"></Box>
         </div>
      </Flex>
   );
}
