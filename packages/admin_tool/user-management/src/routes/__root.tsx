/*
 * All software Copyright 2025 of Techniche Technologies Pty Ltd., All rights reserved.
 * Any redistribution or reproduction of part or all of the contents in any form is
 * prohibited without express written permission of the company.
 */

import { type QueryClient } from '@tanstack/react-query';
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import React, { Suspense } from 'react';
import { Loader } from '@statseeker/components';

// Only load devtools in development mode
let TanStackRouterDevtools: any = () => null;
let ReactQueryDevtools: any = () => null;
if (process.env.NODE_ENV === 'development') {
   TanStackRouterDevtools = React.lazy(() =>
      // Lazy load in development
      import('@tanstack/router-devtools').then((res) => ({
         default: res.TanStackRouterDevtools,
      }))
   );
   ReactQueryDevtools = React.lazy(() =>
      // Lazy load in development
      import('@tanstack/react-query-devtools').then((res) => ({
         default: res.ReactQueryDevtools,
      }))
   );
}

export const Route = createRootRouteWithContext<{
   queryClient: QueryClient;
}>()({
   component: RootRoute,
});

function RootRoute() {
   return (
      <Suspense fallback={<Loader />}>
         <Outlet />
         <ReactQueryDevtools buttonPosition="top-right" />
         <TanStackRouterDevtools position="bottom-right" />
      </Suspense>
   );
}