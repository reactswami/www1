import { ApiFilter } from '@statseeker/utils/types';
export type IpRangeRule = {
   exclude: string[];
   include: string[];
};

export type IpRangeConfig = {
   id: number;
   name: string;
   ip_range: IpRangeRule;
   enabled: 0 | 1;
};

export type IpRangeConfigWithCounts = Omit<IpRangeConfig, 'ip_range'> & {
   includesCount: number;
   excludesCount: number;
};

export type IpRangeConfigFromAPI = IpRangeConfig & {
   // When retrieved from the API these could be undefined, but we ensure they are set in our query
   ip_range: {
      include?: string[];
      exclude?: string[];
   };
};

export type IpRangeListEntry = Omit<IpRangeConfig, 'ip_range'> & {
   includesCount: number;
   excludesCount: number;
};

export type AddIpRangeData = Omit<IpRangeConfig, 'id'>;

// Bulk updates have a query to get results, and then data to set for all results
// You can't change the id, but all other fields can be set
export type BulkUpdateIpRangeData = {
   [Property in keyof Omit<IpRangeConfig, 'id'>]?: IpRangeConfig[Property];
};

export type getRangesQueryParams = ApiFilter & {
   enabled_filter?: number;
};
