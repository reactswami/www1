import Axios, { type AxiosResponse } from 'axios';

import { environment } from 'packages/oa/ping-discover/src/config';

export const axios = Axios.create({
   baseURL: environment.apiBase,
});

axios.interceptors.response.use(onFullfilled);

// For convenience, we're unwrapping the API result.
function onFullfilled<T>(res: AxiosResponse<APIResponse<T>>): AxiosResponse {
   const data = res.data.data.objects[0];
   return { ...res, data };
}

export interface APIResponse<T = unknown> {
   version: string;
   revision: string;
   info: string;
   data: {
      success: boolean;
      errmsg: string;
      time: number;
      objects: [ApiObject<T>];
   };
   links: Link[];
}

type ApiObject<T> = {
   type: string;
   sequence: number;
   status: {
      success: boolean;
      errcode: number;
   };
   data_total: number;
   data: T[];
};

type Link = {
   link: string;
   rel: string;
};
