/*
 * All software Copyright 2024 of Techniche Technologies Pty Ltd., All rights reserved.
 * Any redistribution or reproduction of part or all of the contents in any form is
 * prohibited without express written permission of the company.
 */

import { Button, Flex, Heading, Box, Text } from '@chakra-ui/react';
import { AdminLayout, AdminPage } from '@statseeker/components';
import { Link, createRootRouteWithContext } from '@tanstack/react-router';
import React from 'react';
import * as z from 'zod';

/* The URL Params that this route uses */
const rootSchema = z.object({
   mySearchParam: z.number().optional().default(0),
});

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

export const Route = createRootRouteWithContext<{}>()({
   component: RootRoute,
   validateSearch: (search) => rootSchema.parse(search),
});

function RootRoute() {
   const { mySearchParam } = Route.useSearch();

   return (
      <>
         <AdminLayout
            title="Page Title"
            subtitle="Page Sub-Title"
         >
            <AdminPage className='uniqueRouteClassForQA'>
               <Heading size="lg" className="text-2xl font-normal">
                  Page Heading
               </Heading>
               <Box h="5"></Box>
               <Text>This is some page body content text.</Text>
               <Box h="5"></Box>
               <Link
                  to=""
                  search={(prev) => ({
                     ...prev,
                     mySearchParam: mySearchParam + 1,
                  })} /* Preserve URL params */
               >
                  <Button variant="outline" className="uniqueButtonClassForQA">
                     Button to increment url param ({mySearchParam})
                  </Button>
               </Link>
            </AdminPage>
         </AdminLayout>
         <ReactQueryDevtools buttonPosition="top-right" />
         <TanStackRouterDevtools position="bottom-right" />
      </>
   );
}
