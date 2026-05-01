import Axios from 'axios';

import { environment } from '~/config';

export const axios = Axios.create({
   baseURL: environment.apiBase,
});

// axios.interceptors.response.use(onFullfilled);

// // For convenience, we're unwrapping the API result.
// function onFullfilled<T>(res: AxiosResponse<APIResponse<T>>): AxiosResponse {
//    const data = res.data.data.objects[0];
//    return { ...res, data };
// }
