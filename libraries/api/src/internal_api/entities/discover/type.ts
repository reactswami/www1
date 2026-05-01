import { type DiscoverConfig } from '../discover_config';

export type Discover = {
   logfile: string;
   start: string;
   mode: string;
   id: number;
   user: string;
   details: Record<string, unknown>;
   config: DiscoverConfig;
   duration: number;
   status: string;
   credential_length: number;
};

export type DiscoverModes = 'Manual' | 'Discover' | 'Rewalk' | 'Hosts' | "Ping Only Discover";
/**
 * @type DiscoverExecuteOptions
 * @description This type is based on the discover execute command and the options it allows
 */
export type DiscoverExecuteOptions = {
   /**
    * @description When running a manual discover, Force add devices from configuration into Product (Defaults to false)
    */
   manual_force_add?: boolean;
   /**
    * @description Array of SNMP versions to check during a discovery (defaults to [ 2, 3 ]
    */
   snmp_versions?: number[]; // 1,2,3
   /**
    * @description When running an snmp discovery, if a device is pingable, but doesn't respond to snmp, still add device as ping only(Defaults to false)
    */
   discover_add_ping_only?: boolean; //false
   /**
    * @description A array of email addresses. When select the output log will be emailed to these addresses on completion of the task. If a 'logfile' is specified, the logfile will be kept, otherwise a temporary logfile is used which is later removed. If a 'subject' is given, this will be used for the email subject, otherwise a default subject line is used
    */
   email?: string[];
   /**
    * @description SNMP Timeout in seconds to use for each walk command (Defaults to 5)
    */
   snmp_timeout?: number;
   /**
    * @description The subject line to use if the 'email' option is specified
    *
    */
   subject?: string;
   /**
    * @description Discover using SNMP getNext (for 'Discover' or 'Manual' mode only, defaults to false)
    */
   discover_getNext?: boolean;
   /**
    * @description When rewalking, only rewalk already discover Custom Data Tables (Defaults to true)
    */
   rewalk_only_discovered?: boolean;
   /**
    * @description When rewalking, re-test saved snmp credentials if devices are ping up, but snmp down(Defaults to true)
    */
   rewalk_retest_snmp_down_devices?: boolean;
   /**
    * @description Override Custom Data Type discover rules.
    */
   discover_rules?: Record<string, unknown>;
   /**
    * @description Optional array of groups to rewalk (for 'Rewalk' mode only)
    */
   groups?: string[];
   /**
    * @description Whether to run discover post-processing steps. Currently this includes Autogrouping and the Hardware Inventory report generation. This will result in a quicker discover but means that the added devices won't be added to any Autogroups or the Hardware Inventory report until the next full discover. (defaults to true)
    */
   runPostProcessing?: boolean;
   /**
    * @description  Maximum number of walk files opened by an Snmpwalk(Defaults to value in snmp.cfg)
    */
   snmp_max_files?: number;
   /**
    * @description When running a discover, Don't include IP addresses already in Product (Defaults to true)
    */
   discover_prune_existing_devices?: boolean;
   /**
    * @description Verbose level for the output (defaults to 0)
    */
   verbose?: 0 | 1 | 2 | 3;
   /**
    * @description SNMP Window Size to use for each walk command (Defaults to 10)
    */
   snmp_window_size?: number;
   /**
    * @description Path to store the discover log (defaults to ~/nim/etc/discover.log)
    */
   logfile?: string;
   /**
    * @description A configuration used for specifyig IP ranges
    */
   data?: string;
   /**
    * @description Optional array of devices to rewalk (for 'Rewalk' mode only)
    */
   devices?: string[];
   /**
    * @description Override discover configuration
    */
   discover_config?: DiscoverConfig;
   /**
    * @description The type of discovery to run
    */
   mode: DiscoverModes;
   /**
    * @description SNMP Retry Count to use for each walk command (Defaults to 2)
    */
   snmp_retry_count?: number;
   /**
    * @description If runPostProcessing is enabled, create groups based on interface types (Defaults to discover_grouping in nim-options.cfg
    */
   interface_type_autogrouping?: boolean;
   /**
    * @description If runPostProcessing is enabled, create groups based on interface speeds (Defaults to discover_grouping in nim-options.cfg
    */
   interface_speed_autogrouping?: boolean;
   /**
    * @description Path to config file containing IP Range Configuration (uploaded)
    */
   datafile?: string;
   /**
    * @description SNMP Max Repetition to use for each walk (Defaults to value in snmp.cfg)
    */
   snmp_max_repetitions?: number;
   /**
    * @description Enable SNMP error logging (default to false)
    */
   snmperrlog?: boolean;
   /**
    * @description  Perform minimal discover (for 'Discover' or 'Manual' mode only, defaults to false)
    */
   discover_minimal?: boolean;
   /**
    * @description Block if another discover is running (default to false)
    */
   block?: boolean;
   /**
    * @description Override Advanced options for interface operstatus polling
    */
   discover_operstatus?: boolean;
   /**
    * @description Override Advanced options for interface admin status polling
    */
   discover_adminstatus?: boolean;
   /**
    * @description Needs a description
    */
   discover_nucast?: string;
   /**
    * @description When walking custom data type tables, try to rediscover Custom Data types if already discovered (Defaults to false)
    */
   rediscover_custom_data_types?: boolean;
   /**
    * @description re-test snmp credentials for know devices
    */
   retest_snmp_credentials?: 'none' | 'down' | 'all';
   /**
    * @description Manual Configuration which has been generated from a previous discover (after processing data or datafile)
    */
   manual_config?: ManualConfig[];
   /**
    * @description When running a Ping Only Discover, Force add ping only devices for secondary IP addresses of monitored devices (Defaults to false)
    */
   ping_only_force_add?: boolean;
   /**
    * @description Poller on which the discover will be run
    */
   poller_id?: number;
   poll_id?: number;
   poll_name?: string;
   api_task_id?: number;
};

export type ManualConfig = {
   ipaddress: string;
   manual_name?: string;
   version?: number;
   ping_only?: boolean;
   id?: number;
   name?: string;
   community?: string | null;
   auth_method?: string;
   auth_user?: string | null;
   auth_pass?: string | null;
   priv_method?: string;
   priv_pass?: string | null;
   context?: string | null;
   encrypted?: boolean;
   /**
    * @description index of the manual config, used mostly to track during the importing of the devices
    */
   index?: number;
   /**
    * @description id of the snmp credential, this will be returned while importing the devices, if it finds a matching snmp
    */
   credential_id?: number;
};