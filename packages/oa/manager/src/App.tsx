import { lazy } from 'react';
import { AppProvider } from './providers/AppProvider/AppProvider';

const AppRoutes = lazy(() =>
   import('./routes').then((module) => ({ default: module.AppRoutes }))
);

export function App() {
   return (
      <AppProvider>
         <AppRoutes />
      </AppProvider>
   );
}

export default App;
