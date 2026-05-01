import { faker } from '@faker-js/faker';
import { HttpResponse, type PathParams, delay, http } from 'msw';
import { db } from '../db';
import { routes } from '~/api/routes';
import { type APIGlobalSchema } from '~/types/api';

const isStaging = import.meta.env.MODE !== 'production';

const delayResponse = () => delay(isStaging ? Math.random() * 2000 : 0);

export const globalHandlers = [
   http.post(routes.TEST_CONNECTION, () => {
      delay(isStaging ? Math.random() * 2000 : 0);
      return HttpResponse.json(
         {
            networks: db.network.getAll(),
            organizations: db.organization.getAll(),
            organization_count: db.organization.getAll().length,
         },
         { status: 200 }
      );
   }),
   http.get(routes.GET_GLOBAL_CONFIG, async () => {
      // @ts-ignore
      const response: APIGlobalSchema = {
         ...db.config.getAll()[0],
      };
      await delayResponse();
      return HttpResponse.json(response, {
         status: 200,
      });
   }),
   http.post<PathParams, any>(routes.UPDATE_GLOBAL_CONFIG, async ({ request }) => {
      const data = await request.json();
      const isUpdatingdata = Boolean(data.networks) || Boolean(data.organization); // This a bit of a hack, but if we're updating the network or organization rules, then simply return a positive response ...

      if (isUpdatingdata) {
         await delayResponse();
         return HttpResponse.json(db.config.getAll()[0], { status: 200 });
      }

      const isCreatingRule = Boolean(data.rules);

      if (isCreatingRule) {
         await delayResponse();
         return HttpResponse.json(
            {
               success: true,
               errmsg: 'ok',
               time: 1664152158,
               last_rule_id_added: faker.string.uuid(),
            },
            { status: 200 }
         );
      }

      try {
         await db.config.update({
            where: { id: { equals: 1 } },
            data,
         });
         return HttpResponse.json(db.config.getAll()[0], {
            status: 200,
         });
      } catch (e) {
         await delayResponse();
         return HttpResponse.json(
            {
               error: 'Something went wrong when trying to update the mock database with a new config',
               message: e,
            },
            { status: 400 }
         );
      }
   }),
];

export const failedHandlers = [
   http.post(routes.TEST_CONNECTION, () => {
      return HttpResponse.json(null, { status: 400 });
   }),

   http.get(routes.GET_GLOBAL_CONFIG, () => {
      return HttpResponse.json(null, { status: 400 });
   }),

   http.post(routes.UPDATE_GLOBAL_CONFIG, () => {
      return HttpResponse.json(null, { status: 400 });
   }),
];
