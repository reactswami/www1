import { HttpResponse, type Path, type PathParams, http } from 'msw';
import { db } from '../db';
import { environment } from '~/config';
import { createAPIError, createAPIResponse, stripUrlParameters } from '~/test/utils';
import { type DeviceOa } from '~/types/models';

const { endpoints } = environment;

export const oaHandlers = [
   /**
    * Set up your mock handlers here.
    * These are provided for example only.
    * For more information, check out @mswjs library.
    *
    * 🚨 Make sure to mock your server as close to reality as possible, this will save you a lot of time down the track.
    */
   http.get(stripUrlParameters(endpoints.fetchAllOas), async ({ request }) => {
      const regexpId = request.url?.search(/id_filter=(.*)/);
      if (regexpId) {
         try {
            const id = regexpId;
            let oa = await db.device_oa.findFirst({
               where: { id: { equals: id.toString() } },
            });
            if (!oa) {
               oa = await db.device_oa.create({ id: id.toString() });
            }
            return HttpResponse.json(createAPIResponse({ data: [oa] }), { status: 200 });
         } catch (e) {
            return HttpResponse.json(e as string, { status: 400 });
         }
      }
      return HttpResponse.json(
         createAPIResponse({
            data: db.device_oa.findMany({
               where: { type: { equals: 'Oa' } },
            }),
         }),
         { status: 200 }
      );
   }),
   http.post(stripUrlParameters(endpoints.fetchOaRows), () => {
      return HttpResponse.json(
         createAPIResponse({
            data: db.device_oa.findMany({
               where: { type: { equals: 'Oa' } },
            }),
         }),
         { status: 200 }
      );
   }),
   http.post<PathParams, DeviceOa, undefined, Path>(
      stripUrlParameters(endpoints.createOa),
      async ({ request }) => {
         try {
            const body = await request.json();
            if (body.id) {
               return await updateDeviceOa(body);
            }
            return await createNewOa(body);
         } catch (e) {
            return HttpResponse.json(e as string, { status: 400 });
         }
      }
   ),
   http.post(stripUrlParameters(endpoints.fetchOaServices), async ({ request }) => {
      const mockResponse = {
         data: mockComponentsResponse,
      };

      try {
         return HttpResponse.json(createAPIResponse(mockResponse), { status: 200 });
      } catch (e) {
         return HttpResponse.json(e as string, { status: 400 });
      }
   }),
   // We use fetch All Oas since it is the 'root' of the url
   http.delete(stripUrlParameters(endpoints.deleteOa), async ({ request }) => {
      try {
         const url = new URL(request.url);
         const regexpId = url.pathname.match(/device_oa\/(.*)/);
         if (!regexpId) {
            throw Error('Unable to extract the id of the Oa from the url');
         }
         const id = regexpId[1] as string;
         const oa = await db.device_oa.findFirst({
            where: { id: { equals: id as string } },
         });
         if (!oa) {
            throw Error('Unable to find the Oa');
         }
         db.device_oa.delete({ where: { id: { equals: id } } });
         return HttpResponse.json(null, { status: 201 });
      } catch (e) {
         return HttpResponse.json(e as string, { status: 400 });
      }
   }),
   http.post(stripUrlParameters(endpoints.rebootOa), () => {
      return HttpResponse.json(null, { status: 200 });
   }),
];

/**
 * Failed handlers
 * Very useful for testing, since you can quickly replace existing handlers with fail calls to test your code
 *
 * `server.use(...failedHandlers);`
 */
export const failedOaHandlers = [
   http.get('*', () => {
      return HttpResponse.json(createAPIError(), { status: 400 });
   }),
   http.post('*', () => {
      return HttpResponse.json(createAPIError(), { status: 400 });
   }),
];

/**
 * Empty handlers
 * Very useful for testing, since you can quickly replace existing handlers with empty response calls to test your code
 *
 * `server.use(...failedHandlers);`
 */
export const emptyOaHandlers = [
   http.get(stripUrlParameters(endpoints.fetchAllOas), () => {
      return HttpResponse.json(createAPIResponse({ data: [] }), { status: 200 });
   }),
   http.post(stripUrlParameters(endpoints.fetchOaRows), () => {
      return HttpResponse.json(createAPIResponse({ data: [] }), { status: 200 });
   }),
   http.post(endpoints.fetchOrphanDevicesPingedOnlyByOa, () => {
      return HttpResponse.json(createAPIResponse({ data: [] }), { status: 200 });
   }),
];

async function createNewOa(body: any) {
   const newOa = db.device_oa.create({
      gateway: body.defaultGateway,
      hostname: body.hostname,
      ipaddress: body.ipAddress,
      latitude: body.latitude,
      longitude: body.longitude,
      netmask: body.netmask,
      timeout: body.timeout,
      name: body.title,
      site: body.site,
      region: body.region,
   });
   return HttpResponse.json(createAPIResponse({ data: [newOa] }), { status: 200 });
}

async function updateDeviceOa(body: any) {
   try {
      const oa = await db.device_oa.update({
         where: { id: { equals: body.id } },
         data: body,
      });
      return HttpResponse.json(oa, { status: 200 });
   } catch (e) {
      return HttpResponse.json(e as string, { status: 500 });
   }
}

export const mockComponentsResponse = [
   {
      id: '6',
      serviceDescription:
         'This service provides the ability to monitor local network traffic and receive NetFlow data.',
      name: 'collector',
      enabled: 0,
      visible: 1,
      description: 'Enable ltm-client service',
      serviceName: 'ltm',
   },
   {
      id: '9',
      serviceDescription:
         'This service provides the ability to perform ping-only device discoveries and enables ping polling for configured devices.',
      name: 'collector',
      enabled: 1,
      visible: 1,
      serviceName: 'ping',
      description: 'Enable ping service',
   },
];
