import { Button } from '@chakra-ui/react';
import { AdminLayout, AdminPage } from '@statseeker/components';
import { AdminManageListPage, getAddButtonDef, getCopyButtonDef, getDeleteButtonDef } from '@statseeker/components/Legacy/AdminManageList';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Link, createFileRoute } from '@tanstack/react-router';
import { useMemo } from 'react';
import * as z from 'zod';
import useCredentialsList from './-hooks/useCredentialsList';
import { getCredentialsWithDeviceCountQuery } from '~/lib/ReactQuery';
import { type SNMPCredentialListEntry } from '~/types';
import './-styles/root.css';

const CredentialsSchema = z.object({
   text_filter: z.string().optional(),
   sort: z.string().default('name').optional(),
   dir: z.enum(['asc', 'desc']).default('asc').optional(),
   limit: z.number().optional(),
   selectedIds: z.array(z.number()).optional(),
});

export const Route = createFileRoute('/_credentials')({
   component: CredentialsLayout,
   validateSearch: (search) => CredentialsSchema.parse(search),
   loaderDeps: ({ search: { text_filter, sort, dir, limit } }) => ({
      text_filter,
      sort,
      dir,
      limit,
   }),
   loader: async ({ context, deps }) =>
      await context?.queryClient.ensureQueryData(getCredentialsWithDeviceCountQuery(deps)),
});

function CredentialsLayout() {
   const {
      data: { data_total, credentials, success },
   } = useSuspenseQuery(getCredentialsWithDeviceCountQuery(Route.useLoaderDeps()));
   const { selectedIds } = Route.useSearch();

   const {
      snmpCredentialColumns,
   } = useCredentialsList();

   const buttonDefs = useMemo(() => {
      return [
         getAddButtonDef(Route.id),
         getDeleteButtonDef(Route.id, selectedIds),
         getCopyButtonDef(Route.id, selectedIds),
      ];
   }, [selectedIds]);

   const datatableProps = useMemo(() => ({
      columns: snmpCredentialColumns,
   }), [snmpCredentialColumns]);

   return (
      <AdminLayout
         title="SNMP Credentials"
         subtitle="Manage SNMP Credentials"
      >
         <AdminPage className='snmp-credentials' flexDirection='row'>
            <AdminManageListPage<SNMPCredentialListEntry>
               dataLabel='SNMP Credential'
               routeId={Route.id}
               buttonDefs={buttonDefs}
               data={credentials}
               dataTotal={data_total}
               success={success}
               datatableProps={datatableProps}
            />
         </AdminPage>
      </AdminLayout>
   );
}
