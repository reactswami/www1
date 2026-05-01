import { HttpResponse, http } from 'msw';
import { db } from '../db';
import { environment } from '~/config/environment';

const { endpoints } = environment;

export const airportHandlers = [
   /**
    * Set up your mock handlers here.
    * These are provided for example only.
    * For more information, check out @mswjs library.
    */
   http.get(`${endpoints.entityOperations}?mode=get&entity_type=airport`, async ({ request }) => {
      return HttpResponse.json(
         { meta: {}, result: db.airport.getAll(), success: true, test: true },
         { status: 200 }
      );
   }),
];

export async function getAirports() {
   return HttpResponse.json(
      { meta: {}, result: db.airport.getAll(), success: true, test: true },
      { status: 200 }
   );
}

export async function createAiport(body: any) {
   const airportExists = db.airport.findFirst({
      where: {
         title: {
            equals: body.title,
         },
      },
   });

   if (airportExists) {
      return HttpResponse.json(
         {
            meta: {},
            result: {
               msg: `Terminal already exists with title of ${body.title} at Airport`,
               state: 'error',
            },
            success: false,
         },
         { status: 500 }
      );
   }

   const airport = db.airport.create({
      ...body,
   });

   return HttpResponse.json({ meta: {}, result: airport.id, success: true }, { status: 200 });
}
