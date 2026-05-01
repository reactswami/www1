import { HttpResponse } from 'msw';

export async function getEquipmentType() {
   return HttpResponse.json(
      {
         meta: {
            count: 2,
         },
         result: {
            'Baggage Scanner': {
               CT: ['920'],
               RTT: ['110'],
            },
            Miscellaneous: null,
            'Passenger Scanner': {
               'QPS Bodyscanner': ['201 P1', '201 P2'],
               'Walk-Through Metal Detector': ['900M'],
            },
            Workstation: {
               'PVS Workstation': null,
               'RTT Workstation': null,
               'SVS Workstation': null,
            },
         },
         success: 'true',
      },
      { status: 200 }
   );
}
