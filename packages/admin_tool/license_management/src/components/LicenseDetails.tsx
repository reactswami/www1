import { type APILicenseFeature } from '@statseeker/api/internal_api/entities/license/type';
import { Flex } from '@statseeker/components/Layout/Flex';
import { LicenseFeatures } from './LicenseFeatures';
import { LicenseLimits } from './LicenseLimits';

interface LicenseDetailsProps {
   features: APILicenseFeature[];
}

export const LicenseDetails = (props: LicenseDetailsProps) => {
   const featuresToShow = props.features.filter(
      (feature) =>
         !('visibility' in feature) ||
         feature.visibility === 'visible' ||
         (feature.visibility === 'conditional' && feature.enabled)
   );
   const limits = props.features
      .filter((f) => f.limits)
      .map((f) => f.limits)
      .filter((l) => !!l)
      .flat()
      .filter(
         (l) =>
            !('visibility' in l) ||
            l.visibility === 'visible' ||
            (l.visibility === 'conditional' && (l.limit > 0 || l.total > 0))
      );

   return (
      <Flex gap={8} className="license-responsive">
         <LicenseFeatures features={featuresToShow} />
         <LicenseLimits limits={limits} />
      </Flex>
   );
};
