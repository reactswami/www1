import { HttpResponse } from 'msw';
import { db } from '../db';

export async function getLanes() {
   return HttpResponse.json({ meta: {}, result: db.lane.getAll(), success: true }, { status: 200 });
}
