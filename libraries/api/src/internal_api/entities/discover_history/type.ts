import { type ApiFilter } from '@statseeker/utils/types';
import { type DiscoverConfig } from '../discover_config';
import { DiscoverExecuteOptions } from '../discover/type';

export type DiscoverHistoryDetails = {
   devices_count?: number;
   devices_reachable_count?: number;
   devices_added?: string[];
   devices_error_count?: number;
   devices_filter_out_count?: number;
   devices_filtered_out?: Record<string, string[]>;
   devices_processed_count?: number;
   devices_with_errors?: Record<string, string[]>;
   ip_found_count?: number;
   ip_scan_range_count?: number;
   ip_snmp_found_count?: number;
   ip_snmp_test_count?: number;
   ip_snmp_walk_count?: number;
   ip_snmp_walk_device_count?: number;
   new_devices_added?: number;
   new_interfaces_updated?: number;
   new_ping_devices_added?: number;
   new_snmp_devices_added?: number;
   retest_snmp_credentials?: number;
   states?: string[];
   updated_snmp_credentials?: number;
};

export type DiscoverHistory = {
   finish: string;
   logfile: string;
   start: string;
   mode: string;
   id: number;
   user: string;
   details: DiscoverHistoryDetails;
   config: DiscoverExecuteOptions;
   duration: number;
   status: string;
   task_name: string;
   poller_name: string;
};

export type DiscoverHistoryTask = DiscoverHistory & {
   task_type: string;
   task_time: string | number;
   task_enabled: string | number;
   task_id: number;
   config: DiscoverExecuteOptions;
};

export type DiscoverHistoryFilter = ApiFilter & {
   discoverMode?: string[];
   status?: string;
   user?: string;
   task_type?: string[];
   task_name?: string;
   task_enabled?: string;
   poller_status?: string;
   poller_name?: string;
   device?: string;
};
