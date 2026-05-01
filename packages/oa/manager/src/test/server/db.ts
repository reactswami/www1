import { faker } from '@faker-js/faker';
import { factory, manyOf, oneOf, primaryKey } from '@mswjs/data';


export const SERVICES = ['ltm', 'ping'];
const TYPES = ['Oa', 'Ping'];

/**
 * Models as described in the @mswjs/data library
 */
const models = {
   device_oa: {
      type: () => TYPES[Math.random() < 0.5 ? 0 : 1] as 'Oa' | 'Ping', // this not in the real api, it's just a way for us to differentiate oa and device
      id: primaryKey(faker.datatype.uuid),
      gateway: () => faker.internet.ip(),
      hostname: () => faker.internet.domainName(),
      ipaddress: () => faker.internet.ip(),
      latitude: () => faker.location.latitude(),
      longitude: () => faker.location.longitude(),
      name: () => faker.lorem.words(2),
      title: () => faker.lorem.words(2),
      netmask: () => faker.internet.ip(),
      region: () => faker.location.state(),
      site: () => faker.location.city(),
      status: () => (faker.datatype.boolean() ? 'up' : 'down'),
      timeout: () => faker.number.int({ min: 0, max: 30 }),
      uptime: () => faker.number.int(),
      version: () => faker.system.semver(),
      poll: () => 'on' as 'on' | 'off',
      services: () => SERVICES.filter(() => Math.random() > 0.5).join(','),
      actions: () => '',
   },
   ping: {
      id: primaryKey(faker.datatype.uuid),
      poll: () => 'on' as 'on' | 'off',
      // These two fields are 'fake' fields to mimic the real API (it's using links in the real API)
      device: oneOf('device_oa'),
      poller: manyOf('device_oa'),
   },
};

export type Model = typeof db;
export const db = factory(models);

/*
 * Seed the mocked database server
 */
export const seedDb = () => {
   /**
    * Example only, replace this with your logic to seed the mock server
    */
   /** Define number of models */
   const counts = {
      device_oa: process.env['NODE_ENV'] === 'test' ? 5 : 50,
      devices: process.env['NODE_ENV'] === 'test' ? 5 : 200,
   };
   /** Create models */
   const { device_oa, devices } = counts;

   // Create device_oa
   const Oas = Array(device_oa)
      .fill(null)
      .map(() => db.device_oa.create({ type: 'Oa' }));

   // Create devices
   const cdtDevices = Array(devices)
      .fill(null)
      .map(() => {
         return db.device_oa.create({
            type: 'Ping',
            services: '',
         });
      });

   const pings = Array(devices)
      .fill(null)
      .forEach((_, idx) =>
         db.ping.create({
            device: cdtDevices[idx],
            poller: Array(Math.ceil(Math.random() * Oas.length))
               .fill(null)
               .map(() => Oas[Math.floor(Math.random() * Oas.length)]),
         })
      );
   // db.device_oa.create({ id: '999' });
};
