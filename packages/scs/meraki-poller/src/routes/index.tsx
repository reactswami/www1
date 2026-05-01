import { type ReactElement } from 'react';
import { useRoutes } from 'react-router-dom';
import { firstVisitRoutes, routes } from './routes';
import ErrorScreen from '~/components/ErrorBoundary/ErrorBoundary';
import { Loader } from '~/components/Loader';
import { useInitialSetup } from '~/hooks/useInitialSetup';

export const AppRoutes = (): ReactElement => {
   const { isLoading, isError, isFirstVisit } = useInitialSetup();
   const router = useRoutes(isFirstVisit ? firstVisitRoutes : routes);

   if (isLoading) {
      return <Loader message={'Retrieving your configuration'} />;
   }
   if (isError) {
      return (
         <ErrorScreen
            message={
               'Failed to contact the server. If the problem persists, please contact Statseeker support.'
            }
         />
      );
   }
   return <>{router}</>;
};
