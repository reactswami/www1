type URL = string;

export type EnvMode = 'test' | 'staging' | 'production' | 'development';

export interface Environment {
   apiBase?: URL;
   baseRouteName?: string;
}
