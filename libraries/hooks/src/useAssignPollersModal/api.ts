import axios from 'axios';
import { type DeviceOa } from './types';

/* Fetch ping pollers */
export interface FetchOAsWithPingServiceEnabledResponse {
   data: Pick<DeviceOa, 'name' | 'id' | 'poll'>[];
}

const getOAsWithPingServiceEnabledQuery = {
   command: 'get',
   user: 'admin',
   objects: [
      {
         type: 'oa_component_service',
         fields: {
            id: {
               field: 'id',
               object: 'device_oa',
               filter: { query: '> 0' },
            },
            ipaddress: {
               field: 'ipaddress',
               object: 'device_oa',
            },
            name: {
               field: 'name',
               object: 'device_oa',
               aggregation_format: 'list_unique',
            },
            services: {
               hide: true,
               aggregation_format: 'list_unique',
               field: 'name',
               link: ['componentLink', 'serviceLink'],
               object: 'oa_service',
               filter: { query: `REGEXP 'ping'` },
            },
            poll: {
               field: 'poll',
               object: 'device_oa',
               aggregation_format: 'list_unique',
            },
            is_service_enabled: {
               hide: true,
               aggregation_format: 'list',
               field: 'enabled',
               filter: { query: '= 1' },
            },
         },
         group_by: ['{name}'],
      },
   ],
};

export const fetchOAsWithPingServiceEnabled =
   async (): Promise<FetchOAsWithPingServiceEnabledResponse> => {
      const response =
         await axios.post<{data: {objects: [{data: Pick<DeviceOa, 'name' | 'id' | 'poll'>[]}]}}>('/cgi/oa_api_proxy',
            getOAsWithPingServiceEnabledQuery
         );
      return { data: response.data.data.objects[0].data };
   };

/* Update Ping pollers */
export interface UpdatePingPollerPayload {
   devices?: number[];
   pollers: string[];
   default_poller?: string;
   use_filters: 0 | 1;
   search_query?: string;
   post_filter?: string;
   group_filter?: number;
}

export const updatePingPoller = (payload: UpdatePingPollerPayload) => {
   return axios.post('/cgi/rps_device_manage', payload);
};
