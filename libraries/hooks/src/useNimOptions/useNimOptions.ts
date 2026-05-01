import { getNimOptions, type NimOption } from '@statseeker/api/internal_api/entities';
import { queryOptions, useQuery } from '@tanstack/react-query';

export function useNimOptions() {
   const { data, isSuccess } = useQuery(queryOptions({
      queryKey: ['nim-options'],
      queryFn: () =>
         getNimOptions({
            request: {
               fields: ['id', 'value'],
            },
         }),
      select: (data) => data.data,
   }),);

   function getAll() {
      return data;
   }

   function getValueByKey(key: string) {
      const foundNimOption = data?.filter((nimOption) => nimOption.id === key);

      if (foundNimOption && foundNimOption.length > 0) {
         return foundNimOption[0].value === 'off' ? false : true;
      }

      return undefined;
   }

   function getRawValueByKey(data: NimOption[] | undefined, key: string) {
      const foundNimOption = data?.filter((nimOption) => nimOption.id === key);

      if (foundNimOption && foundNimOption.length > 0) {
         return foundNimOption[0].value;
      }

      return undefined;
   }

   return { getAll, getValueByKey, getRawValueByKey, isSuccess, data };
}
