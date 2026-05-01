import { useQuery } from '@tanstack/react-query';
import { fetchAllEntities } from '~/api/entity/fetchAllEntities';
import { ENTITY_TYPE } from '~/utils/constants';

export const useFetchAllEntities = () => {
   return useQuery({
      queryKey: [ENTITY_TYPE.ALL],
      queryFn: fetchAllEntities,
      staleTime: Infinity,
      select: (data) => data.data,
   });
};
