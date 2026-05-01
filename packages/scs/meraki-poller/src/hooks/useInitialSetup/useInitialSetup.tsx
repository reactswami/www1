import { useState } from 'react';
import { useFetchGlobalConfig } from '..';

/*
 * This hook does a few job to bootstrap the application:
 *  1. Fetch the global configuration
 *  2. Intialise the context, with the configuration
 *  3. Check if it's the first vist - if so, the user is redirected to the first-visit page
 */
export const useInitialSetup = () => {
   const [isFirstVisit, setIsFirstVisit] = useState<undefined | boolean>(undefined);

   const result = useFetchGlobalConfig({
      customQueryKeys: ['config', 'firstVisit'],
      onSuccess: (data) => {
         setIsFirstVisit(!data.data.api_key);
      },
   });

   return {
      isFirstVisit,
      setIsFirstVisit,
      ...result,
   };
};
