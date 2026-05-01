import { type IpRangeConfig } from '../ip_range_config';
import { type SNMPCredential } from '../snmp_credential';

export type DiscoverConfig = {
   id: number;
   snmp_credentials: SNMPCredential[];
   ifType: string[];
   ip_range_configurations: IpRangeConfig[];
   sysdescr: string[];
   ping_count: number;
   ping_rate: number;
   ranges: IpRangeConfig['ip_range'];
   ping_skip: number;
};
