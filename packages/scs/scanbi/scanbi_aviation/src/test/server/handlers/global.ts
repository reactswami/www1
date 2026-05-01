import { HttpResponse } from 'msw';
import { db } from '../db';

export async function getAllEntities() {
   return HttpResponse.json(
      {
         meta: {},
         result: {
            airport: db.airport.getAll(),
            terminal: db.terminal.getAll(),
            screening_point: db.screeningPoint.getAll(),
            lane: db.lane.getAll(),
            device_equipment: db.equipment.getAll(),
            location_category: ['Front of House', 'Back of House'],
            equipment_type: {
               Miscellaneous: null,
               'Passenger Scanner': {
                  Bodyscanner: ['201 QPS'],
                  'Walk-Through Metal Detector': ['900M', '6E'],
               },
               'Baggage Scanner': {
                  RTT110: [],
               },
               Workstation: { 'RTT Workstation': null },
            },
         },
         success: true,
      },
      { status: 200 }
   );
}
