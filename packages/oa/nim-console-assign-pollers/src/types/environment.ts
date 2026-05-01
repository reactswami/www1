type URL = string;

export type EnvMode = 'test' | 'staging' | 'production' | 'development';

export interface Environment {
   production: boolean;
   apiBase?: URL;
   env: EnvMode;
   baseRouteName?: string;
}
