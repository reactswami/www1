/**
 * Define your production environement variables
 * This file can be replaced during build by using the `fileReplacements` array.
 * When building for production, this file is replaced with `environment.prod.ts`.
 */

import { type Environment } from '~/types';

const endpoints: Environment['endpoints'] = {
   fetchAllGroups: '/api_test/latest/group?fields=name,id',
   fetchAllOas:
      '/api_test/latest/device_oa?fields=id,name,status,uptime,hostname,device.ipaddress,version',
   fetchOa: (id: string) =>
      `/api_test/latest/device_oa?fields=id,name,status,uptime,hostname,device.ipaddress,version&id_filter=${id}`,
   createOa: '/cgi/oa_manager',
   deleteOa: '/api/latest/device_oa/',
   rebootOa: '/reboot',
   fetchOaRows: '/api/latest/1',
   fetchOrphanDevicesPingedOnlyByOa: '/api/latest/orphan',
   fetchOaWithPingServiceEnabled: '/api/latest/4',
   fetchOaServices: '/api/latest/5',
   updateOa: '/api/latest/6',
   updateOaComponents: '/api/latest/6',
};

export const environment: Environment = {
   production: true,
   env: 'staging',
   endpoints: endpoints,
};
