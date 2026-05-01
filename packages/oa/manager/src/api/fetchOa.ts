import { environment } from '~/config/environment';
import { axios } from '~/lib';
import { type DeviceOa } from '~/types/models';

const { endpoints } = environment;

export type FetchOaPayload = { id: string };
export type FetchOaResponse = DeviceOa;

export const fetchOa = async ({
   id,
}: FetchOaPayload): Promise<FetchOaResponse> => {

   const { data } = await axios.get<{ data: DeviceOa[] }>(
      endpoints.fetchOa(id)
   );
   return data.data[0];
};
