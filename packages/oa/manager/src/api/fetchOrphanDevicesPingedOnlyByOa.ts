import { Queries } from './queries';
import { environment } from '~/config/environment';
import { axios } from '~/lib';

const { endpoints } = environment;

export const fetchOrphanDevicesPingedOnlyByOa = async ({
   oaName,
}: {
   oaName: string;
}) => {
   const { data } = await axios.post<{ data: any[] }>(
      endpoints.fetchOrphanDevicesPingedOnlyByOa,
      Queries.getOrphanDevicesPingedOnlyByOa(oaName)
   );

   return { data: data.data };
};
