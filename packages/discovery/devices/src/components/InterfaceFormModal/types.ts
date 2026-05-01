export type InterfaceFormField = {
   name: keyof InterfaceFormValues;
   label: string;
   type: 'text' | 'switch' | 'nonunicast' | 'ifSpeed' | 'ifOutSpeed' | 'ifInSpeed';
   placeholder?: string;
   required?: boolean;
   options?: {
      value: string;
      label: string;
   }[];
   value: string;
   order?: number;
};

export type FormState = {
   fields: InterfaceFormField[];
   availableFields: InterfaceFormField[];
};

export interface InterfaceFormValues {
   ifTitle?: string;
   ifSpeed?: number;
   ifSpeedUnits?: number;
   ifOutSpeed?: number;
   ifOutSpeedUnits?: number;
   ifInSpeed?: number;
   ifInSpeedUnits?: number;
   ifOperStatusPoll?: boolean;
   ifAdminStatusPoll?: boolean;
   ifNonUnicast?: string;
   poll?: boolean;
   update_flags?: string;
}
