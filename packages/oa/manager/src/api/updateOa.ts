import axios from 'axios';
import { Queries } from './queries';
import { environment } from '~/config/environment';
import { type DeviceOa } from '~/types/models';

const { endpoints } = environment;
export type Component = {
   id: string;
   enabled: 1 | 0;
};

export type UpdateOaPayload = Partial<
   Pick<
      DeviceOa,
      | 'hostname'
      | 'name'
      | 'ipaddress'
      | 'netmask'
      | 'gateway'
      | 'timeout'
      | 'region'
      | 'site'
      | 'poll'
      | 'location'
      | 'ipv6address'
      | 'ipv6gateway'
      | 'ipv6prefix'
   > &
   Required<Pick<DeviceOa, 'name'>> & {
      latitude: number | string;
      longitude: number | string;
      dirtyFields: boolean;
   }
>;

export type UpdateOaResponse = { message: string; status: 'ERROR' | 'SUCCESS' };

export const updateOa = (
   updatedOa: UpdateOaPayload
) => {
   const data = new URLSearchParams();
   for (const [key, value] of Object.entries(updatedOa)) {
      if (value) {
         data.append(key, value.toString().trim());
      }
   }
   data.append('mode', 'update'); // As required by the API specification
   return axios.post(endpoints.updateOa, data);
};

export const toggleComponentService = (oaId: string, component: Component[]) =>
   axios.post(
      endpoints.updateOaComponents,
      Queries.updateOaComponents(oaId, component)
   );
