/**
 * Define your production environement variables
 */
import { type Environment } from '~/types';

export const endpoints: Environment['endpoints'] = {
   fetchAllGroups: '/cgi/oa_api_proxy?type=group&fields=name,id',
   fetchAllOas:
      '/cgi/oa_api_proxy?type=device_oa&fields=id,name,status,uptime,hostname,gateway,device.ipaddress,version,ipv6address,ipv6prefix,ipv6gateway',
   fetchOa: (id: string) =>
      `/cgi/oa_api_proxy?type=device_oa&fields=id,name,status,uptime,hostname,device.ipaddress,ipv6address,ipv6prefix,ipv6gateway,version,timeout,poll&id_filter=${encodeURIComponent(
         `=${id}`
      )}`,
   createOa: '/cgi/manage_oa',
   deleteOa: '/cgi/oa_api_proxy',
   updateOa: '/cgi/manage_oa',
   rebootOa: '/cgi/manage_oa',
   fetchOrphanDevicesPingedOnlyByOa: '/cgi/oa_api_proxy',
   updateOaComponents: '/cgi/oa_api_proxy',
   fetchOaRows: '/cgi/oa_api_proxy',
   fetchOaWithPingServiceEnabled: '/cgi/oa_api_proxy',
   fetchOaServices: '/cgi/oa_api_proxy',
};


export const environment: Environment = {
   production: true,
   env: 'production',
   endpoints,
};
