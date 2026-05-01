/*
 * All software Copyright 2024 of Techniche Technologies Pty Ltd., All rights reserved.
 * Any redistribution or reproduction of part or all of the contents in any form is
 * prohibited without express written permission of the company.
 */

import { type QueryClient } from '@tanstack/react-query';
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import React from 'react';
import * as z from 'zod';

// Only load devtools in development mode
let TanStackRouterDevtools: any = () => null;
let ReactQueryDevtools: any = () => null;
//@ts-ignore
if (import.meta.env.MODE === 'development') {
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

const DiscoverySearchSchema = z.object({
   initial: z.boolean().optional().catch(false),
   device: z.string().optional(),
   mode: z.string().optional(),
   page: z.string().optional(),
   from: z.string().optional(),
   scheduleId: z.number().optional(),
   selectedIds: z.union([z.array(z.number()), z.enum(['all'])]).optional(),
   hasSchedule: z.boolean().optional().default(false),
});

export const Route = createRootRouteWithContext<{
   queryClient: QueryClient;
}>()({
   validateSearch: (search) =>
      DiscoverySearchSchema.parse({ ...search, mode: 'html', page: 'discovery-main' }),
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
