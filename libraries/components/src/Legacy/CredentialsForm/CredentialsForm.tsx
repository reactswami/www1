import {
   Alert,
   AlertDescription,
   AlertIcon,
   AlertTitle,
   Box,
   Button,
   Flex,
   FormControl,
   FormErrorMessage,
   Grid,
   Modal,
   ModalBody,
   ModalCloseButton,
   ModalContent,
   ModalFooter,
   ModalHeader,
   ModalOverlay,
   type UseDisclosureReturn,
   useDisclosure,
   Select,
   Spinner,
   Text,
} from '@chakra-ui/react';
import { useEnumFields } from '@statseeker/api/internal_api';
import { type SNMPCredential } from '@statseeker/api/internal_api/entities/snmp_credential';
import { Input } from '@statseeker/components';
import { FormLabel } from '@statseeker/components/Legacy/Input/Label/Label';
import { useToast } from '@statseeker/hooks';
import { getProductName } from '@statseeker/utils/environment';
import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { type UseFormHandleSubmit } from 'react-hook-form';
import { describeCredentialsQuery } from './queryOptions';
import { type CredentialFormProps } from './types';
import { useCredentialsForm } from './useCredentialsForm';

export function CredentialsForm(props: CredentialFormProps) {
   const {
      register,
      handleSubmit,
      errors,
      isDirty,
      showAuthUsername,
      showAuthPassword,
      showPrivacySection,
      showExtraPrivacyFields,
      isSNMPV3,
      getAuthPassPlaceholder,
      getAuthUserPlaceholder,
      getPrivPlaceholder,
      getCommunityPlaceholder,
   } = useCredentialsForm({ props });
   const { data, isLoading } = useQuery(describeCredentialsQuery());
   const dropdownFields = useEnumFields(data?.describe);
   const hasError = isLoading === false && dropdownFields === null;
   const confirmModalDisclosure = useDisclosure();
   let deviceCount = 0;
   if (props.mode === 'edit') {
      deviceCount = props.deviceCount;
   }
   const toast = useToast();

   const handleSubmitConfirmation = useCallback(
      function handleSubmitConfirmation() {
         if (!isDirty && props.mode === 'edit') {
            toast({
               title: 'Unchanged',
               description: 'Save is not needed as data has not been modified',
               status: 'info',
            });
         } else if (props.mode === 'edit' && deviceCount > 0) {
            confirmModalDisclosure.onOpen();
         } else {
            handleSubmit(props.onSubmit)();
         }
      },
      [
         confirmModalDisclosure,
         handleSubmit,
         deviceCount,
         props.mode,
         props.onSubmit,
         isDirty,
         toast,
      ]
   );

   const isAuthUserRequired = () => getAuthUserPlaceholder() !== 'unchanged' && showAuthPassword;
   const isAuthPassRequired = () => getAuthPassPlaceholder() !== 'unchanged';
   const isPrivPassRequired = () => getPrivPlaceholder() !== 'unchanged';

   if (hasError) {
      return (
         <Flex
            direction={'column'}
            alignItems={'flex-start'}
            gap="4"
            justifyContent={'flex-start'}
            flexGrow={1}
         >
            <Alert status="error">
               <AlertIcon />
               <AlertTitle>Failed to fetch form fields!</AlertTitle>
               <AlertDescription>Please contact support.</AlertDescription>
            </Alert>
         </Flex>
      );
   }

   if (isLoading) {
      return (
         <Flex justifyContent={'center'} alignItems={'center'} flexGrow={1}>
            <Spinner thickness=".25rem" speed="0.65s" emptyColor="gray.200" size="xl" />
         </Flex>
      );
   }

   return (
      <form
         id="CredentialsForm"
         onSubmit={handleSubmit(handleSubmitConfirmation)}
         noValidate
         autoComplete="off"
      >
         <Flex gap={2} flexDir={'column'} className="flex flex-col gap-2">
            <Text>
               These SNMP credentials will be saved in {getProductName()} and made available for use
               in future Network Discovery processes.
            </Text>
            <Flex gap={2} flexDir={'column'}>
               <Grid templateColumns={'repeat(3,1fr)'} gap={10}>
                  <div className="flex flex-col">
                     <Input
                        tabIndex={100}
                        data-testid="snmp-name"
                        isRequired
                        label="Name"
                        {...register('name', {
                           required: 'Please provide a name',
                        })}
                        error={errors.name?.message}
                     />
                  </div>
                  {dropdownFields && isSNMPV3 ? (
                     <Box>
                        <FormControl isInvalid={!!errors.auth_method}>
                           <FormLabel label="Authentication" isRequired>
                              <Select
                                 size={'md'}
                                 data-testid="snmp-authentication"
                                 minWidth={'100%'}
                                 {...register('auth_method')}
                                 tabIndex={104}
                              >
                                 {dropdownFields
                                    ? dropdownFields['auth_method']?.map((option) => (
                                         <option
                                            key={`authMethod_${option.value}`}
                                            value={option.value}
                                         >
                                            {option.label}
                                         </option>
                                      ))
                                    : null}
                              </Select>
                           </FormLabel>
                           {errors.auth_method?.message ? (
                              <FormErrorMessage>{errors.auth_method?.message}</FormErrorMessage>
                           ) : null}
                        </FormControl>
                     </Box>
                  ) : null}
                  {dropdownFields && showPrivacySection ? (
                     <div>
                        <FormControl isInvalid={!!errors.priv_method?.message}>
                           <FormLabel label="Privacy" isRequired>
                              <Select
                                 minWidth={'100%'}
                                 {...register('priv_method')}
                                 tabIndex={107}
                                 data-testid="snmp-privacy"
                              >
                                 {dropdownFields
                                    ? dropdownFields['priv_method']?.map((option) => (
                                         <option
                                            key={`privMethod_${option.value}`}
                                            value={option.value}
                                         >
                                            {option.label}
                                         </option>
                                      ))
                                    : null}
                              </Select>
                           </FormLabel>
                           {errors.priv_method?.message ? (
                              <FormErrorMessage>{errors.priv_method?.message}</FormErrorMessage>
                           ) : null}
                        </FormControl>
                     </div>
                  ) : null}
               </Grid>
               <Grid templateColumns={'repeat(3,1fr)'} gap={10}>
                  <div className="flex flex-col">
                     <FormControl isRequired isInvalid={!!errors.version?.message}>
                        <FormLabel label="SNMP Version" isRequired={true}>
                           <Select
                              minWidth={'100%'}
                              data-testid="snmp-version"
                              {...register('version', {
                                 required: 'Please provide a version',
                                 valueAsNumber: true,
                              })}
                              size={'md'}
                              tabIndex={101}
                           >
                              <option value={1}>SNMP v1</option>
                              <option value={2}>SNMP v2</option>
                              <option value={3}>SNMP v3</option>
                           </Select>
                        </FormLabel>
                     </FormControl>
                  </div>
                  {showAuthUsername ? (
                     <div>
                        <Input
                           isRequired={isAuthUserRequired()}
                           label="username"
                           placeholder={getAuthUserPlaceholder()}
                           {...register('auth_user', {
                              required: isAuthUserRequired() ? 'Please provide a username' : false,
                           })}
                           error={errors.auth_user?.message}
                           tabIndex={105}
                        />
                     </div>
                  ) : null}
                  {showExtraPrivacyFields ? (
                     <div>
                        <Input
                           isRequired={isPrivPassRequired()}
                           label="privacy password"
                           placeholder={getPrivPlaceholder()}
                           type="password"
                           {...register('priv_pass', {
                              required: isPrivPassRequired()
                                 ? 'Please provide a privacy password'
                                 : false,
                           })}
                           error={errors.priv_pass?.message}
                           tabIndex={108}
                        />
                     </div>
                  ) : null}
               </Grid>
               <Grid templateColumns={'repeat(3,1fr)'} gap={10}>
                  <div className="flex flex-col ">
                     {isSNMPV3 ? (
                        <Input {...register('context')} label="context" tabIndex={103} />
                     ) : (
                        <Input
                           isRequired={getCommunityPlaceholder() !== 'unchanged'}
                           {...register('community', {
                              required:
                                 getCommunityPlaceholder() !== 'unchanged'
                                    ? 'Please provide a community'
                                    : false,
                           })}
                           placeholder={getCommunityPlaceholder()}
                           label="community"
                           data-testid="snmp-community"
                           error={errors.community?.message}
                           tabIndex={103}
                        />
                     )}
                  </div>
                  {showAuthPassword ? (
                     <div>
                        <Input
                           isRequired={isAuthPassRequired()}
                           type="password"
                           placeholder={getAuthPassPlaceholder()}
                           label="authentication password"
                           {...register('auth_pass', {
                              required: isAuthPassRequired()
                                 ? 'Please provide an authentication password'
                                 : false,
                           })}
                           error={errors.auth_pass?.message}
                           tabIndex={106}
                        />
                     </div>
                  ) : null}
               </Grid>
               <Box marginTop={'xs'}>
                  <Button
                     className="SaveCredential"
                     type="submit"
                     tabIndex={109}
                     data-testid="snmp-submit"
                  >
                     Save
                  </Button>
               </Box>
            </Flex>
         </Flex>
         <ConfirmUpdateCredentials
            disclosure={confirmModalDisclosure}
            deviceCount={deviceCount}
            handleSubmit={handleSubmit}
            onSubmit={props.onSubmit}
         />
      </form>
   );
}

