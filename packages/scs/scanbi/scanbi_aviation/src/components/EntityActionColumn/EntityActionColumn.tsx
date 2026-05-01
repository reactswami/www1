import { Flex, useDisclosure } from '@chakra-ui/react';
import { createColumnHelper } from '@tanstack/react-table';
import { memo } from 'react';
import { type SubmitHandler } from 'react-hook-form';
import { FormEntity, FormLane } from '~/components/FormEntity';
import { TableDeleteButton, TableEditButton } from '~/components/Table';
import { deleteWarningMessage } from '~/config/messages';
import { FormEquipment } from '~/features/equipment';
import { useDeleteEntity } from '~/hooks/useDeleteEntity';
import { useUpdateEntity } from '~/hooks/useUpdateEntity';
import { generatePayloadForUpdate } from '~/types/api';
import { type EntityType, type RowData } from '~/types/models';
import { ENTITY_TYPE } from '~/utils/constants';

interface Props {
   entityType: EntityType;
   title: string;
   warningType: string;
}

const columnHelper = createColumnHelper<RowData>();
export const EntityActionColumn = ({ entityType, title, warningType }: Props) => {
   const isEquipment = entityType === ENTITY_TYPE.DEVICE_EQUIPMENT;
   return columnHelper.display({
      id: 'actions',
      header: 'Actions',
      enableGlobalFilter: false,
      enableSorting: false,
      size: 0,
      cell: memo(
         ({
            cell: {
               row: { original: entity },
            },
         }) => {
            const disclosure = useDisclosure();
            const deleteDisclosure = useDisclosure();
            const { updateEntity, isUpdatingEntity } = useUpdateEntity({
               onCloseFormModal: disclosure.onClose,
               entity: entityType,
            });
            const name = isEquipment ? entity.name : entity.title;
            const { isPending, mutate } = useDeleteEntity({
               id: entity.id,
               name: name,
               entity: entityType,
            });
            const onSubmit: SubmitHandler<RowData> = (data) => {
               const body = generatePayloadForUpdate(entityType, data);
               updateEntity(body);
            };

            const confirmDelete = async () => {
               await mutate();
               deleteDisclosure.onClose();
            };

            function renderForm() {
               switch (entityType) {
                  case ENTITY_TYPE.LANE:
                     return (
                        <FormLane
                           isSubmitting={isUpdatingEntity}
                           onSubmit={onSubmit}
                           id={entity?.id}
                           defaultValues={{
                              ...entity,
                           }}
                           onCancel={disclosure.onClose}
                           entityType={entityType}
                        />
                     );

                  default:
                     return (
                        <FormEntity
                           isSubmitting={isUpdatingEntity}
                           onSubmit={onSubmit}
                           id={entity?.id}
                           defaultValues={{
                              ...entity,
                           }}
                           onCancel={disclosure.onClose}
                           entityType={entityType}
                        />
                     );
               }
            }

            const formEntity = isEquipment ? (
               <FormEquipment
                  isSubmitting={isUpdatingEntity}
                  onSubmit={onSubmit}
                  id={entity?.id}
                  defaultValues={{
                     ...entity,
                  }}
                  onCancel={disclosure.onClose}
               />
            ) : (
               renderForm()
            );

            return (
               <Flex gap="sm">
                  <TableEditButton
                     title={title}
                     disclosure={disclosure}
                     render={() => formEntity}
                  />
                  <TableDeleteButton
                     disclosure={deleteDisclosure}
                     isLoading={isPending}
                     handleConfirm={confirmDelete}
                     warningMessage={deleteWarningMessage(warningType, name)}
                  />
               </Flex>
            );
         }
      ),
   });
};
