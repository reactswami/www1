import { Flex, FormControl, Select } from '@chakra-ui/react';
import { Input } from '@statseeker/components';
import { FormLabel } from '@statseeker/components/Legacy/Input/Label/Label';
import { type FieldErrors, type UseFormRegister } from 'react-hook-form';
import { type InterfaceFormValues } from './InterfaceFormModal/types';

type SpeedUnit = {
   value: number;
   label: string;
   default?: boolean;
};

const SPEED_UNITS: SpeedUnit[] = [
   { value: 1, label: 'bps' },
   { value: 1000, label: 'kbps' },
   { value: 1000000, label: 'Mbps' },
   { value: 1000000000, label: 'Gbps', default: true },
];

export const decodeSpeedValue = (value?: number): number => {
   if (value === undefined) {
      return 0;
   }
   const unit = SPEED_UNITS.findLast((unit) => value % unit.value === 0);
   if (unit) {
      return value / unit.value;
   }
   return value;
};

export const decodeSpeedUnits = (value?: number): number => {
   if (value === undefined) {
      return 1000000000;
   }
   const unit = SPEED_UNITS.findLast((unit) => value % unit.value === 0);
   if (unit) {
      return unit.value;
   }
   return 1;
};

interface SpeedDropdownProps {
   register: UseFormRegister<InterfaceFormValues>;
   speedName: 'ifInSpeed' | 'ifOutSpeed' | 'ifSpeed';
   unitSpeedName: 'ifInSpeedUnits' | 'ifOutSpeedUnits' | 'ifSpeedUnits';
   errors: FieldErrors<InterfaceFormValues>;
   label?: string;
   defaultValue?: number;
   isRequired?: boolean;
}

function SpeedDropdown({
   register,
   speedName,
   unitSpeedName,
   errors,
   label = 'Speed',
   isRequired = false,
}: SpeedDropdownProps) {
   return (
      <Flex w={'100%'} gap={2} alignItems={'center'}>
         <Input
            type="number"
            label={label}
            isRequired={isRequired}
            {...register(speedName, {
               valueAsNumber: true,
               validate: (value, formData) => {
                  if (!value || value <= 0 || !Number.isInteger((formData[unitSpeedName] || 0) * value)) {
                     return 'Invalid speed value';
                  }
                  return true;
               },
            })}
            error={errors[speedName]?.message}
         />
         <FormControl>
            <FormLabel label={'Units'}>
               <Select
                  {...register(unitSpeedName, {
                     valueAsNumber: true,
                  })}
               >
                  {SPEED_UNITS.map((unit) => (
                     <option key={unit.value} value={unit.value}>
                        {unit.label}
                     </option>
                  ))}
               </Select>
            </FormLabel>
         </FormControl>
      </Flex>
   );
}

export function IfSpeedDropdown({
   register,
   errors,
   isRequired,
}: {
   register: UseFormRegister<InterfaceFormValues>;
   errors: FieldErrors<InterfaceFormValues>;
   isRequired?: boolean;
}) {
   return (
      <SpeedDropdown
         register={register}
         speedName="ifSpeed"
         unitSpeedName="ifSpeedUnits"
         isRequired={isRequired}
         errors={errors}
      />
   );
}

export function IfOutSpeedDropdown({
   register,
   errors,
   isRequired,
}: {
   register: UseFormRegister<InterfaceFormValues>;
   errors: FieldErrors<InterfaceFormValues>;
   isRequired?: boolean;
}) {
   return (
      <SpeedDropdown
         register={register}
         speedName="ifOutSpeed"
         label="Tx Speed"
         unitSpeedName="ifOutSpeedUnits"
         isRequired={isRequired}
         errors={errors}
      />
   );
}

export function IfInSpeedDropdown({
   register,
   errors,
   isRequired,
}: {
   register: UseFormRegister<InterfaceFormValues>;
   errors: FieldErrors<InterfaceFormValues>;
   isRequired?: boolean;
}) {
   return (
      <SpeedDropdown
         register={register}
         speedName="ifInSpeed"
         label="Rx Speed"
         unitSpeedName="ifInSpeedUnits"
         isRequired={isRequired}
         errors={errors}
      />
   );
}
