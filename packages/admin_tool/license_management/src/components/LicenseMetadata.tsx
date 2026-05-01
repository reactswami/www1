import { type APILicense } from '@statseeker/api/internal_api/entities/license/type';
import { Flex } from '@statseeker/components/Layout/Flex';
import { LicenseMetadataItem } from './LicenseMetadataItem';

interface LicenseMetadataProps {
   license: APILicense;
}

export const LicenseMetadata = (props: LicenseMetadataProps) => {
   const expiryDate = props.license.not_after ? new Date(props.license.not_after * 1000) : null;

   return (
      <Flex gap={6} justifyContent={'space-between'} className="license-responsive">
         <LicenseMetadataItem label={'Version'} value={props.license.version} />
         <LicenseMetadataItem
            label={'Server ID'}
            value={props.license.server_id}
            copy={!!props.license.server_id}
         />
         <LicenseMetadataItem label={'Hardware ID'} value={props.license.hardware_id.split(',')} copy />
         <LicenseMetadataItem label={'License Type'} value={props.license.tier} />
         {!props.license.perpetual && (
            <LicenseMetadataItem
               label={'Expires'}
               value={expiryDate && expiryDate.toLocaleDateString()}
               title={expiryDate ? `Expires on ${expiryDate.toString()}` : undefined}
            />
         )}
      </Flex>
   );
};
