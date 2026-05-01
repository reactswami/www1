import { lazy } from 'react';
import { type RouteDefinition, Routes } from '~/types';


const InitialSetupWizardRoutes = lazy(() => import('~/features/initialWizard'));
const Menu = lazy(() => import('~/features/menu/routes/MenuRoute'));
const NetworkExplorerRoutes = lazy(() => import('~/features/networks/routes'));
const OrganizationTableRoutes = lazy(
   () => import('~/features/organizations/routes')
);
const PageNotFound = lazy(() => import('~/features/misc'));
const SettingsRoutes = lazy(() => import('~/features/settings'));

export const firstVisitRoutes: RouteDefinition[] = [
   {
      path: '*',
      element: <InitialSetupWizardRoutes />,
   },
];

export const routes: RouteDefinition[] = [
   { path: Routes.home, element: <Menu /> },
   {
      path: Routes.menu,
      element: <Menu />,
   },
   {
      path: Routes.settings,
      element: <SettingsRoutes />,
   },
   {
      path: `${Routes.networkExplorer}/*`,
      element: <NetworkExplorerRoutes />,
   },
   {
      path: `${Routes.organizationExplorer}/*`,
      element: <OrganizationTableRoutes />,
   },
   // Not found page, default behavior for anything not matching above routes
   {
      path: Routes.notFound,
      element: <PageNotFound />,
   },
];
