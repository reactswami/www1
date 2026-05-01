import { faker } from '@faker-js/faker';
import { HttpResponse, http } from 'msw';
import { environment } from '~/config/environment';
import { createAPIResponse, stripUrlParameters } from '~/test/utils';

const { endpoints } = environment;

export const groupsHandler = [
   http.get(stripUrlParameters(endpoints.fetchAllGroups), async () => {
      return HttpResponse.json(
         createAPIResponse({
            data: Array(100)
               .fill(null)
               .map(() => ({
                  name: faker.lorem.word(),
                  id: faker.number.int(),
               })),
         }),
         { status: 200 }
      );
   }),
];
