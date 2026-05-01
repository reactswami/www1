import { ChevronLeftIcon } from '@chakra-ui/icons';
import { AdminLayout, Button } from '@statseeker/components';
import { type PaginationState } from '@tanstack/react-table';
import { useState } from 'react';
import { FormDownloadNewOaModal, ModalAddForm } from '~/components';
import { OaTableProvider, MemoizedTable as Table, useOaContext } from '~/features/Table';
import { useCreateOa } from '~/hooks';
import { UseFetchOaTableData } from '~/hooks/useFetchOaTableData';

export const RemoteTableRoute = () => {
   const { groupId } = useOaContext();
   const { isLoading, isError, isSuccess, data } = UseFetchOaTableData(groupId);
   // The pagination has to be handled outside of the table so it isn't reset by the data polling
   const [paginationState, setPaginationState] = useState<PaginationState>({
      pageIndex: 0,
      pageSize: 20,
   });

   const { isCreatingOa, openCreate, isCreateOpen, closeCreate,
      onSubmit: createSubmit, isNewDownloadOpen, closeNewDownload, newOaName } =
      useCreateOa();
   const createProps = {
      isOpen: isCreateOpen,
      onClose: closeCreate,
      isCreatingOa,
      onSubmit: createSubmit,
   };

   return (
      <AdminLayout
         title="Manage Devices"
         subtitle="Observability Appliances"
         buttonComponent={<Button variant='primary' onClick={openCreate}>Create</Button>}
         customBackButtonComponent={
            <Button
               variant="link"
               icon={<ChevronLeftIcon />}
               onClick={() => {
                  history.back();
               }}
            >
               {'Back to Main Menu'}
            </Button>
         }
      >
         <OaTableProvider
            Oas={data ?? []}
            isLoading={isLoading}
            isError={isError}
            isSuccess={isSuccess}
            paginationState={paginationState}
            setPaginationState={setPaginationState}
         >
            <ModalAddForm {...createProps} />
            <FormDownloadNewOaModal
               isOpen={isNewDownloadOpen}
               onClose={closeNewDownload}
               newOaName={newOaName ?? ''}
            />
            <Table />
         </OaTableProvider>

      </AdminLayout>

   );
};
