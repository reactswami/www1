import { faker } from '@faker-js/faker';
import { factory, nullable, primaryKey } from '@mswjs/data';
import { autoincrementInteger } from '@statseeker/utils/autoIncrementInteger';
import { createDateString } from './utils';

/**
 * Models as described in the @mswjs/data library
 */

function makeArray<T>(length: number, generator: () => T): T[] {
   return Array.from({ length }, generator);
}

export const users: string[] = makeArray(10, faker.person.firstName);

const details = [
   {
      device_reachable_count: -1,
      device_reachable_total: -1,
      device_walk_count: -1,
      new_devices_added: 0,
      new_interfaces_updated: -1,
      new_ping_devices_added: 0,
      new_snmp_devices_added: 0,
      retest_snmp_credentials: -1,
      updated_snmp_credentials: -1,
   },
   {
      device_reachable_count: -1,
      device_reachable_total: -1,
      device_walk_count: -1,
      devices_error_count: -1,
      devices_processed_count: -1,
      existing_devices_updated: -1,
      existing_interfaces_updated: -1,
      new_devices_added: 0,
      new_interfaces_updated: -1,
      new_ping_devices_added: 0,
      new_snmp_devices_added: 0,
      retest_snmp_credentials: -1,
      updated_snmp_credentials: -1,
   },
   {
      device_reachable_count: -1,
      device_reachable_total: -1,
      device_walk_count: -1,
      devices_error_count: -1,
      devices_processed_count: -1,
      existing_devices_updated: -1,
      existing_interfaces_updated: -1,
      new_devices_added: 0,
      new_interfaces_updated: -1,
      new_ping_devices_added: 0,
   },
   {
      devices_error_count: -1,
      devices_processed_count: -1,
      existing_devices_updated: -1,
      existing_interfaces_updated: -1,
      new_devices_added: 0,
      new_interfaces_updated: -1,
      new_ping_devices_added: 0,
      new_snmp_devices_added: 0,
      retest_snmp_credentials: -1,
      updated_snmp_credentials: -1,
   },
   {
      device_reachable_count: -1,
      device_reachable_total: -1,
      device_walk_count: -1,
      new_ping_devices_added: 0,
      new_snmp_devices_added: 0,
      retest_snmp_credentials: -1,
      updated_snmp_credentials: -1,
   },
];

const models = {
   discover_history: {
      id: primaryKey(autoincrementInteger),
      start: String,
      finish: nullable(String),
      mode: () =>
         faker.helpers.arrayElement([
            'Discover',
            'Rewalk',
            'Manual',
            'Hosts',
            'Ping Only Discover',
         ]),
      schedule: () =>
         faker.helpers.arrayElement(['', 'Monthly', 'Daily', 'Once', 'Weekly', 'Advanced']),
      user: () => faker.helpers.arrayElement([...users, 'Admin', 'Auto-Scheduled']),
      status: () => faker.helpers.arrayElement(['Success', 'Failed']),
   },
   discover_schedule: {
      id: primaryKey(autoincrementInteger),
      name: () => faker.lorem.word({ length: { min: 5, max: 7 }, strategy: 'fail' }),
      discoverMode: () =>
         faker.helpers.arrayElement([
            'Discover',
            'Rewalk',
            'Manual',
            'Hosts',
            'Ping Only Discover',
         ]),

      progress: () => faker.number.int({ min: 0, max: 100 }),
      enabled: () => faker.helpers.arrayElement([0, 1]),
      status: () => faker.helpers.arrayElement(['Success', 'Failed']),
      time: () =>
         faker.helpers.arrayElement([
            '* * * * 5',
            '30 4 5 * *',
            '30 6 1-10 * *',
            '30 6 * * *',
            1745435509,
         ]),
   },
   snmp_credential: {
      id: primaryKey(autoincrementInteger),
      name: () => faker.internet.displayName(),
      version: Number,
      type: String,
      community: nullable(String),
      auth_method: nullable(String),
      auth_user: nullable(String),
      auth_pass: nullable(String),
      priv_method: nullable(String),
      priv_user: nullable(String),
      priv_pass: nullable(String),
      context: nullable(String),
   },
};

export type Model = typeof db;
export const db = factory(models);

/*
 * Seed the mocked database server
 */
export const initialiseDb = () => {
   const counts = {
      discover_schedule: 250,
      discover_history: 150,
      snmp_credentials: 2,
   };
   const { discover_history, snmp_credentials, discover_schedule } = counts;

   new Array(discover_schedule).fill(discover_schedule).map(() => {
      return db.discover_schedule.create();
   });

   new Array(discover_history).fill(discover_history).map(() => {
      const startTime = faker.date.between({
         from: '2020-01-01T00:00:00.000Z',
         to: '2030-01-01T00:00:00.000Z',
      });
      const isFinished = faker.datatype.boolean();
      let finishedTime;
      if (isFinished) {
         finishedTime = faker.date.between({
            from: startTime,
            to: startTime.setFullYear(startTime.getFullYear() + 10),
         });
      }
      return db.discover_history.create({
         start: createDateString(startTime),
         finish: finishedTime ? createDateString(finishedTime) : null,
      });
   });

   new Array(snmp_credentials).fill(null).map(() => {
      const version = faker.helpers.arrayElement([1, 2, 3]);
      const type = `SNMP v${version}`;
      let auth_method = null;
      let auth_user = null;
      let auth_pass = null;
      let priv_method = null;
      let priv_user = null;
      let priv_pass = null;
      let context = null;
      let community = null;

      if (version === 3) {
         auth_method = faker.helpers.arrayElement([
            '',
            'md5',
            'sha',
            'sha224',
            'sha256',
            'sha384',
            'sha512',
         ]);

         if (auth_method === '') {
            auth_user = faker.helpers.arrayElement([faker.internet.userName(), null]);
         } else {
            auth_user = faker.internet.userName();
            auth_pass = faker.internet.password();
            priv_method = faker.helpers.arrayElement([
               '',
               'aes',
               'aes192',
               'aes256',
               'aes512',
               'des',
               'des3',
            ]);

            if (priv_method !== '') {
               priv_user = faker.internet.userName();
               priv_pass = faker.internet.password();
            }
         }
         context = faker.helpers.arrayElement([null, faker.lorem.word()]);
      } else {
         community = faker.lorem.word();
      }

      return db.snmp_credential.create({
         version,
         type,
         auth_method,
         auth_user,
         auth_pass,
         priv_method,
         priv_user,
         priv_pass,
         context,
         community,
      });
   });
};
