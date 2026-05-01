import { HttpResponse } from 'msw';

export async function getLocationCategory() {
   return HttpResponse.json(
      {
         meta: {
            count: 2,
         },
         result: ['Front of House', 'Back of House'],
         success: 'true',
      },
      { status: 200 }
   );
}
