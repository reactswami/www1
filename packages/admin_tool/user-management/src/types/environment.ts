type URL = string;

export type EnvMode = 'test' | 'development' | 'production';

export interface Environment {
   production: boolean;
   apiBase?: URL;
   env: EnvMode;
   baseRouteName?: string;
}
