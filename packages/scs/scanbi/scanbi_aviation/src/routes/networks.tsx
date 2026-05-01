import { useDisclosure } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { type PaginationState } from '@tanstack/react-table';
import { useState } from 'react';
import { Layout, NetworkTable, TableProvider } from '~/components';
import { DEFAULT_TABLE_PAGE_SIZE } from '~/config';
import { AddNetworkModal, columns } from '~/features/networks';
import { networkQueryOptions } from '~/features/networks/queryOptions';

export const Route = createFileRoute('/networks')({
   component: NetworksRoute,
});

function NetworksRoute() {
   const disclosure = useDisclosure();
   const networks = useQuery(networkQueryOptions.get());
   const [paginationState, setPaginationState] = useState<PaginationState>({
      pageIndex: 0,
      pageSize: DEFAULT_TABLE_PAGE_SIZE,
   });

   return (
      <Layout subtitle={'Scanner Networks'}>
         <AddNetworkModal onClose={disclosure.onClose} isOpen={disclosure.isOpen} />
         <TableProvider
            isLoading={networks.isLoading}
            isError={networks.isError}
            isSuccess={networks.isSuccess}
            addDisclosure={disclosure}
            paginationState={paginationState}
            setPaginationState={setPaginationState}
            columns={columns}
            data={networks.data?.data}
         >
            <NetworkTable
               errorTitle="Error: Unable to retrieve the list of networks"
               errorDescription="If the problem persists, please contact the support team."
               noDataError="No Networks available"
               noFilteredDataError="No Network found for your search query"
               emptyStateAction="Add a network"
            />
         </TableProvider>
      </Layout>
   );
}