type ConfirmUpdateCredentialsProps = {
   disclosure: UseDisclosureReturn;
   deviceCount: number;
   handleSubmit: UseFormHandleSubmit<SNMPCredential, SNMPCredential>;
   onSubmit: (credential: SNMPCredential) => void;
};

function ConfirmUpdateCredentials({
   disclosure,
   deviceCount,
   handleSubmit,
   onSubmit,
}: ConfirmUpdateCredentialsProps) {
   const { isOpen, onClose } = disclosure;
   return (
      <Modal isOpen={isOpen} onClose={onClose}>
         <ModalOverlay />
         <ModalContent minWidth="max-content">
            <ModalHeader>Update SNMP Credentials</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
               <Text>Are you sure you want to update these SNMP Credentials?</Text>
               <Text>
                  They are currently in use by {deviceCount} devices which will now be SNMP-polled
                  using the updated information.
               </Text>
            </ModalBody>
            <ModalFooter>
               <Button
                  className="CancelUpdateCredential"
                  type="button"
                  variant={'outline'}
                  mr={3}
                  onClick={onClose}
               >
                  Cancel
               </Button>
               <Button
                  className="ConfirmUpdateCredential"
                  type="submit"
                  variant="solid"
                  onClick={() => {
                     onClose();
                     handleSubmit(onSubmit)();
                  }}
               >
                  Save and update devices
               </Button>
            </ModalFooter>
         </ModalContent>
      </Modal>
   );
}
