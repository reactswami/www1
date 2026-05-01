import { type InterfaceFormField } from './types';

export const getDefaultFields = (): InterfaceFormField[] => {
   const fields: InterfaceFormField[] = [
      {
         name: 'ifTitle',
         label: 'Title',
         type: 'text',
         value: '',
         placeholder: 'Enter interface title',
         required: true,
      },
      {
         name: 'ifSpeed',
         label: 'Speed',
         type: 'ifSpeed',
         required: true,
         value: '',
      },
      {
         name: 'ifOutSpeed',
         label: 'TX Speed',
         type: 'ifOutSpeed',
         required: true,
         value: '',
      },
      {
         name: 'ifInSpeed',
         label: 'RX Speed',
         type: 'ifInSpeed',
         required: true,
         value: '',
      },
      {
         name: 'poll',
         label: 'SNMP Poll',
         type: 'switch',
         value: '',
      },
      {
         name: 'ifOperStatusPoll',
         label: 'Operational Status Poll',
         type: 'switch',
         value: '',
      },
      {
         name: 'ifAdminStatusPoll',
         label: 'Administration Status Poll',
         type: 'switch',
         value: '',
      },
      {
         name: 'ifNonUnicast',
         label: 'Non-Unicast Poll',
         type: 'nonunicast',
         value: '',
      },
   ];

   /* Make sure the order of fields sticks to the order of the default fields */
   fields.forEach((field, index) => {
      field.order = index;
   });

   return fields;
};

export function sortedFields(fields: InterfaceFormField[]) {
   return fields.toSorted((a, b) => (a.order ?? 0) - (b.order ?? 0));
}
