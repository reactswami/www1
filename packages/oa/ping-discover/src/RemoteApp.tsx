import { lazy } from 'react';
import { AppProvider } from './providers/AppProvider/AppProvider';
import { type PingDiscoverProps } from './types';

const RemoteAppRoutes = lazy(() =>
   import('./routes').then((module) => ({ default: module.RemoteAppRoutes }))
);

export function RemoteApp(props: PingDiscoverProps) {
   return (
      <AppProvider>
         <RemoteAppRoutes {...props} />
      </AppProvider>
   );
}

export default RemoteApp;
