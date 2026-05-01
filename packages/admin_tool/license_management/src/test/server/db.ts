import { factory } from '@mswjs/data';

/**
 * Models as described in the @mswjs/data library
 */
const models = {
   /**
    * Example only, replace this with your models
    */
   // organisation: {
   //    id: primaryKey(faker.datatype.uuid),
   //    name: faker.random.word,
   //    rule: nullable(oneOf('organisation_custom_rule')),
   // },
   // network: {
   //    id: primaryKey(faker.datatype.uuid),
   //    name: faker.random.word,
   //    organisation: oneOf('organisation'),
   //    rule: nullable(oneOf('network_custom_rule')),
   // },
   // config: {
   //    id: primaryKey(() => 1),
   //    api_key: nullable(() => null),
   //    proxy: nullable(() => `${faker.internet.url()}:${faker.internet.port()}`),
   //    base_url: () => faker.internet.url(),
   //    global_request_limit: () => faker.datatype.number({ min: 0, max: 10 }),
   //    global_request_timeout: () => faker.datatype.number({ min: 0, max: 120 }),
   //    disable_polling: () => faker.datatype.boolean(),
   //    rate_limit: () => faker.datatype.number({ min: 0, max: 300 }),
   //    request_limit: () => faker.datatype.number({ min: 0, max: 10 }),
   //    max_retries: () => faker.datatype.number({ min: 0, max: 5 }),
   //    request_timeout: () => faker.datatype.number({ min: 0, max: 120 }),
   //    config_poll_interval: () => faker.datatype.number({ min: 0, max: 300 }),
   //    disabled_data_types: () =>
   //       Object.values(Datatype).filter(() => Math.random() > 0.8),
   //    rules: {
   //       network: nullable(manyOf('network_custom_rule')),
   //       organisation: nullable(manyOf('organisation_custom_rule')),
   //    },
   // },
};

export type Model = typeof db;
export const db = factory(models);

/*
 * Seed the mocked database server
 */
export const initialiseDb = () => {
   /**
    * Example only, replace this with your logic to seed the mock server
    */
   /** Define number of models */
   // counts = {
   //    organisation: 100,
   //    network: 100,
   //    rules: {
   //       network: 10,
   //       organisation: 3,
   //    },
   // }
   /** Create models */
   // const { organisation, network, rules } = counts;
   // const organisations = new Array(organisation).fill(null).map((_) => {
   //    const hasCustomRule = Math.random() > 0.25;
   //    const randomIndex = Math.floor(Math.random() * rules.organisation);
   //    if (hasCustomRule) {
   //       return db.organisation.create({
   //          rule: customOrganisationRules[randomIndex],
   //       });
   //    }
   //    return db.organisation.create();
   // });
   // new Array(network).fill(null).map((_) => {
   //    const hasCustomRule = Math.random() > 0.25;
   //    const randomIndex = Math.floor(Math.random() * rules.network);
   //    const randomOrganisationIndex = Math.floor(Math.random() * organisation);
   //    if (hasCustomRule) {
   //       return db.network.create({
   //          organisation: organisations[randomOrganisationIndex],
   //          rule: customNetworkRules[randomIndex],
   //       });
   //    }
   //    return db.network.create({
   //       organisation: organisations[randomOrganisationIndex],
   //    });
   // });
   // db.config.create({
   //    rules: {
   //       network: customNetworkRules,
   //       organisation: customOrganisationRules,
   //    },
   // });
};
