import { type QueryClient } from '@tanstack/react-query';
import { type AllEntities, type EntityType, ORDERED_ENTITIES, type RowData } from './models';
import { queryKeys } from '~/lib';
import { ENTITY_TYPE } from '~/utils/constants';

export type CreatePayload = any;
export type DeletePayload = Pick<RowData, 'id'>;
export type UpdatePayload = any;
export type UpdateEntityResponse = {
   message: string;
   status: 'ERROR' | 'SUCCESS';
};
export type FetchEntityResponseData = {
   meta: object;
   result: RowData[];
};
export type FetchEntityResponse = RowData[];

export const invalidateEntityQueries = (entityType: EntityType, queryClient: QueryClient) => {
   // Slice begins from the entity to the last one
   // Example: If entity type is screening_point, the slice begins
   // from screening_point and will include lane, and device_equipment
   // If the Entity Type is Airport then it will slice from aiport to
   // device_equipment.
   const queriesForInvalidation = ORDERED_ENTITIES.slice(
      ORDERED_ENTITIES.findIndex((en) => en.type == entityType),
      ORDERED_ENTITIES.length
   );

   if (queriesForInvalidation) {
      queriesForInvalidation.forEach((entity) =>
         queryClient.invalidateQueries({ queryKey: queryKeys[entity.type] })
      );
   }

   if (entityType === ENTITY_TYPE.NETWORKS) {
      queryClient.invalidateQueries({ queryKey: queryKeys.scanner_network });
   }

   queryClient.invalidateQueries({ queryKey: queryKeys.all });
};

// Generate payload
export const generatePayloadForCreate = (entityType: EntityType, data: RowData): CreatePayload => {
   const {
      title,
      airportId,
      terminalId,
      screeningPointId,
      laneId,
      passengerScanEfficiencyTargetCfg,
      locationCategory,
      checkedBaggageScanEfficiencyTargetCfg,
      carryOnBaggageScanEfficiencyTargetCfg,
      scanEfficiencyTargetCfg,
      ctWorkstationDecisionTimeTarget,
      traceScanEfficiencyTargetCfg
   } = data;

   switch (entityType) {
      case ENTITY_TYPE.AIRPORT:
         return { title };

      case ENTITY_TYPE.TERMINAL:
         return { title, airportId: Number(airportId) };

      case ENTITY_TYPE.SCREENING_POINT:
         return {
            title,
            airportId: Number(airportId),
            terminalId: Number(terminalId),
            locationCategory,
            ...(passengerScanEfficiencyTargetCfg !== null && {
               passengerScanEfficiencyTargetCfg: Number(passengerScanEfficiencyTargetCfg),
            }),
            ...(checkedBaggageScanEfficiencyTargetCfg !== null && {
               checkedBaggageScanEfficiencyTargetCfg: Number(checkedBaggageScanEfficiencyTargetCfg),
            }),
            ...(carryOnBaggageScanEfficiencyTargetCfg !== null && {
               carryOnBaggageScanEfficiencyTargetCfg: Number(carryOnBaggageScanEfficiencyTargetCfg),
            }),
            ...(traceScanEfficiencyTargetCfg !== null && {
               traceScanEfficiencyTargetCfg: Number(traceScanEfficiencyTargetCfg),
            }),
         };
      case ENTITY_TYPE.LANE:
         return {
            title,
            airportId: Number(airportId),
            terminalId: Number(terminalId),
            screeningPointId: Number(screeningPointId),
            ...(passengerScanEfficiencyTargetCfg !== null && {
               passengerScanEfficiencyTargetCfg: Number(passengerScanEfficiencyTargetCfg),
            }),
            ...(checkedBaggageScanEfficiencyTargetCfg !== null && {
               checkedBaggageScanEfficiencyTargetCfg: Number(checkedBaggageScanEfficiencyTargetCfg),
            }),
            ...(carryOnBaggageScanEfficiencyTargetCfg !== null && {
               carryOnBaggageScanEfficiencyTargetCfg: Number(carryOnBaggageScanEfficiencyTargetCfg),
            }),
            ...(traceScanEfficiencyTargetCfg !== null && {
               traceScanEfficiencyTargetCfg: Number(traceScanEfficiencyTargetCfg),
            }),
         };
      case ENTITY_TYPE.DEVICE_EQUIPMENT:
         return {
            ...data,
            airportId: Number(airportId),
            terminalId: Number(terminalId),
            screeningPointId: Number(screeningPointId),
            laneId: Number(laneId),
            ...(scanEfficiencyTargetCfg !== null && {
               scanEfficiencyTargetCfg: Number(scanEfficiencyTargetCfg),
            }),
            ...(ctWorkstationDecisionTimeTarget !== null &&
               Number.isNaN(ctWorkstationDecisionTimeTarget)
               ? { ctWorkstationDecisionTimeTarget: 0 }
               : {
                  ctWorkstationDecisionTimeTarget: Number(ctWorkstationDecisionTimeTarget),
               }),
         };
   }

   return data;
};

