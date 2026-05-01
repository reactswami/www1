import { type ApiObject } from '@statseeker/api/internal_api';
import { http, HttpResponse, type PathParams } from 'msw';
import { getAllPingPollersMock, getOasMock } from '../mocks';

export const globalHandlers = [
   /**
    * Set up your mock handlers here.
    * These are provided for example only.
    * For more information, check out @mswjs library.
    *
    * 🚨 Make sure to mock your server as close to reality as possible, this will save you a lot of time down the track.
    */

   http.post<PathParams, ApiObject & { command: 'get' }, undefined, 'cgi/internal_api'>(
      'cgi/internal_api',
      async ({ request }) => {
         const requestBody = await request.json();

         switch (requestBody.object_type) {
            case 'ping':
               return HttpResponse.json(getAllPingPollersMock());
            case 'oa_component_service':
               return HttpResponse.json(getOasMock());
            case 'group':
               return HttpResponse.json({
                  success: true,
                  errcode: 0,
                  errmsg: 'ok',
                  time: 1724299421,
                  sequence: 1,
                  data_total: 0,
                  data: [],
                  describe: null,
               });
            default:
               return HttpResponse.json(getAllPingPollersMock());
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
   // rest.post(routes.TEST_CONNECTION, (_, res, ctx) => {
   //    return res(ctx.status(400));
   // }),
   // rest.get(routes.GET_GLOBAL_CONFIG, (_, res, ctx) => {
   //    return res(ctx.status(400));
   // }),
   // rest.post(routes.UPDATE_GLOBAL_CONFIG, (_, res, ctx) => {
   //    return res(ctx.status(400));
   // }),
   // rest.post(routes.GET_ORGANISATIONS, (_, res, ctx) => {
   //    return res(ctx.status(400));
   // }),
   // rest.post(routes.GET_NETWORKS, (_, res, ctx) => {
   //    return res(ctx.status(400));
   // }),
];
