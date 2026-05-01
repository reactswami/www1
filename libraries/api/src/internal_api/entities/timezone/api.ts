import { ApiGetRequest, api_get } from '../../api-request';
import { type Timezone } from './index';


export async function getTimezones() {
   return api_get(
      new ApiGetRequest<Timezone>({
         fields: [
            'name',
            'enabled',
         ],
         object_type: 'timezone'
      })
   );
}
