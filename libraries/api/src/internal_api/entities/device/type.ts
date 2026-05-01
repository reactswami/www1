import { type ApiFilter } from '@statseeker/utils/types';

export type Device = {
   id: number;
   name: string;
   deviceId?: string;
   idx?: string;
   table?: string;
   poll?: string;
   auth_method?: string;
   auth_pass?: string;
   auth_user?: string;
   chassisId?: string;
   community?: string;
   context?: string;
   custom_data_details?: string;
   default_poller?: string;
   discover_getNext?: string;
   discover_minimal?: string;
   discover_snmpv1?: string;
   hostname?: string;
   ipaddress: string;
   latitude?: number;
   longitude?: number;
   manual_name?: string;
   memorySize?: number;
   mis?: string;
   ping_dup?: number;
   ping_jitter?: number;
   ping_lost?: number;
   ping_lost_percent?: number;
   ping_outage?: number;
   ping_poll?: string;
   ping_received?: number;
   ping_rtt?: number;
   ping_rtt_max?: number;
   ping_rtt_min?: number;
   ping_sent?: number;
   ping_state?: number;
   priv_method?: string;
   priv_pass?: string;
   region?: string;
   retired?: string;
   site?: string;
   snmpEngineID?: string;
   snmp_credential?: number;
   snmp_maxoid?: number;
   snmp_poll?: string;
   snmp_poller_id?: number;
   snmp_poller: string;
   snmp_state?: string;
   snmp_version?: number;
   sysContact?: string;
   sysDescr?: string;
   sysLocation?: string;
   sysName?: string;
   sysObjectID?: string;
   sysServices?: number;
   vendor?: string;
};

export type DeviceWithCredentialName = {
   id: number;
   name: string;
   ipaddress: string;
   snmp_credential_id: number;
   snmp_credential_name: string;
   ping_state: {
      state: string;
   };
   snmp_state: {
      state: string;
   };
   lastSNMPStateChange: {
      state_time: string;
   };
   lastPingStateChange: {
      state_time: string;
   };
};

export type DeviceCountWithGroup = { groupid: number; group: string; devices: number };

export type DeviceFilter = ApiFilter & {
   snmp_credential_id?: number;
   ping_state?: string;
   snmp_state?: string;
   snmp_poller_status?: string;
   snmp_poller_id?: number[];
};

export type DeviceUpdateFilter = {
   group_id_filter?: number;
   snmp_poll?: string;
   ping_poll?: string;
   text_filter?: string;
   selectedIds?: number[];
};

export type PortUpdateFilter = {
   group_id_filter?: number;
   ifOperStatus?: string;
   ifAdminStatus?: string;
   poll?: string;
   text_filter?: string;
   selectedIds?: number[];
};

export type SNMPEntityFilter = ApiFilter & {
   data_type?: string;
   group_id_filter?: number;
   poll?: string;
   snmp_poller_status?: string;
   snmp_poller_id?: number[];
};

export type SNMPEntityUpdateFilter = {
   data_type: string;
   group_id_filter?: number;
   poll?: string;
   text_filter?: string;
   selectedIds?: number[];
};
