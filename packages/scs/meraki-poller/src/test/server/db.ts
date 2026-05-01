import { faker } from '@faker-js/faker';
import { factory, manyOf, nullable, primaryKey } from '@mswjs/data';
import { ApiDatatype } from '~/types/api';

const models = {
   organization: {
      id: primaryKey(faker.string.uuid),
      name: faker.lorem.word,
      rule: faker.string.uuid,
   },
   organization_custom_rule: {
      id: primaryKey(faker.string.uuid),
      name: () => faker.lorem.word(),
      enabled: faker.datatype.boolean,
      network_poll_order: () => [],
      rate_limit: nullable(() => faker.number.int({ min: 1, max: 10 })),
      request_limit: nullable(() => faker.number.int({ min: 0, max: 10 })),
      max_retries: nullable(() => faker.number.int({ min: 0, max: 5 })),
      request_timeout: nullable(() => faker.number.int({ min: 0, max: 120 })),
   },
   network_custom_rule: {
      id: primaryKey(faker.string.uuid),
      name: faker.lorem.word,
      enabled: faker.datatype.boolean,
      priority_network: faker.datatype.boolean,
      config_poll_interval: nullable(() => faker.number.int({ min: 1, max: 3 })),
      disabled_data_types: () => Object.values(ApiDatatype).filter(() => Math.random() > 0.8),
   },
   network: {
      id: primaryKey(faker.string.uuid),
      name: faker.lorem.word,
      organization: faker.string.uuid,
      rule: faker.string.uuid,
   },
   config: {
      id: primaryKey(() => 1),
      api_key: nullable(() => '123'),
      proxy: nullable(() => `${faker.internet.url()}:${faker.internet.port()}`),
      base_url: () => faker.internet.url(),
      global_request_limit: () => faker.number.int({ min: 0, max: 10 }),
      global_request_timeout: () => faker.number.int({ min: 0, max: 120 }),
      disable_polling: () => true,
      rate_limit: () => faker.number.int({ min: 0, max: 10 }),
      request_limit: () => faker.number.int({ min: 0, max: 10 }),
      max_retries: () => faker.number.int({ min: 0, max: 5 }),
      request_timeout: () => faker.number.int({ min: 0, max: 120 }),
      config_poll_interval: () => [300, 3600, 86400][Math.floor(Math.random() * 3)],
      disabled_data_types: () => Object.values(ApiDatatype).filter(() => Math.random() > 0.8),
      networks: manyOf('network'),
      organizations: manyOf('organization'),
      rules: {
         network: nullable(manyOf('network_custom_rule')),
         organization: nullable(manyOf('organization_custom_rule')),
      },
      cleanup_rules: {
         Device: () => faker.number.int({ min: 0, max: 5 }),
         Interface: () => faker.number.int({ min: 0, max: 5 }),
         Wireless: () => faker.number.int({ min: 0, max: 5 }),
         Client: () => faker.number.int({ min: 0, max: 5 }),
         Application: () => faker.number.int({ min: 0, max: 5 }),
         Uplink: () => faker.number.int({ min: 0, max: 5 }),
         VPN: () => faker.number.int({ min: 0, max: 5 }),
         Topology: () => faker.number.int({ min: 0, max: 5 }),
      },
   },
};

export type Model = typeof db;
export const db = factory(models);

/*
 * Seed the mocked database server
 */
export const initialiseDb = (
   counts = {
      organization: 100,
      network: 100,
      rules: {
         network: 50,
         organization: 50,
      },
   }
) => {
   const { organization, network, rules } = counts;

   const customNetworkRules = new Array(rules.network)
      .fill(null)
      .map((_) => db.network_custom_rule.create());

   const customOrganizationRules = new Array(rules.organization)
      .fill(null)
      .map((_) => db.organization_custom_rule.create());

   const organizations = new Array(organization).fill(null).map((_) => {
      const hasCustomRule = Math.random() > 0.25;
      const randomIndex = Math.floor(Math.random() * rules.organization);
      if (hasCustomRule) {
         return db.organization.create({
            rule: customOrganizationRules[randomIndex].id,
         });
      }
      return db.organization.create();
   });

   const networks = new Array(network).fill(null).map((_) => {
      const hasCustomRule = Math.random() > 0.25;
      const randomIndex = Math.floor(Math.random() * rules.network);
      const randomOrganizationIndex = Math.floor(Math.random() * organization);
      if (hasCustomRule) {
         return db.network.create({
            organization: organizations[randomOrganizationIndex].id,
            rule: customNetworkRules[randomIndex].id,
         });
      }
      return db.network.create({
         organization: organizations[randomOrganizationIndex].id,
      });
   });

   db.config.create({
      networks: networks,
      organizations: organizations,
      rules: {
         network: customNetworkRules,
         organization: customOrganizationRules,
      },
   });
};
