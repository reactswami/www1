/**
 * Define your production environement variables
 */
import { type Environment } from '~/types';

const endpoints: Environment['endpoints'] = {
   runPingDiscovery: (oa: string, ipScanRange: string, isDryRun = true) =>
      `/cgi/oa-ping-discover-client?oa=${oa}${ipScanRange}&dryrun=${
         isDryRun ? 'true' : 'false'
      }`,
   fetchOaWithPingServiceEnabled: '/cgi/oa_api_proxy',
   updateIpRanges: '/cgi/oa_api_proxy',
};

export const environment: Environment = {
   production: true,
   env: 'production',
   endpoints,
};
