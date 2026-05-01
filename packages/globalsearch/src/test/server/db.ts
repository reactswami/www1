import { faker } from '@faker-js/faker';
import { factory } from '@mswjs/data';

/**
 * Models as described in the @mswjs/data library
 */

function makeArray<T>(length: number, generator: () => T): T[] {
   return Array.from({ length }, generator);
}

export const users: string[] = makeArray(10, faker.person.firstName);

const models = {

};

export type Model = typeof db;
export const db = factory(models);

/*
 * Seed the mocked database server
 */
export const initialiseDb = () => {

};
