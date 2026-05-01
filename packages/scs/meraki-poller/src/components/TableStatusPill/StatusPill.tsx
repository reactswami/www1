import { Flex, Tag, type ThemingProps, Tooltip } from '@chakra-ui/react';
import {
   CheckCircledIcon,
   CircleBackslashIcon,
   ExclamationTriangleIcon,
} from '@radix-ui/react-icons';

import { type ReactNode } from 'react';

export type NetworkStatus =
   | 'polling'
   | 'incomplete'
   | 'rate_limit'
   | 'disabled'
   | 'enabled';
interface Props {
   status: NetworkStatus;
   showTooltip?: boolean;
}

export const StatusPill = ({ status, showTooltip = true }: Props) => {
   const { colorScheme, icon, helpContent } = getStatusContent(status);
   return (
      <Tooltip label={helpContent} isDisabled={!showTooltip} openDelay={300}>
         <Tag
            colorScheme={colorScheme}
            variant="subtle"
            size="sm"
            borderRadius={'base'}
         >
            <Flex gap="sm" alignItems={'center'} textTransform="capitalize" whiteSpace="nowrap">
               {icon}
               {status.replace('_', ' ')}
            </Flex>
         </Tag>
      </Tooltip>
   );
};

const getStatusContent = (
   status: Props['status']
): {
   icon: ReactNode;
   colorScheme: ThemingProps['colorScheme'];
   helpContent: string;
} => {
   switch (status) {
      case 'enabled':
         return {
            icon: <CheckCircledIcon />,
            colorScheme: 'green',
            helpContent: 'Polling successfully',
         };
      case 'polling':
         return {
            icon: <CheckCircledIcon />,
            colorScheme: 'green',
            helpContent: 'Polling successfully',
         };
      case 'incomplete':
         return {
            icon: <ExclamationTriangleIcon />,
            colorScheme: 'gray',
            helpContent:
               'Polling not completed for this network. This may be because the network no longer exists or due to failed responses from the Meraki API. To exclude this network from Statseeker polling and dashboards, you can disable it using a rule action.',
         };
      case 'rate_limit':
         return {
            icon: <ExclamationTriangleIcon />,
            colorScheme: 'orange',
            helpContent:
               'Polling not completed for this network because the per-organization Meraki API rate limit is exceeded, or the Statseeker configured rate limit is exceeded. To reduce the number of API calls required, you can disable data types using a rule action. You can also increase the rate limit for the organization in Statseeker.',
         };
      case 'disabled':
         return {
            icon: <CircleBackslashIcon />,
            colorScheme: 'gray',
            helpContent: 'Polling is disabled',
         };
      default:
         throw new Error(`The status ${status} is not supported`);
   }
};
