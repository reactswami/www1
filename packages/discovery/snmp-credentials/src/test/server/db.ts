import { faker } from '@faker-js/faker';
import { factory, nullable, primaryKey } from '@mswjs/data';
import { autoincrementInteger } from '@statseeker/utils/autoIncrementInteger';

/**
 * Models as described in the @mswjs/data library
 */
const models = {
   snmp_credential: {
      id: primaryKey(autoincrementInteger),
      name: () =>
         faker.commerce.productAdjective() +
         ' ' +
         faker.hacker.noun() +
         ' ' +
         faker.number.int({ min: 1, max: 3 }),
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
      snmp_credentials: 55,
   };
   const { snmp_credentials } = counts;

   new Array(snmp_credentials).fill(null).map(() => {
      const version = faker.helpers.arrayElement([1, 2, 3]);
      const type = `SNMP v${version}`;
      let auth_method = null;
      let priv_method = null;
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

         if (auth_method !== '') {
            priv_method = faker.helpers.arrayElement([
               '',
               'aes',
               'aes192',
               'aes256',
               'aes512',
               'des',
               'des3',
            ]);
         }
         context = faker.helpers.arrayElement([null, faker.lorem.word()]);
      }

      return db.snmp_credential.create({
         version,
         type,
         auth_method,
         priv_method,
         context,
         community,
      });
   });
};
