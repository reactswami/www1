/*
 * All software Copyright 2024 of Techniche Technologies Pty Ltd., All rights reserved.
 * Any redistribution or reproduction of part or all of the contents in any form is
 * prohibited without express written permission of the company.
 */

import { AdminLayout, AdminPage } from '@statseeker/components';
import { AdminManageListPage, getAddButtonDef, getDeleteButtonDef, getCopyButtonDef } from '@statseeker/components/Legacy/AdminManageList';
import { ROWS_PER_PAGE } from '@statseeker/components/Legacy/SSDataTable';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createRootRouteWithContext, useNavigate } from '@tanstack/react-router';
import React, { useMemo } from 'react';
import * as z from 'zod';
import { type AllRoutesContext } from '../main';
import useRangesList from './-hooks/useRangesList';
import { getRangesQuery } from '~/lib/ReactQuery';
import { type IpRangeListEntry } from '~/types';
import './-styles/root.css';


// Only load devtools in development mode
let TanStackRouterDevtools: any = () => null;
let ReactQueryDevtools: any = () => null;
// @ts-ignore
if (import.meta.env.MODE === 'development') {
   TanStackRouterDevtools = React.lazy(() =>
      import('@tanstack/router-devtools').then((res) => ({
         default: res.TanStackRouterDevtools,
      }))
   );
   ReactQueryDevtools = React.lazy(() =>
      import('@tanstack/react-query-devtools').then((res) => ({
         default: res.ReactQueryDevtools,
      }))
   );
}


const rootSchema = z.object({
   text_filter: z.string().optional(),
   sort: z.string().optional().default('name'),
   dir: z.enum(['asc', 'desc']).optional().default('asc'),
   limit: z.number().optional().default(ROWS_PER_PAGE),
   selectedIds: z.array(z.number()).optional(),
   enabled_filter: z.number().min(0).max(1).optional(),
});


export const Route = createRootRouteWithContext<AllRoutesContext>()({
   component: RootRoute,
   validateSearch: (search) => rootSchema.parse(search),
   loaderDeps: ({ search: { text_filter, sort, dir, limit, selectedIds, enabled_filter } }) => ({
      text_filter,
      sort,
      dir,
      limit,
      selectedIds,
      enabled_filter,
   }),
   loader: async ({ context, deps }) =>
      await context?.queryClient.ensureQueryData(getRangesQuery(deps)),
});


function RootRoute() {
   const loaderDeps = Route.useLoaderDeps();
   const {
      data: { data_total, data, success },
   } = useSuspenseQuery(getRangesQuery(loaderDeps));
   const navigate = useNavigate();
   const { selectedIds, enabled_filter } = Route.useSearch();

   const filterActions = useMemo(() => {
      function filterByEnabled(enabled?: 0 | 1) {
         navigate({
            search: (prev: any): any => ({
               ...prev,
               enabled_filter: enabled,
            }),
         });
      }
      return {
         'Show all': () => filterByEnabled(),
         'Show enabled': () => filterByEnabled(1),
         'Show disabled': () => filterByEnabled(0),
      };
   }, [navigate]);

   const {
      ipRangeColumns,
      toggleLabel,
      useToggleRanges,
   } = useRangesList({ getRangesToModifyParams: loaderDeps, data, selectedIds });

   // FYI a mutation isn't referentially stable, but the mutate function is, so always destructure
   const { mutate: toggleRanges } = useToggleRanges();

   const buttonDefs = useMemo(() => {
      return [
         getAddButtonDef(Route.id),
         {
            text: toggleLabel,
            buttonProps: {
               className: 'Toggle',
               isDisabled: selectedIds === undefined || selectedIds?.length === 0,
               onClick: () => toggleRanges(),
            }
         },
         getDeleteButtonDef(Route.id, selectedIds),
         getCopyButtonDef(Route.id, selectedIds),
      ];
   }, [selectedIds, toggleLabel, toggleRanges]);

   const datatableProps = useMemo(() => ({
      columns: ipRangeColumns,
      rowClassRules: {
         'disabled': ({data}: {data: IpRangeListEntry}) => (data?.enabled !== 1)
      }
   }), [ipRangeColumns]);

   return (
      <>
         <AdminLayout
            title="IP Address Ranges"
            subtitle="Manage Ranges"
         >
            <AdminPage className='ip-ranges' flexDirection='row'>
               <AdminManageListPage<IpRangeListEntry>
                  dataLabel='IP Address Range'
                  routeId={Route.id}
                  buttonDefs={buttonDefs}
                  filterActions={filterActions}
                  activeFilter={enabled_filter === 0 ? 'Show disabled' : (enabled_filter === 1 ? 'Show enabled' : undefined)}
                  data={data}
                  dataTotal={data_total}
                  success={success}
                  datatableProps={datatableProps}
               />
            </AdminPage>
         </AdminLayout>
         <ReactQueryDevtools buttonPosition="top-right" />
         <TanStackRouterDevtools position="bottom-right" />
      </>
   );
}
