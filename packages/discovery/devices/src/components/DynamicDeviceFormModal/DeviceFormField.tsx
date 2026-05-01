import { Box, Flex, FormControl, IconButton, Switch, useColorModeValue } from '@chakra-ui/react';
import { Cross1Icon } from '@radix-ui/react-icons';
import { Input } from '@statseeker/components';
import { FormLabel } from '@statseeker/components/Legacy/Input/Label/Label';
import { motion } from 'framer-motion';
import { type Control, type FieldErrors, type UseFormRegister } from 'react-hook-form';
import { DeviceNameInput } from '../DeviceNameInput';
import { Geolocation } from '../Geolocation';
import { IpAddressInput } from '../IPAddressInput';
import { SNMPCredentialDropdown } from '../SNMPCredentialDropdown';
import { SNMPMaxOidsDropdown } from '../SNMPMaxOidsDropdown';
import { type DeviceFormValues, type FormField } from '~/types/deviceForm';

type DeviceFormFieldProps = {
   field: FormField;
   onRemove: (name: string) => void;
   register: UseFormRegister<DeviceFormValues>;
   errors: FieldErrors<DeviceFormValues>;
};

const MotionBox = motion(Box);

export function DeviceFormField({
   field,
   onRemove,
   register,
   errors,
}: DeviceFormFieldProps) {
   const bgColor = useColorModeValue('white', 'gray.800');
   const borderColor = useColorModeValue('gray.200', 'gray.700');
   const renderField = () => {
      switch (field.type) {
         case 'text':
            return (
               <Input
                  type="text"
                  id={field.name}
                  placeholder={field.placeholder}
                  required={field.required}
                  label={field.label}
                  isRequired={field.required}
                  {...register(field.name, {
                     required: `${field.label} is required.`,
                  })}
                  error={errors[field.name]?.message}
               />
            );
         case 'snmpCredential':
            return (
               <SNMPCredentialDropdown
                  register={register}
                  field={field}
                  errors={errors}
                  isRequired={field.required}
               />
            );
         case 'snmp_maxoid':
            return <SNMPMaxOidsDropdown register={register} field={field} />;
         case 'deviceName':
            return <DeviceNameInput field={field} register={register} errors={errors} />;
         case 'ipaddress':
            return <IpAddressInput field={field} register={register} errors={errors} />;
         case 'gps':
            return <Geolocation register={register} errors={errors} isRequired={field.required} />;
         case 'switch':
            return (
               <FormControl>
                  <FormLabel label={field.label}>
                     <Switch display={'block'} {...register(field.name)} colorScheme="green" />
                  </FormLabel>
               </FormControl>
            );
         default:
            return (
               <Input
                  type="text"
                  id={field.name}
                  placeholder={field.placeholder}
                  required={field.required}
                  label={field.label}
                  isRequired={field.required}
                  {...register(field.name, {
                     required: field.required,
                  })}
               />
            );
      }
   };

   return (
      <MotionBox
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         exit={{ opacity: 0, y: -20 }}
         transition={{ duration: 0.2 }}
         mb={6}
         p={4}
         borderWidth="1px"
         borderRadius="lg"
         borderColor={borderColor}
         bg={bgColor}
         boxShadow="sm"
         _hover={{ boxShadow: 'md', borderColor: 'primary.200' }}
      >
         <Flex justifyContent="space-between" alignItems="flex-end" gap={2}>
            {renderField()}
            <IconButton
               colorScheme={'red'}
               title="Remove Field"
               aria-label="Remove Field"
               variant={'outline'}
               icon={<Cross1Icon />}
               onClick={() => onRemove(field.name)}
            />
         </Flex>
      </MotionBox>
   );
}
