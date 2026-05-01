/**
 * @description This type allows you to get all keys of a certain type i.e string, boolean, number
 */
export type KeysOfValue<T, TCondition> = {
   [K in keyof T]: T[K] extends TCondition ? K : never;
}[keyof T];
