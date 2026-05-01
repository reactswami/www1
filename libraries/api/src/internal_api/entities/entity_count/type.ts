/**
 * API Object Count type definition.
 * @type Object
 * @property {string} name       - The name of the object
 * @property {string} title      - The title of the object
 * @property {number} enabled    - The number of enabled entities of this object
 * @property {number} disabled   - The number of disabled entities of this object
 * @property {number} exceeded   - The number of entities of this object that have exceeded their license limit
 * @property {number} total      - The total number of entities of this object
 */
export type APIObjectCount = {
   name: string;
   title: boolean;
   enabled: number;
   disabled: number;
   exceeded: number;
   total: number;
};
