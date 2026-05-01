import { type FieldValues } from 'react-hook-form';
import { ENTITY_TYPE } from '~/utils/constants';

export type EntityType =
   | 'airport'
   | 'lane'
   | 'screening_point'
   | 'terminal'
   | 'device_equipment'
   | 'equipment_type'
   | 'all'
   | 'scanner_network'
   | 'ct_certificate';
export type EntityFilter = 'airportId' | 'terminalId' | 'screeningPointId' | 'laneId';
export type EntityTitle =
   | 'airportTitle'
   | 'terminalTitle'
   | 'screeningPointTitle'
   | 'laneTitle'
   | 'title';

export interface Equipment extends FieldValues {
   id: number;
   name: string;
   airportId: number;
   airportTitle: string;
   terminalId: number;
   terminalTitle: string;
   screeningPointId: number;
   screeningPointTitle: string;
   laneId: number;
   laneTitle: string;
   modelName: string;
   equipmentType: string;
   ipaddress: string;
   firmware?: string;
   productLine: string;
   serialNumber?: string;
   longitude: string;
   latitude: string;
   status: string;
   actions: string;
   scanEfficiencyTargetCfg?: number;
   algorithmVersion?: string;
   networkId?: number;
   ctWorkstationScanners?: string;
   ctWorkstationDecisionTimeTarget?: number;
}

export interface EquipmentForm extends FieldValues {
   id: number;
   name: string;
   airportId: number;
   airportTitle: string;
   terminalId: number;
   terminalTitle: string;
   screeningPointId: number;
   screeningPointTitle: string;
   laneId: number;
   laneTitle: string;
   modelName: string;
   equipmentType: string;
   ipaddress: string;
   firmware?: string;
   productLine: string;
   serialNumber?: string;
   longitude: string;
   latitude: string;
   status: string;
   actions: string;
   scanEfficiencyTargetCfg?: number;
   algorithmVersion?: string;
   networkId?: number;
   ctWorkstationScanners?: string[];
   ctWorkstationDecisionTimeTarget?: number;
}

export interface Airport extends FieldValues {
   id: number;
   title: string;
}

export interface ScreeningPoint extends FieldValues {
   id: number;
   title: string;
   airportId: number;
   airportTitle: string;
   terminalId: number;
   terminalTitle: string;
   passengerScanEfficiencyTargetCfg?: number;
   checkedBaggageScanEfficiencyTarget?: number;
   locationCategory: string;
   checkedBaggageScanEfficiencyTargetCfg?: number;
   carryOnBaggageScanEfficiencyTargetCfg?: number;
   traceScanEfficiencyTargetCfg?: number;
}

export interface Lane extends FieldValues {
   id: number;
   title: string;
   airportId: number;
   terminalId: number;
   screeningPointId: number;
   passengerScanEfficiencyTargetCfg?: number;
   checkedBaggageScanEfficiencyTargetCfg?: number;
   carryOnBaggageScanEfficiencyTargetCfg?: number;
   traceScanEfficiencyTargetCfg?: number;
}

export interface Terminal extends FieldValues {
   id: number;
   airportId: number;
   airportTitle: string;
   title: string;
   name: string;
}

export interface EquipmentType {
   [key: string]: null | { [subKey: string]: Array<string> };
}

export type RowData = Airport &
   ScreeningPoint &
   Lane &
   Equipment &
   Network &
   Certificate &
   EquipmentForm;

export const ENTITY_TITLE_AIRPORT: EntityTitle = 'airportTitle';
export const ENTITY_TITLE_TERMINAL: EntityTitle = 'terminalTitle';
export const ENTITY_TITLE_SCREENING_POINT: EntityTitle = 'screeningPointTitle';
export const ENTITY_TITLE_LANE: EntityTitle = 'laneTitle';
export const ENTITY_TITLE_EQUIPMENT: EntityTitle = 'title';

//CAUTION: The order should not be altered, it's used to render
// the filters in each of the pages in the expected order.
export const ORDERED_ENTITIES: { type: EntityType; title: EntityTitle }[] = [
   { type: ENTITY_TYPE.AIRPORT, title: ENTITY_TITLE_AIRPORT },
   { type: ENTITY_TYPE.TERMINAL, title: ENTITY_TITLE_TERMINAL },
   { type: ENTITY_TYPE.SCREENING_POINT, title: ENTITY_TITLE_SCREENING_POINT },
   { type: ENTITY_TYPE.LANE, title: ENTITY_TITLE_LANE },
   { type: ENTITY_TYPE.DEVICE_EQUIPMENT, title: ENTITY_TITLE_EQUIPMENT },
];

export type AllEntities = {
   airport: Array<Airport>;
   terminal: Array<Terminal>;
   screening_point: Array<ScreeningPoint>;
   lane: Array<Lane>;
   device_equipment: Array<Equipment>;
   equipment_type: Array<EquipmentType>;
   networks: Array<Network>;
   certificates: Array<Certificate>;
};

export type Network = {
   id: number;
   scannerNetworkTitle: string;
   scannerNetworkIpaddress: string;
   scannerNetworkPort?: number;
   scannerNetworkType?: string;
   scannerNetworkPassword?: string;
   scannerNetworkUsername?: string;
};

export type Certificate = {
   client_cert: string;
   client_key: string;
};

export type NewNetwork = Omit<Network, 'id'>;
