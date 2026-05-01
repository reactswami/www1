import { FormControl, FormErrorMessage, Select } from '@chakra-ui/react';
import { FormLabel } from '@statseeker/components/Legacy/Input/Label/Label';
import { useQuery } from '@tanstack/react-query';
import { type FieldErrors, type UseFormRegister } from 'react-hook-form';
import { snmpCredentialsQueryOptions } from '~/lib';
import { type DeviceFormValues, type FormField as DeviceFormField } from '~/types/deviceForm';

export function SNMPCredentialDropdown({
   field,
   register,
   errors,
   isRequired = false,
}: {
   field: DeviceFormField;
   register: UseFormRegister<DeviceFormValues>;
   errors: FieldErrors<DeviceFormValues>;
   isRequired?: boolean;
}) {
   const snmpCredentials = useQuery(snmpCredentialsQueryOptions.get());

   return (
      <FormControl isInvalid={!!errors?.snmp_credential?.message}>
         <FormLabel label={field.label} isRequired={isRequired}>
            <Select
               {...(snmpCredentials.isSuccess &&
                  register(field.name, {
                     valueAsNumber: true,
                     validate: {
                        isSNMPCredential: (v) => {
                           if (!v) {
                              return 'SNMP credential is required.';
                           }
                           return true;
                        },
                     },
                  }))}
               isDisabled={snmpCredentials.isLoading}
               placeholder="Select credential..."
            >
               {snmpCredentials.data?.map((credential) => (
                  <option key={credential.id} value={credential.id}>
                     {credential.name}
                  </option>
               ))}
            </Select>
         </FormLabel>
         <FormErrorMessage>{errors?.snmp_credential?.message}</FormErrorMessage>
      </FormControl>
   );
}
