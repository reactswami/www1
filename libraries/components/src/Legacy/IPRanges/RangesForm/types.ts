import { type IpRangeConfig } from "@statseeker/api/internal_api/entities";

export type AddIpRangeData = Omit<IpRangeConfig, 'id'>;

export type IpRangeConfigFromAPI = IpRangeConfig & {
    // When retrieved from the API these could be undefined, but we ensure they are set in our query
    ip_range: {
       include?: string[];
       exclude?: string[];
    };
 };