import { useCallback, useState } from 'react';
import { type EntityTypAheadProps } from '~/components/EntityTypehead';
import { useTableContext } from '~/components/Table';
import {
   type EntityState,
   type EntityUpdatePayload,
} from '~/types';
import { type EntityFilter, type EntityTitle, type EntityType, type RowData } from '~/types/models';
import { ENTITY_TYPE } from '~/utils/constants';

interface EntityStateRet {
   setSaving: (saving: boolean) => void;
   getEntityPayload: (entity: EntityType) => Partial<EntityUpdatePayload>;
   registerFilterEntity: (
      entity: EntityType,
      entityTitle: EntityTitle
   ) => EntityTypAheadProps<RowData>;
   registerEntity: (entity: EntityType) => EntityTypAheadProps<RowData>;
   validateEntity: (entity: EntityType) => boolean;
}

const defaultEntityState: EntityState = {
   airportId: 0,
   terminalId: 0,
   laneId: 0,
   screeningPointId: 0,
   isSaving: false,
};

export const useEntityFilter = (): Pick<EntityStateRet, 'registerFilterEntity'> => {
   const { table } = useTableContext();
   const [entityState, setEntityState] = useState<EntityState>({
      ...defaultEntityState,
   });

   const filterEntityId = useCallback(
      (param: EntityFilter, entityTitle: EntityTitle) => (id: Number, title: string) => {
         const col = table.getColumn(entityTitle);
         if (title === '') {
            col?.setFilterValue('');
         } else {
            col?.setFilterValue(title ?? '');
         }
         setEntityState((prev) => {
            return { ...prev, [param]: id };
         });
      },
      []
   );

   const registerFilterEntity = (
      entity: EntityType,
      entityTitle: EntityTitle
   ): EntityTypAheadProps<RowData> => {
      const filter = { isFilter: true };
      const { airportId, terminalId, laneId, screeningPointId } = entityState;
      switch (entity) {
         case ENTITY_TYPE.AIRPORT:
            return {
               label: 'Airport',
               entity: entity,
               entityId: airportId ?? 0,
               ...filter,
               setFilter: filterEntityId('airportId', entityTitle),
            };

         case ENTITY_TYPE.TERMINAL:
            return {
               label: 'Terminal',
               entity: entity,
               entityId: terminalId ?? 0,
               entityFilter: 'airportId',
               entityFilterId: airportId,
               ...filter,
               setFilter: filterEntityId('terminalId', entityTitle),
            };

         case ENTITY_TYPE.SCREENING_POINT:
            return {
               label: 'Screening Point',
               entity: entity,
               entityId: screeningPointId ?? 0,
               entityFilter: 'terminalId',
               entityFilterId: terminalId,
               ...filter,
               setFilter: filterEntityId('screeningPointId', entityTitle),
            };
         case ENTITY_TYPE.LANE:
            return {
               label: 'Lane',
               entity: entity,
               entityId: laneId ?? 0,
               entityFilter: 'screeningPointId',
               entityFilterId: screeningPointId,
               ...filter,
               setFilter: filterEntityId('laneId', entityTitle),
            };
      }

      return {
         label: 'Unknown',
         entity: 'airport',
         entityId: airportId ?? 0,
         ...filter,
         setFilter: filterEntityId('airportId', entityTitle),
      };
   };

   return {
      registerFilterEntity,
   };
};
export const useEntityState = (
   initialState: EntityState
): Omit<EntityStateRet, 'registerFilterEntity'> => {
   const [entityState, setEntityState] = useState<EntityState>({
      ...initialState,
      isSaving: false,
   });

   const setSaving = (saving: boolean): void => {
      setEntityState((prev) => ({ ...prev, isSaving: saving }));
   };

   const filterEntityId = useCallback(
      (param: EntityFilter) => (id: Number) =>
         setEntityState((prev) => {
            return { ...prev, [param]: id };
         }),
      []
   );

   const registerEntity = (entity: EntityType): EntityTypAheadProps<RowData> => {
      const { airportId, terminalId, laneId, screeningPointId, isSaving } = entityState;
      const reqFields = { isRequired: true, isSave: isSaving, isFilter: false };

      switch (entity) {
         case ENTITY_TYPE.AIRPORT:
            return {
               label: 'Airport',
               entity: entity,
               entityId: airportId ?? 0,
               ...reqFields,
               setFilter: filterEntityId('airportId'),
            };
         case ENTITY_TYPE.TERMINAL:
            return {
               label: 'Terminal',
               entity: entity,
               entityId: terminalId ?? 0,
               entityFilter: 'airportId',
               entityFilterId: airportId,
               ...reqFields,
               setFilter: filterEntityId('terminalId'),
            };
         case ENTITY_TYPE.SCREENING_POINT:
            return {
               label: 'Screening Point',
               entity: entity,
               entityId: screeningPointId ?? 0,
               entityFilter: 'terminalId',
               entityFilterId: terminalId,
               ...reqFields,
               setFilter: filterEntityId('screeningPointId'),
            };
         case ENTITY_TYPE.LANE:
            return {
               label: 'Lane',
               entity: entity,
               entityId: laneId ?? 0,
               entityFilter: 'screeningPointId',
               entityFilterId: screeningPointId,
               ...reqFields,
               setFilter: filterEntityId('laneId'),
            };
      }

      return {
         label: 'Unknown',
         entity: ENTITY_TYPE.AIRPORT,
         entityId: airportId ?? 0,
         ...reqFields,
         setFilter: filterEntityId('airportId'),
      };
   };

   const validateEntity = (entity: EntityType): boolean => {
      const { airportId, terminalId, laneId, screeningPointId } = entityState;
      switch (entity) {
         case ENTITY_TYPE.SCREENING_POINT:
            return airportId !== 0 && terminalId !== 0;
         case ENTITY_TYPE.DEVICE_EQUIPMENT:
            return airportId !== 0 && terminalId !== 0 && laneId !== 0 && screeningPointId !== 0;
         case ENTITY_TYPE.LANE:
            return airportId !== 0 && terminalId !== 0 && screeningPointId !== 0;
         case ENTITY_TYPE.TERMINAL:
            return airportId !== 0;
         case ENTITY_TYPE.AIRPORT:
            // Airport does not need other enities to create, so returning true
            return true;
      }
      return false;
   };

   const getEntityPayload = (entity: EntityType): Partial<EntityUpdatePayload> => {
      const { airportId, terminalId, laneId, screeningPointId } = entityState;
      switch (entity) {
         case ENTITY_TYPE.SCREENING_POINT:
            return {
               airportId: airportId?.toString(),
               terminalId: terminalId?.toString(),
            };
         case ENTITY_TYPE.DEVICE_EQUIPMENT:
            return {
               airportId: airportId?.toString(),
               terminalId: terminalId?.toString(),
               laneId: laneId?.toString(),
               screeningPointId: screeningPointId?.toString(),
            };
         case ENTITY_TYPE.LANE:
            return {
               airportId: airportId?.toString(),
               terminalId: terminalId?.toString(),
               screeningPointId: screeningPointId?.toString(),
            };
         case ENTITY_TYPE.TERMINAL:
            return {
               airportId: airportId?.toString(),
            };
      }
      return {
         airportId: airportId?.toString(),
         terminalId: terminalId?.toString(),
         laneId: laneId?.toString(),
         screeningPointId: screeningPointId?.toString(),
      };
   };

   return {
      setSaving,
      getEntityPayload,
      registerEntity,
      validateEntity,
   };
};
