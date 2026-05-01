/**
 * Define your production environement variables
 * This file can be replaced during build by using the `fileReplacements` array.
 * When building for production, this file is replaced with `environment.prod.ts`.
 */

import { type Environment } from '~/types';

const endpoints: Environment['endpoints'] = {
   runPingDiscovery: (oa: string, ipScanRange: string, isDryRun = true) =>
      `/cgi/oa-ping-discover-client?oa=${oa}${ipScanRange}&dryrun=${
         isDryRun ? 'true' : 'false'
      }`,
   fetchOaWithPingServiceEnabled: '/api/latest',
   updateIpRanges: '/api/latest',
};

export const environment: Environment = {
   production: true,
   env: 'staging',
   endpoints,
};
