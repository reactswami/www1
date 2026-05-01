import axios from 'axios';
import { type Cfg, Queries } from 'packages/oa/ping-discover/src/api';
import { environment } from 'packages/oa/ping-discover/src/config/environment';

const { endpoints } = environment;

export interface SaveIpRangesPayload {
   cfg: Cfg;
   deviceId: string;
   componentId: string;
}

export const saveIpRanges = async ({
   deviceId,
   componentId,
   cfg,
}: SaveIpRangesPayload) => {
   const { data } = await axios.post(
      endpoints.updateIpRanges,
      Queries.updateCfg({ cfg, deviceId, componentId })
   );

   return data;
};
