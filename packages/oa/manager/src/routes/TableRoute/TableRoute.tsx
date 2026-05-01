import { AdminLayout } from '@statseeker/components';
import { type PaginationState } from '@tanstack/react-table';
import { useState } from 'react';
import { OaTableProvider, MemoizedTable as Table } from '~/features/Table';
import { UseFetchOaTableData } from '~/hooks';

export const TableRoute = () => {
   const { isLoading, isError, isSuccess, data } = UseFetchOaTableData();
   // The pagination has to be handled outside of the table so it isn't reset by the data polling
   const [paginationState, setPaginationState] = useState<PaginationState>({
      pageIndex: 0,
      pageSize: 20,
   });
   return (
      <AdminLayout
         title="Observability Appliances"
         subtitle="Observability Appliance Management"
      >
         <OaTableProvider
            Oas={data ?? []}
            isLoading={isLoading}
            isError={isError}
            isSuccess={isSuccess}
            paginationState={paginationState}
            setPaginationState={setPaginationState}
         >
            <Table />
         </OaTableProvider>
      </AdminLayout>
   );
};
