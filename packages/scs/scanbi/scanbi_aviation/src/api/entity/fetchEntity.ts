import { environment } from '~/config/environment';
import { axios } from '~/lib';
import { type FetchEntityResponse } from '~/types/api';
import { MODE } from '~/utils/constants';

const { endpoints } = environment;

export const fetchEntity = async ({
   queryKey,
}: {
   queryKey: string[];
}): Promise<{
   data: FetchEntityResponse;
}> => {
   const endpoint = `${endpoints.entityOperations}?mode=${MODE.GET}&entity_type=${queryKey[0]}`;
   const { data } = await axios.get(endpoint);
   return { data: data.result };
};
