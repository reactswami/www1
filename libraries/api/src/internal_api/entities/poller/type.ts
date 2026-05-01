
/**
 * Poller entity type definition.
 * @type PollerListItem
 * @property {number} id - The unique identifier of the poller
 * @property {string} name - The name of the poller
 */
export type PollerListItem = {
   id: number;
   name: string;
   deviceid: number;
   ipaddress?: string;
   service?: string;
   cfg?: string;
   componentId?: number;
};
export type PollerService = 'ping' | 'snmp' | 'all';