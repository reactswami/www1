import { faker } from '@faker-js/faker';
import { apply_all_logic } from '../../api-mocks';
import { type ApiObject } from '../../types';

type DeviceType = {
   id: number;
   ipaddress: string;
   sysDescr: string;
   ping_state: { state: string };
   snmp_state: { state: string | null };
   snmp_credential_name: string;
   lastSNMPStateChange?: { state_time: string | null };
   lastPingStateChange: { state_time: string | undefined } | undefined;
   retired: string;
   name: string;
   pollers?: string;
};

// Helper function to generate a device entry
const generateDeviceEntry = (id: number, cityName: string): DeviceType => ({
   id,
   ipaddress: faker.internet.ip(),
   sysDescr: faker.helpers.arrayElement([
      'Cisco IOS Software, C2960 Software (C2960-LANBASEK9-M), Version 12.2(46)SE, RELEASE SOFTWARE (fc2)',
      'Linux 2.6.9-89.0.16.ELsmp #1 SMP',
      'Liebert 80 KVA Parallel System',
      'Juniper Networks, Inc. srx3600 internet router',
      'NetScreen-ISG 2000 version 6.2.0r2.0',
   ]),
   ping_state: {
      state: faker.helpers.arrayElement(['up', 'disabled']),
   },
   snmp_state: {
      state: faker.helpers.arrayElement(['up', null]),
   },
   snmp_credential_name: faker.helpers.arrayElement(['public', 'new']),
   lastSNMPStateChange: {
      state_time: faker.date.future().toDateString(),
   },
   lastPingStateChange: {
      state_time: faker.date.future().toDateString(),
   },
   retired: faker.helpers.arrayElement(['on', 'off']),
   name: `${cityName}-${faker.helpers.arrayElement(['rtr', 'swt1', 'swt2', 'srv1', 'ups1'])}`,
   pollers: faker.helpers
      .arrayElements(['ping', 'snmp', 'http', 'tcp', 'udp'], { min: 1, max: 5 })
      .join(','),
});

// Add this to your existing data array
const additionalCities = [
   'Cairo',
   'Copenhagen',
   'Dubai',
   'Frankfurt',
   'Geneva',
   'Helsinki',
   'Istanbul',
   'Jakarta',
   'Kuala Lumpur',
   'Lima',
   'Madrid',
   'Manila',
   'Milan',
   'Moscow',
   'Mumbai',
   'Oslo',
   'Paris',
   'Prague',
   'Rome',
   'Seoul',
];

const additionalData: DeviceType[] = additionalCities.flatMap((city, index): DeviceType[] =>
   Array.from({ length: 5 }, (_, i) => generateDeviceEntry(3000 + index * 5 + i, city))
);

export function getAllDevicesMock(request: ApiObject) {
   const result = apply_all_logic(request, additionalData);
   return {
      success: true,
      errcode: 0,
      errmsg: 'ok',
      time: 1714629694,
      sequence: 26,
      data_total: result.data_total,
      data: result.data,
      describe: null,
   };
}
