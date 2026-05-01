import { Queries } from './queries';
import { environment } from '~/config/environment';
import { axios } from '~/lib';

export interface OaComponent {
   id:                 number;
   name:               string;
   enabled:            number;
   description:        string;
   serviceName:        string;
   serviceDescription: string;
}

const { endpoints } = environment;

export const fetchServicesForOa = async (id: string) => {
   const { data } = await axios.post<{ data: OaComponent[] }>(
      endpoints.fetchOaServices,
      Queries.getAvailableServiceForOa(id)
   );

   return { data: data.data };
};
