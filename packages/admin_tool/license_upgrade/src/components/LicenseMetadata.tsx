import { Flex } from '@statseeker/components/Layout/Flex';
import { LicenseMetadataItem } from './LicenseMetadataItem';
import { type LicenseResponse } from '~/api';

interface LicenseMetadataProps {
   license: LicenseResponse;
}

export const LicenseMetadata = (props: LicenseMetadataProps) => {
   const expiryDate = props.license.result.not_after
      ? new Date(props.license.result.not_after * 1000)
      : null;

   return (
      <Flex gap={6} justifyContent={'space-between'} className="license-responsive">
         <LicenseMetadataItem label={'Current Version'} value={props.license.result.version} />
         <LicenseMetadataItem
            label={'Server ID'}
            value={props.license.result.server_id}
            copy={!!props.license.result.server_id}
         />
         <LicenseMetadataItem label={'Hardware ID'} value={props.license.result.hardware_id.split(',')} copy />
         <LicenseMetadataItem label={'License Type'} value={props.license.result.tier} />
         {!props.license.result.perpetual && (
            <LicenseMetadataItem
               label={'Expires'}
               value={expiryDate && expiryDate.toLocaleDateString()}
               title={expiryDate ? `Expires on ${expiryDate.toString()}` : undefined}
            />
         )}
      </Flex>
   );
};
