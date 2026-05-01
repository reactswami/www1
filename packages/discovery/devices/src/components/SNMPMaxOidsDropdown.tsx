import { FormControl, Select } from '@chakra-ui/react';
import { FormLabel } from '@statseeker/components/Legacy/Input/Label/Label';
import { type UseFormRegister } from 'react-hook-form';
import { type DeviceFormValues, type FormField as DeviceFormField } from '~/types/deviceForm';

export function SNMPMaxOidsDropdown({
   field,
   register,
}: {
   field: DeviceFormField;
   register: UseFormRegister<DeviceFormValues>;
}) {
   return (
      <FormControl>
         <FormLabel label={field.label}>
            <Select
               {...register('snmp_maxoid', {
                  valueAsNumber: true,
               })}
            >
               {Array.from({ length: 41 }, (_, i) => (
                  <option key={i}>
                     {i + 10}
                  </option>
               ))}
            </Select>
         </FormLabel>
      </FormControl>
   );
}
