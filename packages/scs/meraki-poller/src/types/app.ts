/*
 * These types are application wide types. They are not bound to the API.
 */

export enum AppDatatype {
   wirelessLatencyStats = 'Wireless - Latency Stats',
   wirelessConnectionStats = 'Wireless - Connection Stats',
   clientConfiguration = 'Client - Configuration',
   clientApplications = 'Client - Applications',
   switchPorts = 'Switch Ports',
   topology = 'Topology',
   events = 'Events',
}

export type SelectedEntityRouterState = {
   name: string;
   id: string;
   type: 'networks' | 'organizations';
}[];
