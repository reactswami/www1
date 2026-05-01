import {
   type DefaultBodyType,
   HttpResponse,
   type StrictRequest
} from 'msw';
import { db } from '../db';

export async function getEquipment(req: StrictRequest<DefaultBodyType>) {
   const url = new URL(req.url);
   const search = url.searchParams.get('search');
   const airportId = url.searchParams.get('airportId');

   let equipments = db.equipment.findMany({});
   if (search) {
      const query = Array.isArray(search) ? { contains: search[0] } : { contains: search };
      equipments = db.equipment.findMany({
         where: {
            name: {
               ...query,
            },
         },
      });
   }

   if (airportId !== null) {
      equipments = db.equipment.findMany({
         where: {
            airportId: {
               equals: Number(airportId),
            },
         },
      });
   }

   return HttpResponse.json(
      { meta: {}, result: equipments, success: true },
      {
         status: 200,
      }
   );
}

export async function addDeviceEquipment(body: any) {
   const airport = db.airport.findFirst({
      where: {
         id: {
            equals: body.airportId,
         },
      },
   });

   const terminal = db.terminal.findFirst({
      where: {
         id: {
            equals: body.terminalId,
         },
      },
   });

   const screeningPoint = db.screeningPoint.findFirst({
      where: {
         id: {
            equals: body.screeningPointId,
         },
      },
   });

   const lane = db.lane.findFirst({
      where: {
         id: {
            equals: body.laneId,
         },
      },
   });

   db.equipment.create({
      ...body,
      airportId: airport?.id,
      airportTitle: airport?.title,
      terminalId: terminal?.id,
      terminalTitle: terminal?.title,
      screeningPointId: screeningPoint?.id,
      screeningPointTitle: screeningPoint?.title,
      laneId: lane?.id,
      laneTitle: lane?.title,
   });

   return HttpResponse.json(
      { meta: {}, result: db.equipment.getAll(), success: true },
      { status: 200 }
   );
}
