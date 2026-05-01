import { HttpResponse, http } from 'msw';
import { db } from '../db';

export const globalHandlers = [
   /**
    * Set up your mock handlers here.
    * These are provided for example only.
    * For more information, check out @mswjs library.
    *
    * 🚨 Make sure to mock your server as close to reality as possible, this will save you a lot of time down the track.
    */
   // http.post(routes.TEST_CONNECTION, () => {
   //    return HttpResponse.json(
   //       {
   //          networks: db.network.getAll(),
   //          organisations: db.organisation.getAll(),
   //       },
   //       { status: 200 }
   //    );
   // }),
   // http.get(routes.GET_GLOBAL_CONFIG, () => {
   //    const response: APIGlobalSchema = {
   //       ...db.config.getAll()[0],
   //       organisations: db.organisation.getAll() as Organisation[],
   //       networks: db.network.getAll() as Network[],
   //    };
   //    return HttpResponse.json(response, { status: 200 });
   // }),
   // http.post(routes.UPDATE_GLOBAL_CONFIG, async ({ request }) => {
   //    try {
   //       const data = await request.json();
   //       await db.config.update({
   //          where: { id: { equals: 1 } },
   //          data,
   //       });
   //       return HttpResponse.json(db.config.getAll()[0], {
   //          status: 200,
   //       });
   //    } catch (e) {
   //       return HttpResponse.json(
   //          {
   //             error: 'Something went wrong when trying to update the mock database with a new config',
   //          },
   //          { status: 400 }
   //       );
   //    }
   // }),
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
