import { Input } from '@statseeker/components';
import { validate } from '@statseeker/utils/validator';
import { type FieldErrors, type UseFormRegister } from 'react-hook-form';
import { type DeviceFormValues, type FormField as DeviceFormField } from '~/types/deviceForm';

export function IpAddressInput({
   field,
   register,
   errors,
}: {
   field: DeviceFormField;
   register: UseFormRegister<DeviceFormValues>;
   errors: FieldErrors<DeviceFormValues>;
}) {
   return (
      <Input
         label="IP Address"
         {...register('ipaddress', {
            required: 'Ip Address is required.',
            validate: {
               isIpAddress: (v: string | undefined) => {
                  if (!v) {
                     return true; // allow empty
                  }
                  return validate(v).isIpAddress() || 'Invalid IP Address format.';
               },
            },
         })}
         isRequired={field.required}
         error={errors?.ipaddress?.message}
         placeholder={field.placeholder}
      />
   );
}
