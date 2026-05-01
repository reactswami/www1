import { Flex, Text, useDisclosure } from '@chakra-ui/react';
import { createColumnHelper } from '@tanstack/react-table';
import { memo } from 'react';
import { NetworkForm, TableDeleteButton, TableEditButton } from '~/components';
import { TestConnectionButton } from '~/components/Table/TestConnectionButton/TestConnectionButton';
import { deleteWarningMessage } from '~/config';
import { useDeleteEntity, useUpdateEntity } from '~/hooks';
import { type RowData, type NewNetwork } from '~/types';
import { ENTITY_TYPE } from '~/utils/constants';

const columnHelper = createColumnHelper<RowData>();

export const columns = [
   columnHelper.accessor('scannerNetworkTitle', {
      header: 'Network',
      enableColumnFilter: false,
      cell: (info) => <Text whiteSpace={'nowrap'}>{info.getValue() ?? '-'}</Text>,
   }),
   columnHelper.accessor('scannerNetworkIpaddress', {
      header: 'IP Address',
      enableColumnFilter: false,
      cell: (info) => <Text whiteSpace={'nowrap'}>{info.getValue() ?? '-'}</Text>,
   }),
   columnHelper.accessor('scannerNetworkPort', {
      header: 'Port',
      enableColumnFilter: false,
      cell: (info) => <Text whiteSpace={'nowrap'}>{info.getValue() ?? '-'}</Text>,
   }),
   columnHelper.accessor('scannerNetworkType', {
      header: 'Type',
      enableColumnFilter: false,
      cell: (info) => <Text whiteSpace={'nowrap'}>{info.getValue() ?? '-'}</Text>,
   }),
   columnHelper.display({
      id: 'actions',
      header: 'Actions',
      enableGlobalFilter: false,
      enableSorting: false,
      size: 0,
      cell: memo(
         ({
            cell: {
               row: { original: network },
            },
         }) => {
            const disclosure = useDisclosure();
            const deleteDisclosure = useDisclosure();
            const { isPending, mutate } = useDeleteEntity({
               id: network.id,
               name: network.scannerNetworkTitle,
               entity: ENTITY_TYPE.NETWORKS,
            });

            const confirmDelete = async () => {
               mutate();
               deleteDisclosure.onClose();
            };

            const { updateEntity, isUpdatingEntity } = useUpdateEntity({
               onCloseFormModal: disclosure.onClose,
               entity: ENTITY_TYPE.NETWORKS,
            });

            const onSubmit = (data: NewNetwork) => {
               updateEntity(data);
            };

            const Form = (
               <NetworkForm
                  onSubmit={onSubmit}
                  isSubmitting={isUpdatingEntity}
                  onCancel={disclosure.onClose}
                  id={network.id}
                  defaultValues={network}
               />
            );

            return (
               <Flex gap="sm" alignItems={'center'}>
                  <TableEditButton
                     title={network.scannerNetworkTitle}
                     disclosure={disclosure}
                     render={() => Form}
                  />
                  <TestConnectionButton id={network.id} />
                  <TableDeleteButton
                     disclosure={deleteDisclosure}
                     isLoading={isPending}
                     handleConfirm={confirmDelete}
                     warningMessage={deleteWarningMessage('network', network.scannerNetworkTitle)}
                  />
               </Flex>
            );
         }
      ),
   }),
];
