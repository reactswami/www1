import axios from 'axios';
import { environment } from '~/config/environment';
import { type DeviceOa } from '~/types/models';

const { endpoints } = environment;

export type CreateOaPayload = Pick<
   DeviceOa,
   | 'manual_name'
   | 'hostname'
   | 'ipaddress'
   | 'netmask'
   | 'gateway'
   | 'timeout'
   | 'region'
   | 'site'
   | 'location'
   | 'ipv6address'
   | 'ipv6gateway'
   | 'ipv6prefix'
> & {
   latitude: number;
   longitude: number;
};

export const createOa = (newOa: CreateOaPayload) => {
   const data = new URLSearchParams();
   for (const [key, value] of Object.entries(newOa)) {
      data.append(key, value.toString().trim());
   }
   data.append('mode', 'add'); // As required by the API specification
   return axios.post(endpoints.createOa, data);
};
