export const ENTITY_TYPE = Object.freeze({
   AIRPORT: 'airport',
   TERMINAL: 'terminal',
   LANE: 'lane',
   SCREENING_POINT: 'screening_point',
   DEVICE_EQUIPMENT: 'device_equipment',
   EQUIPMENT_TYPE: 'equipment_type',
   ALL: 'all',
   LOCATION_CATEGORY: 'location_category',
   NETWORKS: 'scanner_network',
   CERTIFICATES: 'ct_certificate',
});

export const MODE = Object.freeze({
   ADD: 'add',
   UPDATE: 'update',
   DELETE: 'delete',
   GET: 'get',
   TEST_NETWORK: 'test_scanner_api',
});

export const LOCATION_CATEGORY = Object.freeze({
   BACK_OF_HOUSE: 'Back of House',
   FRONT_OF_HOUSE: 'Front of House',
});
