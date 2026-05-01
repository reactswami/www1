import { Queries } from 'packages/oa/ping-discover/src/api';
import { environment } from 'packages/oa/ping-discover/src/config/environment';
import { axios } from 'packages/oa/ping-discover/src/lib';
import { type DeviceOa } from 'packages/oa/ping-discover/src/types';

const { endpoints } = environment;

export type Cfg = string;

export interface FetchOAsResponse extends DeviceOa {
   services: string;
   cfg: Cfg;
   componentId: string;
   deviceId: string;
}

export const fetchOasWithPingService = async (): Promise<{
   data: FetchOAsResponse[];
}> => {
   const { data } = await axios.post<{ data: FetchOAsResponse[] }>(
      endpoints.fetchOaWithPingServiceEnabled,
      Queries.getOAsWithPingService
   );

   return data;
};
