import { environment } from '~/config/environment';
import { axios } from '~/lib';
import { MODE } from '~/utils/constants';

const { endpoints } = environment;

export const fetchEquipmentType = async ({ queryKey }: {queryKey: string[]}) => {
   const endpoint = `${endpoints.entityOperations}?mode=${MODE.GET}&entity_type=${queryKey[0]}`;
   const { data } = await axios.get(endpoint);
   return { data: data.result };
};
