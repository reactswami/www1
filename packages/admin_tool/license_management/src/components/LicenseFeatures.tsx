import { type APILicenseFeature } from '@statseeker/api/internal_api/entities/license/type';
import { Flex } from '@statseeker/components/Layout/Flex';
import { Heading } from '@statseeker/components/Typography/Heading';
import { LicenseFeatureItem } from './LicenseFeatureItem';

interface LicenseFeaturesProps {
   features: APILicenseFeature[];
}

export const LicenseFeatures = (props: LicenseFeaturesProps) => {
   return (
      <Flex flexDir={'column'} flex={1}>
         <Heading size="md">Features</Heading>
         <Flex py={3} flexDir={'column'}>
            {props.features.map(
               (feature) =>
                  (feature.visibility === 'visible' ||
                     (feature.visibility === 'conditional' && feature.enabled)) && (
                     <LicenseFeatureItem
                        key={feature.name}
                        title={feature.title}
                        description={feature.description}
                        enabled={feature.enabled}
                        licenced={feature.licenced}
                        expiration={
                           feature.not_after ? new Date(feature.not_after * 1000) : undefined
                        }
                     />
                  )
            )}
         </Flex>
      </Flex>
   );
};
