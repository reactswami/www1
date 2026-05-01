import { type APILicenseLimit } from '@statseeker/api/internal_api/entities/license/type';
import { Tag } from '@statseeker/components/Data/Tag';
import { Progress } from '@statseeker/components/Feedback/Progress';
import { Flex } from '@statseeker/components/Layout/Flex';
import { Spacer } from '@statseeker/components/Layout/Spacer';
import { Tooltip } from '@statseeker/components/Overlay/Tooltip';
import { Text } from '@statseeker/components/Typography/Text';
import { p } from 'msw/lib/core/GraphQLHandler-D1CSV926';

interface LicenseLimitItemProps {
   limit: APILicenseLimit;
}

export const LicenseLimitItem = (props: LicenseLimitItemProps) => {
   /*
    * The device limit information includes the statseeker device. We need to
    * ignore this when displaying to the user
    */
   const total = props.limit.title === 'Device' ? props.limit.total - 1 : props.limit.total;
   const disabled = total - props.limit.polled - props.limit.exceeded;

   /*
    * For new licenses, they may have been given more or less limits. So adjsut the exceeded/polled
    * numbers so they reflect what the new license would be
    */
   if (props.limit.limit > props.limit.polled && props.limit.exceeded > 0) {
      props.limit.polled += props.limit.exceeded;
      props.limit.exceeded = 0;
   }
   if (props.limit.polled > props.limit.limit) {
      props.limit.exceeded += props.limit.polled - props.limit.limit;
      props.limit.polled = props.limit.limit;
   }

   return (
      <Flex
         p={3}
         my={1}
         gap={2}
         borderRadius={'md'}
         backgroundColor={'rgb(249 250 251)'}
         flexDir={'column'}
      >
         <Flex>
            <Tooltip label={props.limit.description}>
               <Text mr={2}>{props.limit.title}</Text>
            </Tooltip>
            {props.limit.exceeded ? <Tag variant="danger">Exceeded</Tag> : null}
            <Spacer />
            <Text fontSize={'xs'}>
               {props.limit.polled} / {props.limit.limit} {disabled ? `(${disabled} disabled)` : ''}{' '}
               {props.limit.exceeded ? `(${props.limit.exceeded} exceeded)` : ''}
            </Text>
         </Flex>
         <Progress
            colorScheme={
               props.limit.exceeded
                  ? 'red'
                  : props.limit.polled > 0.75 * props.limit.limit
                  ? 'orange'
                  : 'blue'
            }
            value={props.limit.polled}
            max={props.limit.limit}
            size={'sm'}
            borderRadius={'md'}
         />
      </Flex>
   );
};
