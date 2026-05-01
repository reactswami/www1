import { Flex } from '@chakra-ui/react';
import { Input } from '@statseeker/components';
import { validate } from '@statseeker/utils/validator';
import { type FieldErrors, type UseFormRegister } from 'react-hook-form';
import { type DeviceFormValues } from '~/types/deviceForm';

export function Geolocation({
   register,
   errors,
   isRequired = false,
}: {
   register: UseFormRegister<DeviceFormValues>;
   errors: FieldErrors<DeviceFormValues>;
   isRequired?: boolean;
}) {
   return (
      <Flex w={'100%'} gap={2}>
         <Input
            label="Latitude"
            type="number"
            isRequired={isRequired}
            {...register('latitude', {
               required: 'Latitude is required.',
               valueAsNumber: true,
               validate: {
                  isLatitude: (v: number | undefined) => {
                     if (!v) {
                        return true; // allow empty
                     }
                     return validate(v.toString()).isLatitude() || 'Invalid latitude format.';
                  },
               },
            })}
            error={errors.latitude?.message}
            placeholder='Enter device latitude'
         />
         <Input
            label="Longitude"
            type="number"
            isRequired={isRequired}
            {...register('longitude', {
               required: 'Longitude is required.',
               valueAsNumber: true,
               validate: {
                  isLongitude: (v: number | undefined) => {
                     if (!v) {
                        return true; // allow empty
                     }
                     return validate(v.toString()).isLongitude() || 'Invalid longitude format.';
                  },
               },
            })}
            error={errors.longitude?.message}
            placeholder='Enter device longitude'
         />
      </Flex>
   );
}
