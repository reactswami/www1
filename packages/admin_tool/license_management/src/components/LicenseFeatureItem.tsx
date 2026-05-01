import { Tag } from '@statseeker/components/Data/Tag';
import { Flex } from '@statseeker/components/Layout/Flex';
import { Spacer } from '@statseeker/components/Layout/Spacer';
import { Tooltip } from '@statseeker/components/Overlay/Tooltip';
import { Text } from '@statseeker/components/Typography/Text';
import { timeDifference } from '~/utils';

interface LicenseFeatureItemProps {
   title: string;
   description: string;
   enabled: boolean;
   licenced: boolean;
   expiration?: Date;
}

export const LicenseFeatureItem = (props: LicenseFeatureItemProps) => {
   const timeDiff = props.expiration && timeDifference(new Date(), props.expiration);

   return (
      <Flex gap={2} p={3} my={1} borderRadius={'md'} backgroundColor={'rgb(249 250 251)'}>
         <Tooltip label={props.description}>
            <Text>{props.title}</Text>
         </Tooltip>
         <Spacer />
         {props.expiration && timeDiff && (
            <Tooltip
               label={`Expire${
                  timeDiff.negative ? 'd' : 's'
               } on ${props.expiration.toLocaleDateString()}`}
            >
               <Flex>
                  <Tag variant={'warning'} size={'md'}>
                     {timeDiff.negative
                        ? `Expired ${timeDiff.pretty} ago`
                        : `${timeDiff.pretty} remaining`}
                  </Tag>
               </Flex>
            </Tooltip>
         )}
         <Tag variant={props.enabled ? (props.licenced ? 'success' : 'danger') : 'gray'} size="md">
            {props.enabled ? (props.licenced ? 'Enabled' : 'Expired') : 'Disabled'}
         </Tag>
      </Flex>
   );
};
