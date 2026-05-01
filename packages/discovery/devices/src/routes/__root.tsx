/*
 * All software Copyright 2024 of Techniche Technologies Pty Ltd., All rights reserved.
 * Any redistribution or reproduction of part or all of the contents in any form is
 * prohibited without express written permission of the company.
 */

import { type QueryClient } from '@tanstack/react-query';
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import React from 'react';
import '~/styles/index.css';

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
      <>
         <Outlet />
         <ReactQueryDevtools buttonPosition="top-right" />
         <TanStackRouterDevtools position="bottom-right" />
      </>
   );
}
