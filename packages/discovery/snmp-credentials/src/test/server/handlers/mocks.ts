import { type ApiObject } from '@statseeker/api/internal_api';
import { apply_all_logic } from '@statseeker/api/internal_api/api-mocks';
import { type SNMPCredential } from '@statseeker/api/internal_api/entities';
import { db } from '../db';

const _all_credentials = db.snmp_credential.getAll();

type DeviceWithCredentialNameMock = {
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

const deviceWithCredentialNameRows: DeviceWithCredentialNameMock[] = [
   {
      id: 787,
      ipaddress: '10.100.89.254',
      snmp_credential_id: _all_credentials[0]?.id,
      snmp_credential_name: _all_credentials[0]?.name,
      ping_state: {
         state: 'up',
      },
      snmp_state: {
         state: 'down',
      },
      lastSNMPStateChange: {
         state_time: 'Tue Jun  4 16:39:36 2024',
      },
      lastPingStateChange: {
         state_time: 'Thu Jun  6 06:07:21 2024',
      },
      name: 'Adelaide-rtr',
   },
   {
      id: 806,
      ipaddress: '10.100.89.253',
      snmp_credential_id: _all_credentials[0]?.id,
      snmp_credential_name: _all_credentials[0]?.name,
      ping_state: {
         state: 'up',
      },
      snmp_state: {
         state: 'down',
      },
      lastSNMPStateChange: {
         state_time: 'Tue Jun  4 16:42:39 2024',
      },
      lastPingStateChange: {
         state_time: 'Thu Jun  6 00:17:35 2024',
      },
      name: 'Adelaide-swt1',
   },
   {
      id: 808,
      ipaddress: '10.100.89.252',
      snmp_credential_id: _all_credentials[0]?.id,
      snmp_credential_name: _all_credentials[0]?.name,
      ping_state: {
         state: 'up',
      },
      snmp_state: {
         state: 'down',
      },
      lastSNMPStateChange: {
         state_time: 'Tue Jun  4 16:39:36 2024',
      },
      lastPingStateChange: {
         state_time: 'Thu Jun  6 01:00:37 2024',
      },
      name: 'Adelaide-swt2',
   },
   {
      id: 828,
      ipaddress: '10.100.59.254',
      snmp_credential_id: _all_credentials[0]?.id,
      snmp_credential_name: _all_credentials[0]?.name,
      ping_state: {
         state: 'up',
      },
      snmp_state: {
         state: 'down',
      },
      lastSNMPStateChange: {
         state_time: 'Tue Jun  4 16:39:36 2024',
      },
      lastPingStateChange: {
         state_time: 'Thu Jun  6 03:12:21 2024',
      },
      name: 'Athens-rtr',
   },
   {
      id: 716,
      ipaddress: '10.100.59.11',
      snmp_credential_id: _all_credentials[0]?.id,
      snmp_credential_name: _all_credentials[0]?.name,
      ping_state: {
         state: 'up',
      },
      snmp_state: {
         state: 'down',
      },
      lastSNMPStateChange: {
         state_time: 'Tue Jun  4 16:42:39 2024',
      },
      lastPingStateChange: {
         state_time: 'Mon Jun  3 14:05:00 2024',
      },
      name: 'Athens-srv1',
   },
   {
      id: 679,
      ipaddress: '10.100.59.12',
      snmp_credential_id: _all_credentials[0]?.id,
      snmp_credential_name: _all_credentials[0]?.name,
      ping_state: {
         state: 'up',
      },
      snmp_state: {
         state: 'down',
      },
      lastSNMPStateChange: {
         state_time: 'Tue Jun  4 16:42:39 2024',
      },
      lastPingStateChange: {
         state_time: 'Mon Jun  3 14:05:05 2024',
      },
      name: 'Athens-srv2',
   },
   {
      id: 734,
      ipaddress: '10.100.59.253',
      snmp_credential_id: _all_credentials[0]?.id,
      snmp_credential_name: _all_credentials[0]?.name,
      ping_state: {
         state: 'up',
      },
      snmp_state: {
         state: 'down',
      },
      lastSNMPStateChange: {
         state_time: 'Tue Jun  4 16:39:36 2024',
      },
      lastPingStateChange: {
         state_time: 'Mon Jun  3 14:05:05 2024',
      },
      name: 'Athens-swt1',
   },
   {
      id: 852,
      ipaddress: '10.100.59.252',
      snmp_credential_id: _all_credentials[0]?.id,
      snmp_credential_name: _all_credentials[0]?.name,
      ping_state: {
         state: 'up',
      },
      snmp_state: {
         state: 'down',
      },
      lastSNMPStateChange: {
         state_time: 'Tue Jun  4 16:42:39 2024',
      },
      lastPingStateChange: {
         state_time: 'Mon Jun  3 14:05:01 2024',
      },
      name: 'Athens-swt2',
   },
   {
      id: 654,
      ipaddress: '10.100.59.251',
      snmp_credential_id: _all_credentials[0]?.id,
      snmp_credential_name: _all_credentials[0]?.name,
      ping_state: {
         state: 'up',
      },
      snmp_state: {
         state: 'down',
      },
      lastSNMPStateChange: {
         state_time: 'Tue Jun  4 16:42:39 2024',
      },
      lastPingStateChange: {
         state_time: 'Mon Jun  3 14:05:01 2024',
      },
      name: 'Athens-swt3',
   },
   {
      id: 812,
      ipaddress: '10.100.59.3',
      snmp_credential_id: _all_credentials[0]?.id,
      snmp_credential_name: _all_credentials[0]?.name,
      ping_state: {
         state: 'up',
      },
      snmp_state: {
         state: 'down',
      },
      lastSNMPStateChange: {
         state_time: 'Tue Jun  4 16:42:39 2024',
      },
      lastPingStateChange: {
         state_time: 'Mon Jun  3 19:49:18 2024',
      },
      name: 'Athens-ups1',
   },
   {
      id: 855,
      ipaddress: '10.100.59.4',
      snmp_credential_id: _all_credentials[0]?.id,
      snmp_credential_name: _all_credentials[0]?.name,
      ping_state: {
         state: 'up',
      },
      snmp_state: {
         state: 'down',
      },
      lastSNMPStateChange: {
         state_time: 'Tue Jun  4 16:42:39 2024',
      },
      lastPingStateChange: {
         state_time: 'Mon Jun  3 19:05:20 2024',
      },
      name: 'Athens-ups2',
   },
   {
      id: 769,
      ipaddress: '10.100.68.254',
      snmp_credential_id: _all_credentials[0]?.id,
      snmp_credential_name: _all_credentials[0]?.name,
      ping_state: {
         state: 'up',
      },
      snmp_state: {
         state: 'down',
      },
      lastSNMPStateChange: {
         state_time: 'Tue Jun  4 16:42:39 2024',
      },
      lastPingStateChange: {
         state_time: 'Mon Jun  3 14:05:02 2024',
      },
      name: 'Auckland-rtr',
   },
   {
      id: 653,
      ipaddress: '10.100.61.255',
      snmp_credential_id: _all_credentials[0]?.id,
      snmp_credential_name: _all_credentials[0]?.name,
      ping_state: {
         state: 'down',
      },
      snmp_state: {
         state: 'down',
      },
      lastSNMPStateChange: {
         state_time: 'Mon Jun  3 16:46:06 2024',
      },
      lastPingStateChange: {
         state_time: 'Mon Jun  3 16:45:46 2024',
      },
      name: 'Auckland-swt1',
   },
   {
      id: 817,
      ipaddress: '10.100.68.252',
      snmp_credential_id: _all_credentials[0]?.id,
      snmp_credential_name: _all_credentials[0]?.name,
      ping_state: {
         state: 'up',
      },
      snmp_state: {
         state: 'down',
      },
      lastSNMPStateChange: {
         state_time: 'Tue Jun  4 16:42:39 2024',
      },
      lastPingStateChange: {
         state_time: 'Mon Jun  3 18:41:17 2024',
      },
      name: 'Auckland-swt2',
   },
   {
      id: 768,
      ipaddress: '10.100.68.251',
      snmp_credential_id: _all_credentials[0]?.id,
      snmp_credential_name: _all_credentials[0]?.name,
      ping_state: {
         state: 'up',
      },
      snmp_state: {
         state: 'down',
      },
      lastSNMPStateChange: {
         state_time: 'Tue Jun  4 16:42:39 2024',
      },
      lastPingStateChange: {
         state_time: 'Mon Jun  3 14:05:01 2024',
      },
      name: 'Auckland-swt3',
   },
   {
      id: 752,
      ipaddress: '10.100.82.254',
      snmp_credential_id: _all_credentials[0]?.id,
      snmp_credential_name: _all_credentials[0]?.name,
      ping_state: {
         state: 'up',
      },
      snmp_state: {
         state: 'down',
      },
      lastSNMPStateChange: {
         state_time: 'Tue Jun  4 16:42:39 2024',
      },
      lastPingStateChange: {
         state_time: 'Thu Jun  6 07:28:47 2024',
      },
      name: 'Bangalore-rtr',
   },
   {
      id: 686,
      ipaddress: '10.100.82.253',
      snmp_credential_id: _all_credentials[0]?.id,
      snmp_credential_name: _all_credentials[0]?.name,
      ping_state: {
         state: 'up',
      },
      snmp_state: {
         state: 'down',
      },
      lastSNMPStateChange: {
         state_time: 'Tue Jun  4 16:42:39 2024',
      },
      lastPingStateChange: {
         state_time: 'Thu Jun  6 09:17:21 2024',
      },
      name: 'Bangalore-swt1',
   },
   {
      id: 722,
      ipaddress: '10.100.82.252',
      snmp_credential_id: _all_credentials[0]?.id,
      snmp_credential_name: _all_credentials[0]?.name,
      ping_state: {
         state: 'up',
      },
      snmp_state: {
         state: 'down',
      },
      lastSNMPStateChange: {
         state_time: 'Tue Jun  4 15:34:32 2024',
      },
      lastPingStateChange: {
         state_time: 'Thu Jun  6 07:10:07 2024',
      },
      name: 'Bangalore-swt2',
   },
   {
      id: 665,
      ipaddress: '10.100.79.254',
      snmp_credential_id: _all_credentials[0]?.id,
      snmp_credential_name: _all_credentials[0]?.name,
      ping_state: {
         state: 'up',
      },
      snmp_state: {
         state: 'down',
      },
      lastSNMPStateChange: {
         state_time: 'Tue Jun  4 16:42:39 2024',
      },
      lastPingStateChange: {
         state_time: 'Wed Jun  5 10:49:21 2024',
      },
      name: 'Bangkok-rtr',
   },
   {
      id: 685,
      ipaddress: '10.100.79.253',
      snmp_credential_id: _all_credentials[0]?.id,
      snmp_credential_name: _all_credentials[0]?.name,
      ping_state: {
         state: 'up',
      },
      snmp_state: {
         state: 'down',
      },
      lastSNMPStateChange: {
         state_time: 'Tue Jun  4 16:42:39 2024',
      },
      lastPingStateChange: {
         state_time: 'Wed Jun  5 07:45:20 2024',
      },
      name: 'Bangkok-swt1',
   },
   {
      id: 773,
      ipaddress: '10.100.54.254',
      snmp_credential_id: _all_credentials[1]?.id,
      snmp_credential_name: _all_credentials[1]?.name,
      ping_state: {
         state: 'up',
      },
      snmp_state: {
         state: 'up',
      },
      lastSNMPStateChange: {
         state_time: 'Mon Jun  3 14:05:28 2024',
      },
      lastPingStateChange: {
         state_time: 'Thu Jun  6 03:33:36 2024',
      },
      name: 'Barcelona-rtr',
   },
   {
      id: 711,
      ipaddress: '10.100.54.11',
      snmp_credential_id: _all_credentials[1]?.id,
      snmp_credential_name: _all_credentials[1]?.name,
      ping_state: {
         state: 'up',
      },
      snmp_state: {
         state: 'up',
      },
      lastSNMPStateChange: {
         state_time: 'Mon Jun  3 14:05:28 2024',
      },
      lastPingStateChange: {
         state_time: 'Thu Jun  6 08:52:03 2024',
      },
      name: 'Barcelona-srv1',
   },
   {
      id: 759,
      ipaddress: '10.100.54.12',
      snmp_credential_id: _all_credentials[1]?.id,
      snmp_credential_name: _all_credentials[1]?.name,
      ping_state: {
         state: 'up',
      },
      snmp_state: {
         state: 'up',
      },
      lastSNMPStateChange: {
         state_time: 'Mon Jun  3 14:05:28 2024',
      },
      lastPingStateChange: {
         state_time: 'Wed Jun  5 12:34:47 2024',
      },
      name: 'Barcelona-srv2',
   },
   {
      id: 776,
      ipaddress: '10.100.54.253',
      snmp_credential_id: _all_credentials[1]?.id,
      snmp_credential_name: _all_credentials[1]?.name,
      ping_state: {
         state: 'up',
      },
      snmp_state: {
         state: 'up',
      },
      lastSNMPStateChange: {
         state_time: 'Mon Jun  3 14:05:28 2024',
      },
      lastPingStateChange: {
         state_time: 'Thu Jun  6 04:15:33 2024',
      },
      name: 'Barcelona-swt1',
   },
   {
      id: 827,
      ipaddress: '10.100.54.252',
      snmp_credential_id: _all_credentials[1]?.id,
      snmp_credential_name: _all_credentials[1]?.name,
      ping_state: {
         state: 'up',
      },
      snmp_state: {
         state: 'up',
      },
      lastSNMPStateChange: {
         state_time: 'Mon Jun  3 14:05:28 2024',
      },
      lastPingStateChange: {
         state_time: 'Thu Jun  6 05:45:04 2024',
      },
      name: 'Barcelona-swt2',
   },
   {
      id: 839,
      ipaddress: '10.100.54.251',
      snmp_credential_id: _all_credentials[1]?.id,
      snmp_credential_name: _all_credentials[1]?.name,
      ping_state: {
         state: 'up',
      },
      snmp_state: {
         state: 'up',
      },
      lastSNMPStateChange: {
         state_time: 'Thu Jun  6 07:52:10 2024',
      },
      lastPingStateChange: {
         state_time: 'Thu Jun  6 07:51:47 2024',
      },
      name: 'Barcelona-swt3',
   },
   {
      id: 694,
      ipaddress: '10.100.54.250',
      snmp_credential_id: _all_credentials[4]?.id,
      snmp_credential_name: _all_credentials[4]?.name,
      ping_state: {
         state: 'up',
      },
      snmp_state: {
         state: 'up',
      },
      lastSNMPStateChange: {
         state_time: 'Mon Jun  3 14:05:28 2024',
      },
      lastPingStateChange: {
         state_time: 'Mon Jun  3 14:05:06 2024',
      },
      name: 'Barcelona-swt4',
   },
   {
      id: 735,
      ipaddress: '10.100.54.3',
      snmp_credential_id: _all_credentials[4]?.id,
      snmp_credential_name: _all_credentials[4]?.name,
      ping_state: {
         state: 'up',
      },
      snmp_state: {
         state: 'up',
      },
      lastSNMPStateChange: {
         state_time: 'Mon Jun  3 14:05:28 2024',
      },
      lastPingStateChange: {
         state_time: 'Wed Jun  5 19:22:51 2024',
      },
      name: 'Barcelona-ups1',
   },
   {
      id: 656,
      ipaddress: '10.100.54.4',
      snmp_credential_id: _all_credentials[4]?.id,
      snmp_credential_name: _all_credentials[4]?.name,
      ping_state: {
         state: 'up',
      },
      snmp_state: {
         state: 'up',
      },
      lastSNMPStateChange: {
         state_time: 'Mon Jun  3 14:05:28 2024',
      },
      lastPingStateChange: {
         state_time: 'Thu Jun  6 06:53:49 2024',
      },
      name: 'Barcelona-ups2',
   },
   {
      id: 814,
      ipaddress: '10.100.70.254',
      snmp_credential_id: _all_credentials[4]?.id,
      snmp_credential_name: _all_credentials[4]?.name,
      ping_state: {
         state: 'up',
      },
      snmp_state: {
         state: 'up',
      },
      lastSNMPStateChange: {
         state_time: 'Mon Jun  3 14:05:28 2024',
      },
      lastPingStateChange: {
         state_time: 'Thu Jun  6 01:15:21 2024',
      },
      name: 'Beijing-rtr',
   },
   {
      id: 660,
      ipaddress: '10.100.70.253',
      snmp_credential_id: _all_credentials[1]?.id,
      snmp_credential_name: _all_credentials[1]?.name,
      ping_state: {
         state: 'up',
      },
      snmp_state: {
         state: 'up',
      },
      lastSNMPStateChange: {
         state_time: 'Mon Jun  3 14:05:28 2024',
      },
      lastPingStateChange: {
         state_time: 'Tue Jun  4 03:58:30 2024',
      },
      name: 'Beijing-swt1',
   },
   {
      id: 861,
      ipaddress: '10.100.70.252',
      snmp_credential_id: _all_credentials[3]?.id,
      snmp_credential_name: _all_credentials[3]?.name,
      ping_state: {
         state: 'up',
      },
      snmp_state: {
         state: 'up',
      },
      lastSNMPStateChange: {
         state_time: 'Mon Jun  3 14:05:28 2024',
      },
      lastPingStateChange: {
         state_time: 'Mon Jun  3 14:05:03 2024',
      },
      name: 'Beijing-swt2',
   },
   {
      id: 728,
      ipaddress: '10.100.50.30',
      snmp_credential_id: _all_credentials[1]?.id,
      snmp_credential_name: _all_credentials[1]?.name,
      ping_state: {
         state: 'up',
      },
      snmp_state: {
         state: 'up',
      },
      lastSNMPStateChange: {
         state_time: 'Mon Jun  3 14:05:28 2024',
      },
      lastPingStateChange: {
         state_time: 'Mon Jun  3 14:05:06 2024',
      },
      name: 'Berlin-fw',
   },
   {
      id: 687,
      ipaddress: '10.100.50.10',
      snmp_credential_id: _all_credentials[3]?.id,
      snmp_credential_name: _all_credentials[3]?.name,
      ping_state: {
         state: 'up',
      },
      snmp_state: {
         state: 'up',
      },
      lastSNMPStateChange: {
         state_time: 'Mon Jun  3 14:05:28 2024',
      },
      lastPingStateChange: {
         state_time: 'Thu Jun  6 09:15:07 2024',
      },
      name: 'Berlin-srv',
   },
   {
      id: 709,
      ipaddress: '10.100.50.2',
      snmp_credential_id: _all_credentials[1]?.id,
      snmp_credential_name: _all_credentials[1]?.name,
      ping_state: {
         state: 'up',
      },
      snmp_state: {
         state: 'up',
      },
      lastSNMPStateChange: {
         state_time: 'Wed Jun  5 11:57:35 2024',
      },
      lastPingStateChange: {
         state_time: 'Wed Jun  5 11:57:00 2024',
      },
      name: 'Berlin-ups',
   },
   {
      id: 813,
      ipaddress: '10.100.77.1',
      snmp_credential_id: _all_credentials[1]?.id,
      snmp_credential_name: _all_credentials[1]?.name,
      ping_state: {
         state: 'up',
      },
      snmp_state: {
         state: 'up',
      },
      lastSNMPStateChange: {
         state_time: 'Tue Jun  4 11:02:04 2024',
      },
      lastPingStateChange: {
         state_time: 'Thu Jun  6 09:33:20 2024',
      },
      name: 'Brisbane-Router1',
   },
   {
      id: 673,
      ipaddress: '10.100.86.254',
      snmp_credential_id: _all_credentials[1]?.id,
      snmp_credential_name: _all_credentials[1]?.name,
      ping_state: {
         state: 'up',
      },
      snmp_state: {
         state: 'up',
      },
      lastSNMPStateChange: {
         state_time: 'Thu Jun  6 03:30:53 2024',
      },
      lastPingStateChange: {
         state_time: 'Thu Jun  6 03:29:52 2024',
      },
      name: 'Brisbane-rtr',
   },
   {
      id: 680,
      ipaddress: '10.100.86.253',
      snmp_credential_id: _all_credentials[2]?.id,
      snmp_credential_name: _all_credentials[2]?.name,
      ping_state: {
         state: 'up',
      },
      snmp_state: {
         state: 'up',
      },
      lastSNMPStateChange: {
         state_time: 'Thu Jun  6 03:19:42 2024',
      },
      lastPingStateChange: {
         state_time: 'Thu Jun  6 03:18:52 2024',
      },
      name: 'Brisbane-swt1',
   },
   {
      id: 661,
      ipaddress: '10.100.86.252',
      snmp_credential_id: _all_credentials[1]?.id,
      snmp_credential_name: _all_credentials[1]?.name,
      ping_state: {
         state: 'up',
      },
      snmp_state: {
         state: 'up',
      },
      lastSNMPStateChange: {
         state_time: 'Thu Jun  6 00:23:49 2024',
      },
      lastPingStateChange: {
         state_time: 'Thu Jun  6 01:59:17 2024',
      },
      name: 'Brisbane-swt2',
   },
   {
      id: 625,
      ipaddress: '10.100.56.254',
      snmp_credential_id: _all_credentials[2]?.id,
      snmp_credential_name: _all_credentials[2]?.name,
      ping_state: {
         state: 'up',
      },
      snmp_state: {
         state: 'up',
      },
      lastSNMPStateChange: {
         state_time: 'Mon Jun  3 14:05:28 2024',
      },
      lastPingStateChange: {
         state_time: 'Mon Jun  3 14:05:00 2024',
      },
      name: 'Budapest-rtr',
   },
];

const deviceRows = db.snmp_credential.findMany({}).map((cred) => ({
   id: cred.id,
   count: deviceWithCredentialNameRows.filter((d) => d.snmp_credential_id === cred.id).length,
   credential: cred.id,
}));

export function getCredentialsMock(request: ApiObject) {
   const result = apply_all_logic(request, db.snmp_credential.getAll());

   return {
      success: true,
      errcode: 0,
      errmsg: 'ok',
      time: 1714431052,
      sequence: 2,
      data_total: result.data_total,
      data: result.data,
      describe: null,
   };
}

export function describeCredentialMock() {
   return {
      success: true,
      errcode: 0,
      errmsg: 'ok',
      time: 1714629694,
      sequence: 26,
      data_total: 0,
      data: [],
      describe: {
         allow_formula_fields: true,
         commands: {
            add: {
               valid_data: {
                  auth_method: {
                     required: false,
                  },
                  auth_pass: {
                     required: false,
                  },
                  auth_user: {
                     required: false,
                  },
                  community: {
                     required: false,
                  },
                  context: {
                     required: false,
                  },
                  id: {
                     required: false,
                  },
                  ip_range_configs: {
                     required: false,
                  },
                  name: {
                     required: true,
                  },
                  priv_method: {
                     required: false,
                  },
                  priv_pass: {
                     required: false,
                  },
                  version: {
                     required: false,
                  },
               },
               valid_fields: {},
               valid_options: {},
            },
            delete: {
               valid_data: {},
               valid_fields: {
                  auth_method: {
                     required: false,
                  },
                  auth_pass: {
                     required: false,
                  },
                  auth_user: {
                     required: false,
                  },
                  community: {
                     required: false,
                  },
                  context: {
                     required: false,
                  },
                  id: {
                     required: false,
                  },
                  name: {
                     required: false,
                  },
                  priv_method: {
                     required: false,
                  },
                  priv_pass: {
                     required: false,
                  },
                  version: {
                     required: false,
                  },
               },
               valid_options: {},
            },
            describe: {
               valid_data: {},
               valid_fields: {},
               valid_options: {},
            },
            get: {
               valid_data: {},
               valid_fields: {
                  auth_method: {
                     required: false,
                  },
                  auth_pass: {
                     required: false,
                  },
                  auth_user: {
                     required: false,
                  },
                  community: {
                     required: false,
                  },
                  context: {
                     required: false,
                  },
                  id: {
                     required: false,
                  },
                  name: {
                     required: false,
                  },
                  priv_method: {
                     required: false,
                  },
                  priv_pass: {
                     required: false,
                  },
                  version: {
                     required: false,
                  },
               },
               valid_options: {},
            },
            update: {
               valid_data: {
                  auth_method: {
                     required: false,
                  },
                  auth_pass: {
                     required: false,
                  },
                  auth_user: {
                     required: false,
                  },
                  community: {
                     required: false,
                  },
                  context: {
                     required: false,
                  },
                  id: {
                     required: false,
                  },
                  ip_range_configs: {
                     required: false,
                  },
                  name: {
                     required: false,
                  },
                  priv_method: {
                     required: false,
                  },
                  priv_pass: {
                     required: false,
                  },
                  version: {
                     required: false,
                  },
               },
               valid_fields: {
                  auth_method: {
                     required: false,
                  },
                  auth_pass: {
                     required: false,
                  },
                  auth_user: {
                     required: false,
                  },
                  community: {
                     required: false,
                  },
                  context: {
                     required: false,
                  },
                  id: {
                     required: false,
                  },
                  name: {
                     required: false,
                  },
                  priv_method: {
                     required: false,
                  },
                  priv_pass: {
                     required: false,
                  },
                  version: {
                     required: false,
                  },
               },
               valid_options: {},
            },
         },
         description:
            'The saved SNMP Credentials which are used for discovery and associating to SNMP monitored devices',
         fields: {
            auth_method: {
               datatype: 'string',
               description: 'The SNMPv3 Authentication Method',
               enum: {
                  '0': {
                     label: 'None',
                     value: '',
                     description: 'None',
                  },
                  '1': {
                     label: 'MD5',
                     description: 'MD5',
                     value: 'md5',
                  },
                  '2': {
                     label: 'SHA1',
                     value: 'sha',
                     description: 'SHA1',
                  },
                  '3': {
                     label: 'SHA224',
                     description: 'SHA224',
                     value: 'sha224',
                  },
                  '4': {
                     label: 'SHA256',
                     value: 'sha256',
                     description: 'SHA256',
                  },
                  '5': {
                     label: 'SHA384',
                     value: 'sha384',
                     description: 'SHA384',
                  },
                  '6': {
                     label: 'SHA512',
                     description: 'SHA512',
                     value: 'sha512',
                  },
               },
               interval: 0,
               options: {},
               polltype: 'cfg',
               title: 'The SNMPv3 Authentication Method',
            },
            auth_pass: {
               datatype: 'string',
               description: 'The Password to use when authenticating an SNMPv3 request',
               interval: 0,
               options: {},
               polltype: 'cfg',
               title: 'Authentication Password',
            },
            auth_user: {
               datatype: 'string',
               description: 'The Username to use when authenticating an SNMPv3 request',
               interval: 0,
               options: {},
               polltype: 'cfg',
               title: 'Authentication User',
            },
            community: {
               datatype: 'string',
               description: 'SNMPv1 or SNMPv2 community string',
               interval: 0,
               options: {},
               polltype: 'cfg',
               title: 'SNMP Community',
            },
            context: {
               datatype: 'string',
               description: 'The SNMPv3 Context',
               interval: 0,
               options: {},
               polltype: 'cfg',
               title: 'Context',
            },
            id: {
               datatype: 'integer',
               description: 'SNMP Credential identifier/key',
               interval: 0,
               options: {},
               polltype: 'cfg',
               title: 'ID',
            },
            ip_range_configs: {
               datatype: 'object',
               description: 'Array of IP Range Configs IDs (add and update only)',
               interval: 0,
               options: {
                  formats: {
                     description: 'The valid data formats for the ip_range_configs field',
                     values: {
                        list: {
                           description:
                              'Array of ip_range_config ids to assign to this configuration',
                           title: 'List',
                        },
                     },
                  },
               },
               polltype: 'cfg',
               title: 'IP Range Config IDs',
            },
            name: {
               datatype: 'string',
               description: 'Name identifer for SNMP Credentials',
               interval: 0,
               options: {},
               polltype: 'cfg',
               title: 'Name',
            },
            priv_method: {
               datatype: 'string',
               description:
                  'The Privacy Method used when encrypting/decrypting SNMPv3 requests and responses',
               enum: {
                  '0': {
                     value: '',
                     description: 'None',
                     label: 'None',
                  },
                  '1': {
                     label: 'AES',
                     description: 'AES',
                     value: 'aes',
                  },
                  '2': {
                     label: 'AES192',
                     description: 'AES 192',
                     value: 'aes192',
                  },
                  '3': {
                     value: 'aes256',
                     description: 'AES 256',
                     label: 'AES256',
                  },
                  '4': {
                     label: 'AES512',
                     description: 'AES 512',
                     value: 'aes512',
                  },
                  '5': {
                     value: 'des',
                     description: 'DES',
                     label: 'DES',
                  },
                  '6': {
                     label: 'DES3',
                     description: 'Triple DES',
                     value: 'des3',
                  },
               },
               interval: 0,
               options: {},
               polltype: 'cfg',
               title: 'The SNMPv3 Privacy Method',
            },
            priv_pass: {
               datatype: 'string',
               description:
                  'The Password to use when encrypting/decrypting SNMPv3 requests and responses',
               interval: 0,
               options: {},
               polltype: 'cfg',
               title: 'Privacy Password',
            },
            version: {
               datatype: 'integer',
               description: 'The SNMP version',
               interval: 0,
               options: {},
               polltype: 'cfg',
               title: 'SNMP Version',
            },
         },
         global_field_options: {
            aggregation_format: {
               description: 'Aggregation formats to apply when group_by option is provided',
               values: {
                  '95th': {
                     description: '95th percentile of the values in the group',
                     title: '95th percentile',
                  },
                  avg: {
                     description: 'Average of the values in the group',
                     title: 'Average',
                  },
                  cat: {
                     description: 'Concatenation of the values in the group',
                     title: 'Concatenate',
                  },
                  count: {
                     description: 'Number on non-null values in the group',
                     title: 'Count',
                  },
                  count_all: {
                     description: 'Number of values in the group (including null values)',
                     title: 'Count (include NULL)',
                  },
                  count_unique: {
                     description: 'Number of unique non-null values in the group',
                     title: 'Unique count',
                  },
                  count_unique_all: {
                     description: 'Number of unique values in the group (including null values)',
                     title: 'Unique count (include NULL)',
                  },
                  first: {
                     description: 'First value in the group (default)',
                     title: 'First',
                  },
                  last: {
                     description: 'Last value in the group',
                     title: 'Last',
                  },
                  list: {
                     description: 'Comma separated concatenation of the values in the group',
                     title: 'List',
                  },
                  list_unique: {
                     description: 'Comma separated concatenation of the unique values in the group',
                     title: 'Unique List',
                  },
                  max: {
                     description: 'Maximum of the values in the group',
                     title: 'Maximum',
                  },
                  median: {
                     description: 'Median of the values in the group',
                     title: 'Median',
                  },
                  min: {
                     description: 'Minimum of the values in the group',
                     title: 'Minimum',
                  },
                  stddev: {
                     description: 'Standard deviation of the values in the group',
                     title: 'Standard deviation',
                  },
                  sum: {
                     description: 'Sum of all values in the group (null if no valid values)',
                     title: 'Sum',
                  },
                  total: {
                     description: 'Sum of all values in the group (0 if no valid values)',
                     title: 'Total',
                  },
               },
            },
         },
         info: {},
         links: {
            IRCtoSCMapLink: {
               is_default: true,
               object: 'irc_to_sc_map',
               title: 'Link to IP Range Configuration to SNMP Credential Map',
            },
         },
         options: {
            encrypted: {
               description:
                  'Indicates whether auth_pass and priv_pass have already been encrypted when calling add or update',
               values: {
                  false: {
                     description:
                        'Indicates that auth_pass and priv_pass have not been encrypted (default if not provided)',
                     title: 'false',
                  },
                  true: {
                     description:
                        'Indicates that auth_pass and priv_pass have already been encrypted',
                     title: 'true',
                  },
               },
            },
         },
         title: 'SNMP Credential Details',
         type: 'snmp_credential',
      },
   };
}

export function getCredentialsById(ids: number[]) {
   const credentials = db.snmp_credential.findMany({
      where: {
         id: {
            in: ids,
         },
      },
   });

   return {
      success: true,
      errcode: 0,
      errmsg: 'ok',
      time: 1714431052,
      sequence: 2,
      data_total: credentials?.length,
      data: credentials,
      describe: null,
   };
}

export function createCredential(newCred: SNMPCredential) {
   const dbCred = db.snmp_credential.create({
      ...newCred,
      type: `SNMP v${newCred.version}`,
   });
   return {
      success: true,
      errcode: 0,
      errmsg: 'ok',
      time: 1717739829,
      sequence: 5,
      data_total: 1,
      data: [dbCred],
      describe: null,
   };
}

export function addErrorMock() {
   return {
      success: false,
      errcode: -4,
      errmsg: 'Unable Insert Entry: Another entry already exists',
      time: 1716432957,
      sequence: 0,
      data_total: 0,
      data: [],
      describe: null,
   };
}

export function getCredentialDevicesMock(request: ApiObject) {
   const result = apply_all_logic(request, deviceRows);

   return {
      success: true,
      errcode: 0,
      errmsg: 'ok',
      time: 1714431052,
      sequence: 2,
      data_total: result.data_total,
      data: result.data,
      describe: null,
   };
}

export function getDevicesWithCredentialName(request: ApiObject) {
   let devices = JSON.parse(JSON.stringify(deviceWithCredentialNameRows));

   const matches = request.filter?.match('{snmp_credential_id} = ([0-9]+)');
   if (matches && matches?.length > 0) {
      const credential = parseInt(matches[1], 10);
      for (let i = devices.length - 1; i >= 0; i--) {
         let device = devices[i];
         if (device.snmp_credential_id !== credential) {
            devices.splice(i, 1);
         }
      }
   }

   const result = apply_all_logic(request, devices);

   return {
      success: true,
      errcode: 0,
      errmsg: 'ok',
      time: 1714431052,
      sequence: 2,
      data_total: result.data_total,
      data: result.data,
      describe: null,
   };
}
