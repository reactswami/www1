import { type SNMPCredential } from '../snmp_credential';

/**
  @type IpRange
 * @description The IPv4 and IPv6 Ranges to be included or excluded.
 * @property {string[]} include - Array of IPv4 and IPv6 ranges to include
 * @property {string[]} exclude - Array of IPv4 and IPv6 ranges to exclude
 */
export type IpRange = {
   include: string[];
   exclude: string[];
};

/**
  @type IpRangeConfig
 * @description IP Range Configuration
 * @property {number} id - IP Range Configuration ID
 * @property {string} name - Name of IP Range Configuration
 * @property {0|1} enabled - Indicates whether this IP Range Configuration has been enabled.
 * @property {IpRange} ip_range - IPv4 and IPv6 Ranges
 * @property {SNMPCredential[]} [snmp_credentials] - The valid data formats for the snmp_credentials field
 */
export type IpRangeConfig = {
   id: number;
   name: string;
   enabled: 0 | 1;
   ip_range: IpRange;
   snmp_credentials?: SNMPCredential[];
};

/**
  @type IpRangeConfigFilters
 * @description Filters for IP Range Configurations
 * @property {string} [text_filter] - Filter by name
 * @property {string} [sort] - Sort by field
 * @property {'asc'|'desc'} [dir] - Sort direction
 */
export type IpRangeConfigFilters = { text_filter?: string; sort?: string; dir?: 'asc' | 'desc' };

/**
  @type IpRangeListEntry
 * @description IP Range List Entry
 * @property {IpRangeConfig} ip_range_config - IP Range Configuration
 * @property {number} includesCount - Number of IP ranges included
 * @property {number} excludesCount - Number of IP ranges excluded
 * @property {string} enabledString - Enabled string
 */
export type IpRangeListEntry = IpRangeConfig & {
   includesCount: number;
   excludesCount: number;
   enabledString: string;
};
