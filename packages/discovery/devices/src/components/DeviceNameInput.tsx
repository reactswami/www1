import { Input } from '@statseeker/components';
import { validate } from '@statseeker/utils/validator';
import { type FieldErrors, type UseFormRegister } from 'react-hook-form';
import { type DeviceFormValues, type FormField as DeviceFormField } from '~/types/deviceForm';

export function DeviceNameInput({
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
         label="Device Name"
         {...register('manual_name', {
            required: 'Device name is required.',
            validate: {
               isDeviceName: (v: string | undefined) => {
                  if (!v) {
                     return true; // allow empty
                  }
                  return validate(v).isDeviceName() || 'Invalid Device name format.';
               },
            },
         })}
         isRequired={field.required}
         error={errors?.manual_name?.message}
         placeholder={field.placeholder}
      />
   );
}
