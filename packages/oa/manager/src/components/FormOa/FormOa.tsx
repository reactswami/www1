import { AddIcon } from '@chakra-ui/icons';
import {
   Alert,
   AlertDescription,
   AlertIcon,
   AlertTitle,
   Box,
   Container,
   Flex,
   Heading,
   Spacer,
   Text,
} from '@chakra-ui/react';
import { Input, Button } from '@statseeker/components';
import { InfoCircledIcon } from '@statseeker/ui/icons';
import { validate } from '@statseeker/utils/validator';
import { useMemo } from 'react';
import { FormProvider, type SubmitHandler, useForm } from 'react-hook-form';
import { type OaFormValues } from '~/types';

export interface Props {
   onSubmit: SubmitHandler<OaFormValues>;
   isSubmitting: boolean;
   defaultValues?: Partial<OaFormValues>;
   isEnabled?: boolean;
   isCreatingNewOa: boolean;
   onCancel: () => void;
   id?: string;
}

type DirtyFieldsList = {
   [key: string]: boolean;
};

export const FormOa = ({
   onSubmit,
   isSubmitting,
   onCancel,
   defaultValues,
   isEnabled = true,
   isCreatingNewOa,
}: Props) => {
   const isDisabled = !isEnabled;
   const methods = useForm<OaFormValues>({ defaultValues });
   const {
      watch,
      register,
      formState: { errors, dirtyFields },
   } = methods;

   const ipv6values = watch(['ipv6address', 'ipv6prefix', 'ipv6gateway']);
   const hasIPv6Input = useMemo(
      () => ipv6values.some(value => value !== null && String(value)?.trim() !== ''),
      [ipv6values]
   );

   function hasCertainFieldsChanged(dirtyFieldsList: DirtyFieldsList) {
      const fieldsToCheck = ['hostname', 'ipaddress', 'netmask', 'gateway', 'timeout'];

      const isAnyFieldDirty = Object.keys(dirtyFieldsList).some((dirtyField: string) =>
         fieldsToCheck.includes(dirtyField)
      );

      return isAnyFieldDirty;
   }

   function handleFormSubmit(data: OaFormValues) {
      onSubmit({ ...data, dirtyFields: hasCertainFieldsChanged(dirtyFields) });
   }

   return (
      <FormProvider {...methods}>
         <Container maxWidth="1200px" paddingY={8}>
            <Flex
               direction="column"
               alignItems="flex-start"
               as="form"
               onSubmit={methods.handleSubmit(handleFormSubmit)}
            >
               {isDisabled && (
                  <Alert status="warning">
                     <InfoCircledIcon />
                     <Text paddingLeft="2">This Observability Appliance is disabled.</Text>
                  </Alert>
               )}
               <Flex gap="lg">
                  {isCreatingNewOa ? (
                     <Box>
                        <Box maxWidth={'40ch'}>
                           <Input
                              isDisabled={isDisabled}
                              isRequired
                              label="name"
                              {...register('manual_name', {
                                 required: 'please provide a name',
                                 pattern: {
                                    value: /^[a-zA-Z][a-zA-Z0-9-]*$/,
                                    message:
                                       "Invalid name. Name must start with a letter and only contain letters, numbers and '-'.",
                                 },
                              })}
                              error={errors?.manual_name?.message}
                           />
                        </Box>
                        <Text color={'gray.600'} fontSize="sm" marginTop={2}>
                           Note:
                        </Text>
                        <Text color={'gray.600'} fontSize="sm">
                           Appliances cannot be renamed once created.
                        </Text>
                        <Text color={'gray.600'} fontSize="sm">
                           The name will be used to identify data coming from this Observability
                           Appliance.
                        </Text>
                     </Box>
                  ) : (
                     <Alert
                        status="info"
                        display={'flex'}
                        flexDirection={'column'}
                        alignItems="flex-start"
                        gap="sm"
                        borderRadius={'sm'}
                     >
                        <Flex gap="sm">
                           <AlertIcon />
                           <AlertTitle>Note</AlertTitle>
                        </Flex>
                        <AlertDescription>
                           Changing network configuration on this page does not apply the changes to
                           the running Observability Appliance.
                        </AlertDescription>
                        <AlertDescription>
                           These changes will apply if the Observability Appliance image is
                           downloaded and deployed.
                        </AlertDescription>
                     </Alert>
                  )}
               </Flex>
               <Spacer minHeight={'2rem'} />
               <Flex gap="xxl" placeSelf={'stretch'}>
                  <Flex direction={'column'} gap="sm" flexShrink={0} flexGrow={1}>
                     <Heading size="sm">Network settings</Heading>
                     <Input
                        isDisabled={isDisabled}
                        isRequired
                        label="hostname"
                        {...register('hostname', {
                           required: 'please provide a hostname',
                           pattern: {
                              value: /^[a-zA-Z][a-zA-Z0-9.-]*$/,
                              message: 'Invalid hostname. Hostname must start with a letter.',
                           },
                        })}
                        error={errors?.hostname?.message}
                     />
                     <Input
                        isDisabled={isDisabled}
                        isRequired
                        label="ip address"
                        {...register('ipaddress', {
                           required: 'please provide an ip address',
                           validate: {
                              isIpAddress: (v: string) =>
                                 validate(v).isIpAddress() || 'invalid ip address format',
                           },
                        })}
                        error={errors?.ipaddress?.message}
                     />
                     <Input
                        isDisabled={isDisabled}
                        isRequired
                        label="netmask"
                        {...register('netmask', {
                           required: 'please provide a netmask',
                           validate: {
                              isIpAddress: (v: string) =>
                                 validate(v).isIpAddress() || 'invalid netmask format',
                           },
                        })}
                        error={errors?.netmask?.message}
                     />
                     <Input
                        isDisabled={isDisabled}
                        isRequired
                        label="default gateway"
                        {...register('gateway', {
                           required: 'please provide a default gateway',
                           validate: {
                              isIpAddress: (v: string) =>
                                 validate(v).isIpAddress() || 'invalid default gateway format',
                           },
                        })}
                        error={errors?.gateway?.message}
                     />
                     <Input
                        isDisabled={isDisabled}

                        label="ipv6 address"
                        {...register('ipv6address',
                           {
                              validate: (value) => {
                                 if (!value && hasIPv6Input) {
                                    return 'please provide a valid ipv6 address';
                                 }
                                 if (value && hasIPv6Input) {
                                    return validate(value).isIpAddress() || 'invalid ipv6 address';
                                 }
                                 return true;
                              }
                           }
                        )}
                        error={errors?.ipv6address?.message}
                     />
                     <Input
                        isDisabled={isDisabled}
                        label="ipv6 prefix"
                        {...register('ipv6prefix', {
                           validate: (value) => {
                              if (!value && hasIPv6Input) {
                                 return 'please provide a valid ipv6 prefix(0-128)';
                              }
                              if (value && hasIPv6Input) {
                                 return validate(String(value)).isIPv6Prefix() || 'invalid ipv6 prefix';
                              }
                              return true;
                           }
                        }
                        )}
                        error={errors?.ipv6prefix?.message}
                     />
                     <Input
                        isDisabled={isDisabled}
                        label="ipv6 gateway"
                        {...register('ipv6gateway', {
                           validate: (value) => {
                              if (!value && hasIPv6Input) {
                                 return 'please provide a valid ipv6 gateway';
                              }

                              if (value && hasIPv6Input) {
                                 return validate(value).isIpAddress() || 'invalid ipv6 gateway';
                              }
                              return true;
                           }
                        }
                        )}
                        error={errors?.ipv6gateway?.message}
                     />
                     <Input
                        isDisabled={isDisabled}
                        rightAddon={<Text>seconds</Text>}
                        label="timeout"
                        isRequired
                        defaultValue="10"
                        {...register('timeout', {
                           required: 'please provide a timeout',
                           min: {
                              value: 0,
                              message:
                                 'Invalid timeout. Timeout must be set between 0 and 30 seconds',
                           },
                           max: {
                              value: 30,
                              message:
                                 'Invalid timeout. Timeout must be set between 0 and 30 seconds',
                           },
                           validate: {
                              isInteger: (v) =>
                                 validate(v).isInteger() ||
                                 'invalid timeout. Provide a number above 0.',
                           },
                        })}
                        error={errors?.timeout?.message}
                        helpText="Set to 0 to disable timeout."
                     />
                  </Flex>
                  <Flex direction={'column'} gap="sm" flexShrink={0} flexGrow={1}>
                     <Heading size="sm">Metadata</Heading>
                     <Input
                        isDisabled={isDisabled}
                        label="region"
                        {...register('region')}
                        error={errors?.region?.message}
                     />
                     <Input
                        isDisabled={isDisabled}
                        label="site"
                        {...register('site')}
                        error={errors?.site?.message}
                     />
                     <Input
                        isDisabled={isDisabled}
                        label="location"
                        {...register('location')}
                        error={errors?.location?.message}
                     />
                     <Input
                        isDisabled={isDisabled}
                        label="latitude"
                        {...register('latitude', {
                           validate: {
                              isLatitude: (v: string | undefined) => {
                                 if (!v) {
                                    return true; // allow empty
                                 }
                                 return validate(v).isLatitude() || 'invalid latitude format.';
                              },
                           },
                        })}
                        error={errors?.latitude?.message}
                        helpText={'The latitude must have the following format: 12.234'}
                     />
                     <Input
                        isDisabled={isDisabled}
                        label="longitude"
                        {...register('longitude', {
                           validate: {
                              isLongitude: (v: string | undefined) => {
                                 if (!v) {
                                    return true; // allow empty
                                 }
                                 return validate(v).isLongitude() || 'invalid longitude format';
                              },
                           },
                        })}
                        error={errors?.longitude?.message}
                        helpText={'The longitude must have the following format: 123.456'}
                     />
                  </Flex>
               </Flex>
               <Flex justifyContent={'flex-start'} gap="md" paddingTop={'2rem'}>
                  <Button
                     onClick={methods.handleSubmit(handleFormSubmit)}
                     isLoading={isSubmitting}
                     isDisabled={Object.keys(dirtyFields).length === 0}
                     variant={'primary'}
                  >
                     Save
                  </Button>
                  <Button onClick={onCancel} isDisabled={isSubmitting} variant="secondary">
                     Cancel
                  </Button>
               </Flex>
            </Flex>
         </Container>
      </FormProvider>
   );
};
