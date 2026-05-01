import { type EntityType } from '~/types/models';
import { ENTITY_TYPE } from '~/utils/constants';
export type QueryKey = {
   [key in EntityType]: Array<string>;
};

/**
 * Contains the query keys for the queries
 * @see https://tanstack.com/query/v4/docs/guides/query-keys
 */
export const queryKeys: QueryKey = {
   airport: [ENTITY_TYPE.AIRPORT],
   screening_point: [ENTITY_TYPE.SCREENING_POINT],
   lane: [ENTITY_TYPE.LANE],
   terminal: [ENTITY_TYPE.TERMINAL],
   device_equipment: [ENTITY_TYPE.DEVICE_EQUIPMENT],
   equipment_type: [ENTITY_TYPE.EQUIPMENT_TYPE],
   all: [ENTITY_TYPE.ALL],
   scanner_network: [ENTITY_TYPE.NETWORKS],
   ct_certificate: [ENTITY_TYPE.CERTIFICATES],
};
