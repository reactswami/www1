import { HttpResponse, http, type PathParams } from 'msw';
import { getLicenseMock } from '~/api/mocks';

export const globalHandlers = [
   http.get<PathParams, any, undefined, '/cgi/license_upgrade'>('/cgi/license_upgrade', async () => {
      return HttpResponse.json(await getLicenseMock());
   }),
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
