import { Box, ListItem, UnorderedList } from '@chakra-ui/react';
import { Flex } from '@statseeker/components/Layout/Flex';
import { Heading } from '@statseeker/components/Typography/Heading';
import { Text } from '@statseeker/components/Typography/Text';
import { getProductName } from '@statseeker/utils/environment';
import { createFileRoute } from '@tanstack/react-router';


export const Route = createFileRoute('/directory/ad/')({
   component: IndexRoute,
});


function IndexRoute() {
   return (
      <Flex flexDirection="column" height="70vh" align="left" width="100%" minWidth="0">
         <Heading size="lg" className="text-2xl font-normal">
            About User Synchronization Policies
         </Heading>
         <Box h="5"></Box>
         <Text>
            User Synchronization policies define how users from Active Directory are discovered and created as
            user accounts in {getProductName()}.
         </Text>
         <Box h="15"></Box>
         <Text>
            Each policy contains several important components:
         </Text>
         <Box h="15"></Box>
         <UnorderedList>
            <ListItem>
               <b>User Attribute Template:</b> Defines the attributes, permissions, and settings applied when matched
               users are created or updated in {getProductName()}.
            </ListItem>
            <ListItem>
               <b>Security Groups to Include:</b> Specifies the Active Directory security groups whose user members
               will be imported.
            </ListItem>
            <ListItem>
               <b>Users to Include:</b> Specifies individual Active Directory users to import, even if they are not
               members of the included security groups.
            </ListItem>
            <ListItem>
               <b>Users to Exclude:</b> Specifies Active Directory users that should be excluded from the import,
               even if they match any of the include rules.
            </ListItem>
         </UnorderedList>
         <Box h="15"></Box>
         <Text>
            The ordering of policies is significant. If a user matches the include conditions of two policies
            (E.g. a user in two Active Directory groups), the policy ranked higher will be applied. Policy order
            can be modified in the left panel.
         </Text>
         <Box h="15"></Box>
         <Heading size="lg" className="text-2xl font-normal">
            Policy Order
         </Heading>
         <Box h="5"></Box>
         <Text>
            The ordering of policies is important. If a user matches the conditions of multiple policies
            (E.g. being a member of two Active Directory security groups), the highest-priority policy will
            be applied.
         </Text>
         <Box h="5"></Box>
         <Text>
            Policy priority can be adjusted using the ordering controls in the left panel.
         </Text>
         <Box h="15"></Box>
         <Heading size="lg" className="text-2xl font-normal">
            Execution and Dry Run
         </Heading>
         <Box h="5"></Box>
         <Text>
            To validate that policies will synchronize the correct users, a Dry Run option is available for
            testing purposes. This will display the {getProductName()} user changes that would occur if the policy
            were applied during the next scheduled synchronization run.
         </Text>
         <Box h="5"></Box>
         <Text>
            If policy changes need to take effect immediately, Execute can be used to run the policy configuration
            and filters without waiting for the next scheduled synchronization to run.
         </Text>
      </Flex>
   );
}
