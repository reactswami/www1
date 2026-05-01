import { Button, Flex, Spacer, Text, Heading } from '@chakra-ui/react';
import { DashboardIcon, GearIcon } from '@radix-ui/react-icons';


interface Props {
   onContinue: () => void;
   organizationsFound: number;
}

export const SuccessSummary = ({ onContinue, organizationsFound }: Props) => {
   return (
      <Flex gap={2} direction="column">
         <Heading size="sm">Meraki integration successful</Heading>
         <Spacer height="px" />
         <Text>Organizations found: {organizationsFound}</Text>
         <Text>
            Allow 10 minutes for data to be displayed within Statseeker.
         </Text>
         <Spacer height={2} />
         <Flex justifyContent="space-between">
            <Button
               onClick={() => {
                  if (window.top) {
                     window.top.location.href =
                        '/#dashboards:StatseekerDefaultMerakiGlobalOverview';
                  }
               }}
               leftIcon={<DashboardIcon />}
            >
               Go to the dashboard
            </Button>
            <Button
               onClick={async () => {
                  onContinue();
               }}
               variant={'outline'}
               leftIcon={<GearIcon />}
            >
               Advanced settings
            </Button>
         </Flex>
      </Flex>
   );
};
