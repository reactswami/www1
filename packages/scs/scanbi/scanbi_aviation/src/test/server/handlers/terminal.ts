import { type DefaultBodyType, HttpResponse, type StrictRequest } from 'msw';
import { db } from '../db';

/**
 * Set up your mock handlers here.
 * These are provided for example only.
 * For more information, check out @mswjs library.
 */
export async function getTerminals(req: StrictRequest<DefaultBodyType>) {
   const url = new URL(req.url);
   const search = url.searchParams.get('search');
   const airportId = url.searchParams.get('airportId');
   const terminalId = url.searchParams.get('id');

   let terminals = db.terminal.findMany({});

   if (terminalId !== null) {
      terminals = db.terminal.findMany({
         where: {
            id: {
               equals: Number(terminalId),
            },
         },
      });
   }

   if (search) {
      const query = Array.isArray(search) ? { contains: search[0] } : { contains: search };
      terminals = db.terminal.findMany({
         where: {
            title: {
               ...query,
            },
         },
      });
   }

   if (airportId !== null) {
      terminals = db.terminal.findMany({
         where: {
            airportId: {
               equals: Number(airportId),
            },
         },
      });
   }

   return HttpResponse.json(
      { meta: {}, result: terminals, success: true },
      {
         status: 200,
      }
   );
}

export async function addTerminals(body: any) {
   const terminalExists = db.terminal.findFirst({
      where: {
         title: {
            equals: body.title,
         },
         airportId: {
            equals: body.airportId,
         },
      },
   });

   if (terminalExists) {
      return HttpResponse.json(
         {
            meta: {},
            result: {
               msg: `Terminal already exists with title of ${body.title} at Airport`,
               state: 'error',
            },
            success: 'false',
         },
         { status: 500 }
      );
   }

   const airport = db.airport.findFirst({
      where: {
         id: {
            equals: body.airportId,
         },
      },
   });

   db.terminal.create({
      airportId: airport?.id,
      airportTitle: airport?.title,
      title: body.title,
   });

   return HttpResponse.json(
      { meta: {}, result: db.terminal.getAll(), success: true },
      {
         status: 200,
      }
   );
}
