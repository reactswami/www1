import { ApiGetRequest } from '@statseeker/api/internal_api';
import axios from 'axios';

type PollerListItem = {
   id: number;
   name: string;
};

export async function getPollersList() {
   return new ApiGetRequest<PollerListItem>({
      object_type: 'oa_component_service',
      fields: [
         {
            name: 'enabled',
            hide: true,
         },
         {
            hide: true,
            key: 'component',
            name: 'name',
            object: 'oa_component',
         },
         {
            hide: true,
            key: 'service',
            name: 'name',
            object: 'oa_service',
            links: ['componentLink', 'serviceLink'],
         },
         {
            name: 'name',
            object: 'device_oa',
         },
         'id',
      ],
      filter: "{service} = 'ping' AND {enabled} = 1 AND {component} = 'collector'",
   }).run_api_request();
}

export interface UpdatePingPollerPayload {
   devices?: number[];
   pollers: string[]; //needs to be pollers
   default_poller?: string;
   use_filters?: 0 | 1;
   search_query?: string;
   post_filter?: string;
   group_filter?: number;
}

export const updatePingPoller = (payload: UpdatePingPollerPayload) => {
   return axios.post('/cgi/rps_device_manage', payload);
};
