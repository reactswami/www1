type URL = string;

export type EnvMode = 'test' | 'staging' | 'production' | 'development';

export interface Environment {
   production: boolean;
   apiBase?: URL;
   env: EnvMode;
   baseRouteName?: string;
   endpoints: Endpoints;
}

type Endpoints = {
   fetchOaWithPingServiceEnabled: string;
   updateIpRanges: string;
   runPingDiscovery: (
      oa: string,
      ipScanRange: string,
      isDryRun?: boolean
   ) => string;
};
