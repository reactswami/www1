import { Flex } from '@statseeker/components/Layout/Flex';
import { Spacer } from '@statseeker/components/Layout/Spacer';
import { Heading } from '@statseeker/components/Typography/Heading';
import { type ReactNode } from 'react';

interface LicenseContentHeaderProps {
   heading: string;
   actions?: ReactNode;
}

export const LicenseContentHeader = (props: LicenseContentHeaderProps) => {
   return (
      <Flex>
         <Heading size="md">{props.heading}</Heading>
         <Spacer />
         {props.actions}
      </Flex>
   );
};
