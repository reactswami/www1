import { useDisclosure } from '@chakra-ui/react';
import { type ColumnDef, type PaginationState } from '@tanstack/react-table';
import { useState } from 'react';
import { EntityTable, type EntityTableProps } from '~/components/EntityTable';
import { FormEntity, FormLane } from '~/components/FormEntity';
import { Layout } from '~/components/Layout';
import { TableProvider, ModalAddForm } from '~/components/Table';
import { DEFAULT_TABLE_PAGE_SIZE } from '~/config/defaults';
import { FormEquipment } from '~/features/equipment';
import { useCreateEntity } from '~/hooks/useCreateEntity';
import { useFetchEntity } from '~/hooks/useFetchEntity';
import { type CreatePayload, generatePayloadForCreate } from '~/types/api';
import { type EntityType, type RowData } from '~/types/models';
import { ENTITY_TYPE } from '~/utils/constants';

interface Props {
   layoutTitle: string;
   modalTitle: string;
   columns: ColumnDef<RowData, any>[];
   tableProps: EntityTableProps;
}
const EFFICIENCY_ENTITY_TYPES = [ENTITY_TYPE.SCREENING_POINT, ENTITY_TYPE.LANE] as const;
const getDefaultLocationCategory = (entityType: EntityType) => {
   const hasEfficiencyTargets = (EFFICIENCY_ENTITY_TYPES as readonly string[]).includes(entityType);
   return ({ ...hasEfficiencyTargets && { locationCategory: "Front of House" } });
};

export function TableRoute({ layoutTitle, modalTitle, columns, tableProps }: Props) {
   const { isLoading, isError, isSuccess, data } = useFetchEntity(tableProps.entity);
   const { entity } = tableProps;
   const isEquipment = entity === ENTITY_TYPE.DEVICE_EQUIPMENT;

   const disclosure = useDisclosure();
   // The pagination has to be handled outside of the table so it isn't reset by the data polling
   const [paginationState, setPaginationState] = useState<PaginationState>({
      pageIndex: 0,
      pageSize: DEFAULT_TABLE_PAGE_SIZE,
   });

   const { isCreatingEntity: isCreatingEntity, createEntity: createAirport } = useCreateEntity({
      onCloseFormModal: disclosure.onClose,
      entity,
   });

   function onSubmit(data: RowData) {
      const body = generateCreateEntityPayload(data);
      createAirport(body);
   }

   const generateCreateEntityPayload = (data: RowData): CreatePayload => {
      return generatePayloadForCreate(entity, data);
   };

   function renderForm() {
      switch (entity) {
         case ENTITY_TYPE.LANE:
            return (
               <FormLane
                  onCancel={disclosure.onClose}
                  onSubmit={onSubmit}
                  isSubmitting={isCreatingEntity}
                  entityType={entity}
                  defaultValues={{ ...getDefaultLocationCategory(entity) }}
               />
            );

         default:
            return (
               <FormEntity
                  onCancel={disclosure.onClose}
                  onSubmit={onSubmit}
                  isSubmitting={isCreatingEntity}
                  entityType={entity}
                  defaultValues={{ ...getDefaultLocationCategory(entity) }}
               />
            );
      }
   }

   const EntityForm = isEquipment ? (
      <FormEquipment
         onCancel={disclosure.onClose}
         onSubmit={onSubmit}
         isSubmitting={isCreatingEntity}
      />
   ) : (
      renderForm()
   );

   return (
      <Layout subtitle={layoutTitle}>
         <ModalAddForm title={modalTitle} disclosure={disclosure} render={() => EntityForm} />
         <TableProvider
            columns={columns}
            data={data}
            isLoading={isLoading}
            isError={isError}
            isSuccess={isSuccess}
            addDisclosure={disclosure}
            paginationState={paginationState}
            setPaginationState={setPaginationState}
         >
            <EntityTable {...tableProps} />
         </TableProvider>
      </Layout>
   );
}
