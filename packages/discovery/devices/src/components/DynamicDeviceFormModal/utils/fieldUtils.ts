import { type UseFormUnregister } from 'react-hook-form';
import { type DeviceFormValues, type FormField } from '~/types/deviceForm';

export const getDefaultFields = (selectedDevicesLength?: number): FormField[] => {
   const defaultFields: FormField[] = [
      {
         name: 'snmp_poll',
         label: 'SNMP Poll',
         type: 'switch',
         value: '',
      },
      {
         name: 'snmp_credential',
         label: 'SNMP Credential',
         type: 'snmpCredential',
         required: true,
         value: '',
      },
      {
         name: 'snmp_maxoid',
         label: 'SNMP Max OIDs',
         type: 'snmp_maxoid',
         required: true,
         value: '',
      },
      {
         name: 'ping_poll',
         label: 'Ping Poll',
         type: 'switch',
         value: '',
      },
      {
         name: 'region',
         label: 'Region',
         type: 'text',
         required: true,
         placeholder: 'Enter device region',
         value: '',
      },
      {
         name: 'site',
         label: 'Site',
         type: 'text',
         value: '',
         required: true,
         placeholder: 'Enter device site',
      },
      {
         name: 'sysLocation',
         label: 'Location',
         required: true,
         type: 'text',
         placeholder: 'Enter device location',
         value: '',
      },
      {
         name: 'sysDescr',
         label: 'Description',
         required: true,
         type: 'text',
         placeholder: 'Enter system description',
         value: '',
      },
      {
         name: 'gps',
         label: 'Geolocation',
         required: true,
         type: 'gps',
         value: '',
      },
   ];

   const singleFields: FormField[] = [
      {
         name: 'manual_name',
         label: 'Device Name',
         type: 'deviceName',
         placeholder: 'Enter device name',
         required: true,
         value: '',
      },
      {
         name: 'hostname',
         label: 'Host Name',
         type: 'text',
         placeholder: 'Enter device host name',
         required: true,
         value: '',
      },
      {
         name: 'ipaddress',
         label: 'IP Address',
         type: 'ipaddress',
         placeholder: 'Enter IP address',
         required: true,
         value: '',
      },
   ];

   const fields = selectedDevicesLength === 1 ? singleFields.concat(defaultFields) : defaultFields;

   /* Make sure the order of fields sticks to the order of the default fields */
   fields.forEach((field, index) => {
      field.order = index;
   });

   return fields;
};

export function unregisterFields({
   name,
   unregister,
}: {
   name: FormField['name'];
   unregister: UseFormUnregister<DeviceFormValues>;
}) {
   switch (name) {
      case 'gps':
         unregister('latitude');
         unregister('longitude');
         break;
      case 'assignedPollers':
         unregister('assignedPollers');
         unregister('default_poller');
         break;
      default:
         unregister(name);
         break;
   }
}

export function sortedFields(fields: FormField[]) {
   return fields.toSorted((a, b) => (a.order ?? 0) - (b.order ?? 0));
}
