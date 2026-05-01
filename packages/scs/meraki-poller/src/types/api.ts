import { type PrimaryKey } from '@mswjs/data/lib/primaryKey';

/*
 * These types are derived from the api. They are bound to the api schema.
 */
export interface APIGlobalSchema
   extends ApiBaseConfig,
      ApiOrganizationConfig,
      ApiNetworkConfig {
   networks: ApiNetworks;
   organizations: ApiOrganizations;
}

export interface APIConfig
   extends Omit<ApiBaseConfig, 'rules'>,
      ApiOrganizationConfig,
      ApiNetworkConfig {}

type NetworkId = string;

export type ApiGlobalConfig = ApiBaseConfig & ApiOrganizationConfig & ApiNetworkConfig;

export interface ApiBaseConfig extends ApiConnection {
   is_polling: boolean;
   down_message: string;
   is_exceeded: boolean;
   exceeded_message: string;
   global_request_limit: number;
   global_request_timeout: number;
   disable_polling: boolean;
   cleanup_rules: { [key in ApiStalableDatatype]: number };
   base_url: string;
   rules: {
      organization: ApiOrganizationCustomRule[];
      network: ApiNetworkCustomRule[];
   };
}

export interface ApiConnection {
   api_key: string;
   proxy_username?: string;
   proxy_password?: string;
   proxy_server?: string;
   proxy_port?: string;
}

export enum ApiDatatype {
   wirelessLatencyStats = 'wireless_latency_stats',
   wirelessConnectionStats = 'wireless_connection_stats',
   clientConfiguration = 'client_configuration',
   clientApplications = 'client_applications',
   switchPorts = 'switch_ports',
   topology = 'topology',
   events = 'events',
}

export enum ApiStalableDatatype {
   Application = 'Application',
   Client = 'Client',
   Device = 'Device',
   Interface = 'Interface',
   Topology = 'Topology',
   Uplink = 'Uplink',
   VPN = 'VPN',
   Wireless = 'Wireless',
}

interface ApiOrganizationConfig {
   rate_limit: number;
   request_limit: number;
   max_retries: number;
   request_timeout: number;
}

export interface ApiOrganizationCustomRule extends Partial<ApiOrganizationConfig> {
   enabled?: boolean;
   id: string;
   name: string;
   new_ids?: string[];
}

interface ApiOrganizationBase {
   id: string;
   name: string;
}

export type ApiOrganizations = Record<
   string,
   {
      name: string;
      network_count: number;
      api_enabled: boolean;
      poll_requests: number;
      poll_sent: number;
      poll_limit: number;
      rule: ApiOrganizationCustomRule['id'] | null;
   }
>;

export interface ApiNetworkConfig {
   config_poll_interval: number;
   disabled_data_types: ApiDatatype[];
}
export interface ApiNetworkCustomRule extends Partial<ApiNetworkConfig> {
   id: string | PrimaryKey<string>;
   name: string;
   enabled?: boolean;
   priority_network?: boolean;
   new_ids?: string[];
}

export interface ApiNetworks {
   [x: string]: {
      name: string;
      organization: ApiOrganizationBase['id'];
      device_count: number;
      port_count: number;
      poll_requests: number;
      poll_status: string;
      rule?: ApiNetworkCustomRule['id'] | null;
   };
}

export type CallState = 'uninitialised' | 'loading' | 'success' | 'failure';

export interface ApiTestConnectionResponse {
   success: boolean;
   errmsg: 'ok' | string;
   time: number;
   organization_count: number;
}

export interface ApiRuleResponse {
   success: boolean;
   errmsg: 'ok' | string;
   time: number;
   last_rule_id_added: number;
}
