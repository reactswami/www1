import { type APILicenseLimit } from '@statseeker/api/internal_api/entities/license/type';
import { Flex } from '@statseeker/components/Layout/Flex';
import { Heading } from '@statseeker/components/Typography/Heading';
import { LicenseLimitItem } from './LicenseLimitItem';

interface LicenceLimitProps {
   limits: APILicenseLimit[];
}

export const LicenseLimits = (props: LicenceLimitProps) => {
   /*
    * We want the device and interface limits to be first to match what
    * customers are used to seeing.
    */
   const interfaceIndex = props.limits.findIndex((f) => f.name === 'port');
   if (interfaceIndex > -1) {
      props.limits.unshift(props.limits.splice(interfaceIndex, 1)[0]);
   }
   const deviceIndex = props.limits.findIndex((f) => f.name === 'device');
   if (deviceIndex > -1) {
      props.limits.unshift(props.limits.splice(deviceIndex, 1)[0]);
   }

   return (
      <Flex flexDir={'column'} flex={1}>
         <Heading size="md">Usage Limits</Heading>
         <Flex py={3} flexDir={'column'}>
            {props.limits.map(
               (limit) =>
                  (limit.visibility === 'visible' ||
                     (limit.visibility === 'conditional' && limit.limit != 0)) && (
                     <LicenseLimitItem key={limit.title} limit={limit} />
                  )
            )}
         </Flex>
      </Flex>
   );
};
