import axios from 'axios';
import { environment } from '~/config/environment';

const { endpoints } = environment;

export const rebootOa = ({ name }: { name: string }) => {
   const data = new URLSearchParams();
   data.append('name', name);
   data.append('mode', 'reboot');
   return axios.post(endpoints.rebootOa, data);
};
