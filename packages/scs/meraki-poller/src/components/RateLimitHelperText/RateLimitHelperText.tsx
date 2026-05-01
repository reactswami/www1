import { Flex, Text } from '@chakra-ui/react';

export const RateLimitHelperText = () => (
   <Flex gap="xs" flexDirection={'column'}>
      <Text>
         Meraki limits API data collection to 10 requests per second for each
         organization.
      </Text>
      <Text>
         Lowering this value reduces the number of requests per second that
         Statseeker consumes from the Meraki API rate limit, but may reduce
         the number of networks that Statseeker can poll across each
         organization.
      </Text>
      <Text>
         If this value is set too high, Statseeker may consume too many
         requests from the Meraki API rate limit. This could prevent other
         users of the Meraki Dashboards API from accessing data, and could
         negatively impact Meraki Dashboards outside of Statseeker.
      </Text>
   </Flex>
);
