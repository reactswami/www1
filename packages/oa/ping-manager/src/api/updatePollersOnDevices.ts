import axios from 'axios';
import { environment } from '~/config/environment';

const { endpoints } = environment;

export interface UpdatePingPollerPayload {
   devices?: number[];
   pollers: string[];
   default_poller?: string;
   use_filters: 0 | 1;
   search_query?: string;
   group_filter?: number;
}

export const updatePingPoller = (payload: UpdatePingPollerPayload) => {
   return axios.post(endpoints.savePingPollingConfiguration, payload);
};
