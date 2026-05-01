import { faker } from '@faker-js/faker';
import { HttpResponse, http } from 'msw';
import { type FetchOAsResponse } from '~/api';
import { environment } from '~/config/environment';
import { createAPIResponse } from '~/test/utils';

const createFakeOa = (): FetchOAsResponse => ({
   services: 'ping',
   cfg: faker.lorem.words(3),
   componentId: faker.number.int().toString(),
   deviceId: faker.number.int().toString(),
   id: faker.string.uuid(),
   status: faker.helpers.arrayElement(['up', 'down', 'unknown']),
   timeout: faker.number.int({ min: 0, max: 10 }),
   uptime: faker.number.int(8),
   version: faker.system.semver(),
   poll: faker.helpers.arrayElement(['on', 'off']),
   name: faker.person.fullName(),
   hostname: faker.internet.domainName(),
   ipaddress: faker.internet.ipv4(),
   netmask: faker.internet.ipv4(),
   gateway: faker.internet.ipv4(),
   region: faker.location.state(),
   site: faker.company.name(),
   latitude: Number(faker.location.latitude()),
   longitude: Number(faker.location.longitude().toString()),
});

export const fetchOasWithPingServiceMockResponse = Array.from({ length: 20 }, createFakeOa);

export const oaHandlers = [
   http.post(environment.endpoints.fetchOaWithPingServiceEnabled, () => {
      const response = createAPIResponse({
         data: fetchOasWithPingServiceMockResponse,
      });
      return HttpResponse.json(response, { status: 200 });
   }),

   http.post(environment.endpoints.updateIpRanges, () => HttpResponse.json(null, { status: 200 })),
];

/**
 * Failed handlers
 * Very useful for testing, since you can quickly replace existing handlers with fail calls to test your code
 *
 * `server.use(...failedHandlers);`
 */
export const failedHandlers = [
   http.post(environment.endpoints.fetchOaWithPingServiceEnabled, () => {
      return HttpResponse.json({ isError: true }, { status: 400 });
   }),
   http.post(environment.endpoints.updateIpRanges, () => {
      return HttpResponse.json({ isError: true }, { status: 400 });
   }),
];
