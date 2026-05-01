import { queryOptions } from '@tanstack/react-query';
import { fetchEntity } from '~/api';
import { queryKeys } from '~/lib';
import { ENTITY_TYPE } from '~/utils';

export const networkQueryOptions = {
   get: () =>
      queryOptions({
         queryKey: queryKeys.scanner_network,
         queryFn: () => fetchEntity({ queryKey: [ENTITY_TYPE.NETWORKS] }),
      }),
};
