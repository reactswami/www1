import { useQuery } from '@tanstack/react-query';
import { type AxiosResponse } from 'axios';
import { useEffect } from 'react';
import { getGlobalConfig } from '~/api/getGlobalConfig';
import { queryKeys } from '~/lib/ReactQuery';
import { type APIGlobalSchema } from '~/types/api';

interface Options {
   refetchInterval?: number;
   staleTime?: number;
   gcTime?: number;
}
interface Props {
   customQueryKeys?: string[];
   options?: Options;
   onSuccess?: (data: any) => void;
}
export const useFetchGlobalConfig = ({
   customQueryKeys = queryKeys.globalConfig,
   options,
   onSuccess,
}: Props = {}) => {
   const query = useQuery<AxiosResponse<APIGlobalSchema>>({
      ...options,
      queryKey: customQueryKeys,
      queryFn: getGlobalConfig,
   });

   useEffect(() => {
      if (query.isSuccess && onSuccess) {
         onSuccess(query.data);
      }
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [query.isSuccess]);

   return query;
};
