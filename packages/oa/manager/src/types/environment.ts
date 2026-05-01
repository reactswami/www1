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
   fetchAllGroups: string;
   fetchAllOas: string;
   fetchOaRows: string;
   fetchOaWithPingServiceEnabled: string;
   fetchOaServices: string;
   fetchOa: (id: string) => string;
   fetchOrphanDevicesPingedOnlyByOa: string;
   createOa: string;
   updateOa: string;
   rebootOa: string;
   updateOaComponents: string;
   deleteOa: string;
};
