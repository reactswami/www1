
/**
 * API Object type definition.
 * @type Object
 * @property {string} name     - The internal name of the object
 * @property {string} title    - The display name of the object
 * @property {string} poller   - The name of the poller that collects data for this object
 * @property {string} inherits - The list of objects that this object inherits from
 */
export type ApiObjectDataType = {
   name: string;
   title: string;
   poller: string;
   inherits: string[];
   inherited_by: string[];
};
