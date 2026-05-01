/**
 * API License type definition.
 * @type Object
 * @property {string} server_id          - The server ID associated with the license
 * @property {string} hardware_id        - The hardware ID associated with the license
 * @property {string} tier               - The tier of the license
 * @property {number} not_after          - Timestamp when the license expires
 * @property {boolean} perpetual         - Indicates if the license is perpetual
 * @property {number} device_count       - Number of devices discovered
 * @property {number} port_count         - Number of ports discovered
 * @property {boolean} valid_new_license - Indicates if the server has a valid new license
 * @property {string} csrf_token         - CSRF token for security
 * @property {string} version            - The current version of Statseeker
 */
interface License {
   server_id: string | null;
   hardware_id: string;
   tier: string | null;
   not_after: number | null;
   perpetual: boolean;
   device_count: number | null;
   port_count: number | null;
   valid_new_license: boolean;
   csrf_token: string | null;
   version: string;
}

export interface LicenseResponse {
   meta: {};
   success: boolean;
   result: License;
}
