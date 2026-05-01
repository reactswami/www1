import { type APILicense } from '@statseeker/api/internal_api/entities/license/type';
import { Flex } from '@statseeker/components/Layout/Flex';
import { type ReactNode } from 'react';
import { LicenseMetadata, LicenseContentHeader, LicenseDetails } from '~/components';

interface LicenseContentProps {
   heading: string;
   actions?: ReactNode;
   license?: APILicense;
}

export const LicenseContent = (props: LicenseContentProps) => {
   return (
      <Flex flexDir={'column'} gap={8} className="license-responsive-container">
         <LicenseContentHeader
            heading={props.heading}
            actions={props.actions}
         />
         {props.license ? (
            <LicenseMetadata license={props.license} />
         ) : (
            <Flex justify={'center'}>
               An error occurred while fetching license information. Please try again later, or
               apply a new license by clicking on the "Actions" button above.
            </Flex>
         )}
         {props.license?.licenced && <LicenseDetails features={props.license?.features} />}
      </Flex>
   );
};
