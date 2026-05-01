import { getLicenseMock } from '@statseeker/api/internal_api/entities/license/mocks';
import { type ApiObject } from '@statseeker/api/internal_api/types';
import { HttpResponse, http, type PathParams } from 'msw';
import { environment } from '~/config';

export const globalHandlers = [
   http.post<PathParams, ApiObject & { command: 'get' }, undefined, '/cgi/internal_api'>(
      '/cgi/internal_api',
      async ({ request }) => {
         const requestBody = await request.json();

         if (environment.proxy_requests) {
            const proxiedResponse = await fetch(
               `${environment.proxy_requests?.proxy_server}/cgi/internal_api`,
               {
                  method: 'POST',
                  headers: {
                     'Content-Type': 'application/json',
                     'X-Proxy-Host': environment.proxy_requests?.host,
                     'X-Proxy-User': environment.proxy_requests?.user,
                     'X-Proxy-Password': environment.proxy_requests?.password,
                  },
                  body: JSON.stringify(requestBody),
               }
            );

            const data = await proxiedResponse.json();
            return HttpResponse.json(data, {
               status: proxiedResponse.status,
               statusText: proxiedResponse.statusText,
            });
         }

         switch (requestBody.object_type) {
            case 'license': {
               return HttpResponse.json(await getLicenseMock());
            }
            default:
               return HttpResponse.json({
                  success: true,
                  errcode: 0,
                  errmsg: 'ok',
                  time: 1714431052,
                  sequence: 2,
                  data_total: 0,
                  data: [],
                  describe: null,
               });
         }
      }
   ),
];

/**
 * Failed handlers
 * Very useful for testing, since you can quickly replace existing handlers with fail calls to test your code
 *
 * `server.use(...failedHandlers);`
 */
export const failedHandlers = [
   // http.post(routes.TEST_CONNECTION, () => {
   //    return HttpResponse.json({ status: 400 });
   // }),
   // http.get(routes.GET_GLOBAL_CONFIG, () => {
   //    return HttpResponse.json({ status: 400 });
   // }),
   // http.post(routes.UPDATE_GLOBAL_CONFIG, () => {
   //    return HttpResponse.json({ status: 400 });
   // }),
   // http.post(routes.GET_ORGANISATIONS, () => {
   //    return HttpResponse.json({ status: 400 });
   // }),
   // http.post(routes.GET_NETWORKS, () => {
   //    return HttpResponse.json({ status: 400 });
   // }),
];
