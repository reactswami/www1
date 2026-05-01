export type FormValues = {};
export type AirportFormValues = FormValues & {
   // This type is used to describe the form
   id: number;
   title: string;
   dirtyFields: boolean;
};

export type TerminalFormValues = FormValues & {
   // This type is used to describe the form
   id: number;
   title: string;
   airportId: number;
   dirtyFields: boolean;
};

export type ScreeningPointFormValues = FormValues & {
   // This type is used to describe the form
   id: number;
   title: string;
   airportId: number;
   terminalId: number;
   dirtyFields: boolean;
   passengerScanEfficiencyTargetCfg?: number;
   checkedBaggageScanEfficiencyTargetCfg?: number;
   carryOnBaggageScanEfficiencyTargetCfg?: number;
};

export type LaneFormValues = FormValues & {
   // This type is used to describe the form
   id: number;
   title: string;
   airportId: number;
   terminalId: number;
   screeningPointId: number;
   dirtyFields: boolean;
   passengerScanEfficiencyTargetCfg?: number;
   checkedBaggageScanEfficiencyTargetCfg?: number;
   carryOnBaggageScanEfficiencyTargetCfg?: number;
};

export type EquipmentFormValues = FormValues & {
   // This type is used to describe the form
   id: number;
   name: string;
   ipaddress: string;
   equipment_type: string;
   product_line: string;
   model: string;
   firmware: string;
   serial_no: string;
   airportId: number;
   terminalId: number;
   laneId: number;
   screeningPointId: number;
   dirtyFields: boolean;
   scanEfficiencyTargetCfg?: number;
};

export type EntityState = {
   airportId?: number;
   terminalId?: number;
   laneId?: number;
   screeningPointId?: number;
   isSaving?: boolean;
};

export type EntityUpdatePayload = {
   airportId: string;
   terminalId: string;
   laneId: string;
   screeningPointId: string;
};
