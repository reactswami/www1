import { HttpResponse } from 'msw';
import { db } from '../db';

export async function getScreeningPoints() {
   return HttpResponse.json(
      { meta: {}, result: db.screeningPoint.getAll(), success: true, test: true },
      { status: 200 }
   );
}