export const generatePayloadForUpdate = (entityType: EntityType, data: RowData): UpdatePayload => {
   const {
      id,
      title,
      airportId,
      terminalId,
      screeningPointId,
      laneId,
      passengerScanEfficiencyTargetCfg,
      locationCategory,
      checkedBaggageScanEfficiencyTargetCfg,
      carryOnBaggageScanEfficiencyTargetCfg,
      scanEfficiencyTargetCfg,
      ctWorkstationDecisionTimeTarget,
      traceScanEfficiencyTargetCfg
   } = data;

   switch (entityType) {
      case ENTITY_TYPE.AIRPORT:
         return { title, id };

      case ENTITY_TYPE.TERMINAL:
         return { id, title, airportId: Number(airportId) };

      case ENTITY_TYPE.SCREENING_POINT:
         return {
            id,
            title,
            airportId: Number(airportId),
            terminalId: Number(terminalId),
            locationCategory,
            ...(passengerScanEfficiencyTargetCfg !== null && {
               passengerScanEfficiencyTargetCfg: Number(passengerScanEfficiencyTargetCfg),
            }),
            ...(checkedBaggageScanEfficiencyTargetCfg !== null && {
               checkedBaggageScanEfficiencyTargetCfg: Number(checkedBaggageScanEfficiencyTargetCfg),
            }),
            ...(carryOnBaggageScanEfficiencyTargetCfg !== null && {
               carryOnBaggageScanEfficiencyTargetCfg: Number(carryOnBaggageScanEfficiencyTargetCfg),
            }),
            ...(traceScanEfficiencyTargetCfg !== null && {
               traceScanEfficiencyTargetCfg: Number(traceScanEfficiencyTargetCfg),
            }),
         };
      case ENTITY_TYPE.LANE:
         return {
            id,
            title,
            airportId: Number(airportId),
            terminalId: Number(terminalId),
            screeningPointId: Number(screeningPointId),
            ...(passengerScanEfficiencyTargetCfg !== null && {
               passengerScanEfficiencyTargetCfg: Number(passengerScanEfficiencyTargetCfg),
            }),
            ...(checkedBaggageScanEfficiencyTargetCfg !== null && {
               checkedBaggageScanEfficiencyTargetCfg: Number(checkedBaggageScanEfficiencyTargetCfg),
            }),
            ...(carryOnBaggageScanEfficiencyTargetCfg !== null && {
               carryOnBaggageScanEfficiencyTargetCfg: Number(carryOnBaggageScanEfficiencyTargetCfg),
            }),
            ...(traceScanEfficiencyTargetCfg !== null && {
               traceScanEfficiencyTargetCfg: Number(traceScanEfficiencyTargetCfg),
            }),
         };
      case ENTITY_TYPE.DEVICE_EQUIPMENT:
         return {
            ...data,
            airportId: Number(airportId),
            terminalId: Number(terminalId),
            screeningPointId: Number(screeningPointId),
            laneId: Number(laneId),
            ...(scanEfficiencyTargetCfg !== null && {
               scanEfficiencyTargetCfg: Number(scanEfficiencyTargetCfg),
            }),
            ...(ctWorkstationDecisionTimeTarget !== null &&
               Number.isNaN(ctWorkstationDecisionTimeTarget)
               ? { ctWorkstationDecisionTimeTarget: 0 }
               : {
                  ctWorkstationDecisionTimeTarget: Number(ctWorkstationDecisionTimeTarget),
               }),
         };
   }

   return data;
};

export type FetchAllEntitiesResponse = {
   meta: object;
   result: AllEntities;
};
