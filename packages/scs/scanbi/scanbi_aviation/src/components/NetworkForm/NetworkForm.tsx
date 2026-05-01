import { Button, Container, Flex, FormControl, Select, Spacer } from '@chakra-ui/react';
import { Input } from '@statseeker/components';
import { FormLabel } from '@statseeker/components/Legacy/Input/Label/Label';
import { validate } from '@statseeker/utils/validator';
import { useForm } from 'react-hook-form';
import { type NewNetwork } from '~/types';

interface NetworkFormProps {
   onSubmit: (data: NewNetwork) => void;
   isSubmitting: boolean;
   onCancel: () => void;
   id?: number;
   defaultValues?: Partial<NewNetwork>;
}

export function NetworkForm({ onSubmit, isSubmitting, onCancel, defaultValues }: NetworkFormProps) {
   const methods = useForm<NewNetwork>({ defaultValues });
   const {
      register,
      handleSubmit,
      formState: { errors },
      watch
   } = methods;

   const isRCC = watch('scannerNetworkType') === 'RCC';

   function handleFormSubmit(data: NewNetwork) {
      const { scannerNetworkUsername, scannerNetworkPassword, ...connectData } = data;
      const submitData = isRCC ? data : connectData;
      onSubmit(submitData);
   }

   return (
      <Container maxWidth="1200px" paddingY={8}>
         <Flex direction="column" alignItems={'flex-start'} as={'form'}>
            <FormControl>
               <Input
                  label="Title"
                  {...register('scannerNetworkTitle', {
                     required: 'Please provide a title',
                  })}
                  error={errors.scannerNetworkTitle?.message}
                  isRequired
               />
            </FormControl>
            <FormControl>
               <Input
                  label="IP Address"
                  {...register('scannerNetworkIpaddress', {
                     required: 'Please provide a ip address',
                     validate: {
                        isIpAddress: (v: string) =>
                           validate(v).isIpAddress() || 'Invalid ip address format',
                     },
                  })}
                  error={errors.scannerNetworkIpaddress?.message}
                  isRequired
               />
            </FormControl>
            <FormControl>
               <Input
                  label="Port"
                  {...register('scannerNetworkPort', {
                     min: { value: 0, message: 'Port must be between 0 and 65535' },
                     max: { value: 65535, message: 'Port must be between 0 and 65535' },
                  })}
                  error={errors.scannerNetworkPort?.message}
                  type="number"
               />
            </FormControl>
            <FormControl>
               <FormLabel label='Type'></FormLabel>
               <Select
                  {...register("scannerNetworkType")}
               >
                  <option value="RCC">RCC</option>
                  <option value="ConneCT">ConneCT</option>
               </Select>

            </FormControl>

            {isRCC &&
               <FormControl>
                  <Input
                     label="User name"
                     {...register('scannerNetworkUsername', {
                        required: 'Please provide user name',
                        shouldUnregister: true,
                     })}
                     error={errors.scannerNetworkUsername?.message}
                     isRequired
                  />
               </FormControl>
            }
            {isRCC &&
               <FormControl>
                  <Input
                     label="Password"
                     type='password'
                     {...register('scannerNetworkPassword', {
                        required: 'Please provide password',
                        shouldUnregister: true,
                     })}
                     error={errors.scannerNetworkPassword?.message}
                     isRequired
                  />
               </FormControl>

            }
         </Flex>
         <Spacer minHeight={'2rem'} />
         <Flex justifyContent={'flex-start'} gap="md" paddingTop={'2rem'}>
            <Button type="submit" isLoading={isSubmitting} onClick={handleSubmit(handleFormSubmit)}>
               Save
            </Button>
            <Button isDisabled={isSubmitting} variant="ghost" onClick={onCancel}>
               Cancel
            </Button>
         </Flex>
      </Container>
   );
}
