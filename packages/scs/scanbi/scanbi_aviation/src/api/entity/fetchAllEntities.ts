import { environment } from '~/config/environment';
import { axios } from '~/lib';
import { type FetchAllEntitiesResponse } from '~/types/api';
import { MODE } from '~/utils/constants';

const { endpoints } = environment;

export const fetchAllEntities = async () => {
   const endpoint = `${endpoints.entityOperations}?mode=${MODE.GET}&entity_type=all`;
   const { data } = await axios.get<FetchAllEntitiesResponse>(endpoint);
   return { data: data.result };
};
