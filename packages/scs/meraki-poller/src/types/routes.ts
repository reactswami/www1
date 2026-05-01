import { type ReactElement } from 'react';

type Path = Routes | string;

export type RouteDefinition = {
   path: Path;
   element: ReactElement;
};

export enum Routes {
   firstVisit = '/first-visit',
   settings = '/settings',
   configuration = '/configuration',
   home = '/',
   menu = '/menu',
   networkExplorer = '/networks',
   networkCustomRuleBase = 'networks',
   addNetworkCustomRule = '/networks/add',
   organizationCustomRuleBase = 'organizations',
   addOrganizationCustomRule = '/organizations/add',
   organizationExplorer = '/organizations',
   notFound = '*',
}

export const DynamicRoutes = {
   networkCustomRule: (customRuleId: string) =>
      `${Routes.networkCustomRuleBase}/${customRuleId}`,
   organizationCustomRule: (customRuleId: string) =>
      `${Routes.organizationCustomRuleBase}/${customRuleId}`,
};
