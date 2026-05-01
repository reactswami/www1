type URL = string;

export type EnvMode = 'test' | 'development' | 'production';

interface ProxyRequests {
   /** The service that will proxy the requests (usually a shared build server) */
   proxy_server: string;
   /** The host of the system to proxy requests to */
   host: string;
   /** The user to authenticate with the host system */
   user: string;
   /** The password to authenticate with the host system */
   password: string;
};

export interface Environment {
   production: boolean;
   apiBase?: URL;
   env: EnvMode;
   baseRouteName?: string;
   proxy_requests?: ProxyRequests;
}
