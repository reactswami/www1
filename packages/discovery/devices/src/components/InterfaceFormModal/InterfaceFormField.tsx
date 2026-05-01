import {
   Box,
   Flex,
   FormControl,
   IconButton,
   Select as ChakraSelect,
   Switch,
   useColorModeValue,
} from '@chakra-ui/react';
import { Cross1Icon } from '@radix-ui/react-icons';
import { Input } from '@statseeker/components';
import { FormLabel } from '@statseeker/components/Legacy/Input/Label/Label';
import { motion } from 'framer-motion';
import { type FieldErrors, type UseFormRegister } from 'react-hook-form';
import { IfInSpeedDropdown, IfOutSpeedDropdown, IfSpeedDropdown } from '../IfSpeedDropDown';
import {
   type InterfaceFormValues,
   type InterfaceFormField as InterfaceFormFieldType,
} from './types';

type InterfaceFormFieldProps = {
   field: InterfaceFormFieldType;
   onRemove: (name: string) => void;
   register: UseFormRegister<InterfaceFormValues>;
   errors: FieldErrors<InterfaceFormValues>;
};

const MotionBox = motion(Box);

export function InterfaceFormField({
   field,
   onRemove,
   register,
   errors,
}: InterfaceFormFieldProps) {
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
         case 'switch':
            return (
               <FormControl>
                  <FormLabel label={field.label}>
                     <Switch
                        display={'block'}
                        {...register(field.name)}
                        colorScheme="green"
                     />
                  </FormLabel>
               </FormControl>
            );
         case 'nonunicast':
            return (
               <FormControl>
                  <FormLabel label={field.label}>
                     <ChakraSelect {...register(field.name)}>
                        <option value="global">
                           default
                        </option>
                        <option value="on">
                           on
                        </option>
                        <option value="off">
                           off
                        </option>
                     </ChakraSelect>
                  </FormLabel>
               </FormControl>
            );
         case 'ifSpeed':
            return <IfSpeedDropdown register={register} isRequired={field.required} errors={errors} />;
         case 'ifOutSpeed':
            return <IfOutSpeedDropdown register={register} isRequired={field.required} errors={errors} />;
         case 'ifInSpeed':
            return <IfInSpeedDropdown register={register} isRequired={field.required} errors={errors} />;
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
