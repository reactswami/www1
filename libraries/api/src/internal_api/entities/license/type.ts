/**
 * API License Limit type definition.
 * @type Object
 * @property {string} key         - Unique identifier for the limit
 * @property {string} title       - Title of the limit
 * @property {string} description - Description of the limit
 * @property {string} [visibility] - Visibility setting for the limit, can be 'visible', 'conditional', or 'hidden'
 * @property {number} limit       - The limit value
 * @property {number} polled      - The number of entities that are polled
 * @property {number} exceeded    - The number of entities that have exceeded the limit
 * @property {number} total       - The total number of entities
 */
export interface APILicenseLimit {
   name: string;
   title: string;
   description: string;
   visibility: 'visible' | 'conditional' | 'hidden';
   limit: number;
   polled: number;
   exceeded: number;
   total: number;
}

/**
 * API License Feature type definition.
 * @type Object
 * @property {string} name         - Unique identifier for the feature
 * @property {string} title        - Title of the feature
 * @property {string} description  - Description of the feature
 * @property {boolean} enabled     - Whether the feature is currently enabled
 * @property {boolean} licenced    - Whether the feature is currently licensed
 * @property {number} [not_before] - Timestamp when the feature becomes valid
 * @property {number} [not_after]  - Timestamp when the feature expires
 * @property {APILicenseLimit[]} [limits] - limits associated with the feature
 * @property {string} [visibility] - Visibility setting for the feature, can be 'visible', 'conditional', or 'hidden'
 */
export interface APILicenseFeature {
   name: string;
   title: string;
   description: string;
   enabled: boolean;
   licenced: boolean;
   not_before: number | null;
   not_after: number | null;
   limits: APILicenseLimit[];
   visibility: 'visible' | 'conditional' | 'hidden';
}

/**
 * API License type definition.
 * @type Object
 * @property {number} id          - The ID of the license
 * @property {string} version     - The version of the license
 * @property {string} server_id   - The server ID associated with the license
 * @property {string[]} hardware_ids - List of hardware IDs associated with the license
 * @property {string} tier        - The tier of the license
 * @property {boolean} licenced    - Whether the license is currently valid
 * @property {number} not_after   - Timestamp when the license expires
 * @property {number} not_before  - Timestamp when the license becomes valid
 * @property {APILicenseFeature[]} features - List of features included in the license
 */
export interface APILicense {
   id: number;
   version: string;
   server_id: string | null;
   hardware_id: string;
   tier: string | null;
   licenced: boolean;
   perpetual: boolean;
   not_after: number | null;
   not_before: number | null;
   features: APILicenseFeature[];
}
