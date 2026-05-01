import { lazy } from 'react';
import { AppProvider } from './providers/AppProvider/AppProvider';
import { OaProvider } from '~/features/Table';

const RemoteAppRoutes = lazy(() =>
   import('./routes').then((module) => ({ default: module.RemoveAppRoutes }))
);

export function RemoteApp() {
   return (
      <AppProvider>
         <OaProvider>
            <RemoteAppRoutes />
         </OaProvider>
      </AppProvider>
   );
}

export default RemoteApp;
