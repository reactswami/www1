import { type Port, type Device } from '@statseeker/api/internal_api/entities';

export type DeviceListItem = Pick<
   Device,
   | 'id'
   | 'name'
   | 'sysDescr'
   | 'ipaddress'
   | 'retired'
   | 'snmp_poll'
   | 'ping_poll'
   | 'snmp_maxoid'
   | 'default_poller'
   | 'sysLocation'
   | 'latitude'
   | 'longitude'
   | 'hostname'
   | 'region'
   | 'site'
   | 'snmp_poller'
   | 'snmp_poller_id'
> & {
   ping_state: {
      state: string;
   };
   snmp_state: {
      state: string;
   };
   snmp_credential_name: string;
   snmp_credential_id: number;
   pollers: string;
};

export type PortListItem = Pick<
   Port,
   | 'id'
   | 'name'
   | 'idx'
   | 'ifDescr'
   | 'ifTitle'
   | 'ifSpeed'
   | 'ifOutSpeed'
   | 'ifInSpeed'
   | 'ifAdminStatus'
   | 'ifAdminStatusPoll'
   | 'ifOperStatus'
   | 'ifOperStatusPoll'
   | 'ifNonUnicast'
   | 'poll'
> & {
   deviceName: string;
   deviceRetired: string;
   devicePoll: string;
};

export type SNMPEntityListItem = {
   id: number;
   name: string;
   device: string;
   poll: string;
   index: string;
   [key: string]: string | number; // Allows additional string or number fields
};

