type URL = string;

export enum EnvMode {
   production,
   test,
   dev,
}

export interface Environment {
   production: boolean;
   routes: {
      TEST_CONNECTION: string;
      GET_GLOBAL_CONFIG: string;
      UPDATE_GLOBAL_CONFIG: string;
   };
   baseRouterName: string;
}
