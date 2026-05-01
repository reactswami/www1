import { useQuery } from '@tanstack/react-query';
import { fetchEntity } from '~/api/entity';
import { queryKeys } from '~/lib';
import { type FetchEntityResponse } from '~/types/api';
import { type EntityType } from '~/types/models';

export const useFetchEntity = (entity: EntityType) => {
   return useQuery({
      queryKey: queryKeys[entity],
      queryFn: fetchEntity,
      staleTime: Infinity,
      select: (data) => formatDataForTableRow(data.data),
   });
};

const formatDataForTableRow = (rawEntities: FetchEntityResponse) => {
   return rawEntities.map((entity) => ({
      ...entity,
   }));
};
