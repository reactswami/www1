export type FormField = {
   name: keyof DeviceFormValues;
   label: string;
   type:
   | 'text'
   | 'email'
   | 'number'
   | 'tel'
   | 'date'
   | 'select'
   | 'textarea'
   | 'snmpCredential'
   | 'gps'
   | 'switch'
   | 'deviceName'
   | 'ipaddress'
   | 'snmp_maxoid';
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
   fields: FormField[];
   availableFields: FormField[];
};

export interface DeviceFormValues {
   manual_name?: string;
   hostname?: string;
   ipaddress?: string;
   region?: string;
   sysLocation?: string;
   sysDescr?: string;
   snmp_poll?: boolean;
   ping_poll?: boolean;
   snmp_credential?: number;
   snmp_maxoid?: number;
   assignedPollers?: string[];
   latitude?: number;
   longitude?: number;
   default_poller?: string;
   gps?: string;
   site?: string;
   update_flags?: string;
}
