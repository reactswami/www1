import { type ApiResponse } from '@statseeker/api/internal_api';
import { queryOptions } from '@tanstack/react-query';
import { queryKeys } from './keys';
import { getRangeById, getRangesWithCounts } from '~/api/ip_range_config';
import { type IpRangeConfigFromAPI, type getRangesQueryParams, type IpRangeConfig, type IpRangeConfigWithCounts } from '~/types/ipRange';

export const getRangesQuery = (params?: getRangesQueryParams) =>
   queryOptions({
      queryKey: queryKeys.GET_RANGES(params),
      queryFn: async () => {
         return getRangesWithCounts(params).then((ipranges: ApiResponse<IpRangeConfigWithCounts>) => {
            return {
               ...ipranges,
               data: ipranges.data
            };
         });
      },
   });

export const getRangeByIdQuery = (id: number) =>
   queryOptions({
      queryKey: queryKeys.GET_RANGE_BY_ID(id),
      queryFn: async () => {
         return getRangeById(id).then((ipranges: ApiResponse<IpRangeConfigFromAPI>) => {
            return {
               ...ipranges,
               data: ipranges.data.map((ipRangeConfig: IpRangeConfigFromAPI) => {
                  // Ensure that include and exclude arrays are present
                  const ipRangeRule = ipRangeConfig.ip_range;
                  if (!ipRangeRule.include) {
                     ipRangeRule.include = [];
                  }
                  if (!ipRangeRule.exclude) {
                     ipRangeRule.exclude = [];
                  }
                  return ipRangeConfig as IpRangeConfig;
               }),
            };
         });
      },
   });
