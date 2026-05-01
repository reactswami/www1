/**
 * Define your production environement variables
 */
import { type Environment } from '~/types';

const endpoints: Environment['endpoints'] = {
   runPingDiscovery: (oa: string, ipScanRange: string, isDryRun = true) =>
      `/cgi/oa-ping-discover-client?oa=${oa}&range=[${ipScanRange
         .split('&range=')
         .map((range) => `"${range}"`)}]&dryrun=${isDryRun ? 1 : 0}`,
   fetchOaWithPingServiceEnabled: '/api/latest/4',
   updateIpRanges: '/api/latest/5',
};

export const environment: Environment = {
   production: true,
   env: 'test',
   endpoints,
};
