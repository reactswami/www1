import { environment } from '~/config/environment';
import { axios } from '~/lib';
import { MODE } from '~/utils/constants';

const { endpoints } = environment;

type FetchEntityResponse = {
   meta: {};
   result: any;
   success: boolean;
};

export const fetchEntityById = async ({ queryKeys, id }: { queryKeys: string[]; id: number }) => {
   const endpoint = `${endpoints.entityOperations}?mode=${MODE.GET}&entity_type=${queryKeys[0]}&id=${id}`;
   const { data } = await axios.get<FetchEntityResponse>(endpoint);

   if (data.success && data.result.length > 0) {
      return { success: data.success, result: data.result[0], meta: data.meta };
   }

   return { success: false, result: { msg: 'Entity not found' }, meta: data.meta };
};
