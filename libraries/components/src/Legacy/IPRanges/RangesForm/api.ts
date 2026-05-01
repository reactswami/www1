import { api_add, api_update } from "@statseeker/api/internal_api";
import { type IpRangeConfig } from "@statseeker/api/internal_api/entities/ip_range_config";
import { type IpRangeConfigFromAPI, type AddIpRangeData } from "./types";

export async function addRange({ newRange }: {
    newRange: AddIpRangeData;
 }) {
    return await api_add<IpRangeConfigFromAPI>({
       object_type: 'ip_range_config',
       rows: [newRange],
       context: 'addRange',
    });
 }

 export async function updateRange(newRange: IpRangeConfig) {
    return await api_update<IpRangeConfig>({
       object_type: 'ip_range_config',
       rows: [newRange],
       context: 'updateRanges',
    });
 }