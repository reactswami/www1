import { type UseFormUnregister } from 'react-hook-form';
import { type InterfaceFormField, type InterfaceFormValues } from './types';

export function unregisterFields({
   name,
   unregister,
}: {
   name: InterfaceFormField['name'];
   unregister: UseFormUnregister<InterfaceFormValues>;
}) {
   switch (name) {
      case 'ifSpeed':
         unregister('ifSpeed');
         unregister('ifSpeedUnits');
         break;
      case 'ifOutSpeed':
         unregister('ifOutSpeed');
         unregister('ifOutSpeedUnits');
         break;
      case 'ifInSpeed':
         unregister('ifInSpeed');
         unregister('ifInSpeedUnits');
         break;
      default:
         unregister(name);
         break;
   }
}
