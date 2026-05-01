import {
   Box,
   Button,
   Container,
   Flex,
   FormControl,
   Modal,
   ModalBody,
   ModalCloseButton,
   ModalContent,
   ModalHeader,
   ModalOverlay,
   Select,
   VStack,
   Stack,
   Link,
   Text,
   Checkbox,
   FormErrorMessage,
   Alert,
   AlertDescription,
   AlertIcon,
   Input as TimeInput,
   Switch,
} from '@chakra-ui/react';
import { Input } from '@statseeker/components';
import { FormLabel } from '@statseeker/components/Legacy/Input/Label/Label';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useState, type ChangeEvent } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { getDiscoverScheduleByIdQuery } from './queryOptions';
import { DaysOfWeek, type ScheduleFormProps, type ScheduleFormValues, ScheduleType } from './types';
import { getCronToSubmit, getCronValue, getDefaultValues } from './utils';

/**
 * @description Generic implementation of task ui for various scheduling purposes
 */
function ScheduleForm({
   disclosure,
   defaultValue,
   title = 'Create Schedule',
   saveButtonTitle = 'Save',
   isCopy = false,
   onSubmit,
   isSubmitting,
   validateDuplicateSchedule = undefined,
   allowEnableConfiguration = false,
   disabledFields = [],
}: ScheduleFormProps) {
   const methods = useForm<ScheduleFormValues>({
      defaultValues: {
         ...getDefaultValues(defaultValue),
      },
   });
   const {
      register,
      watch,
      formState: { errors, dirtyFields },
      control,
      reset,
      setValue,
   } = methods;

   const scheduleType = useWatch({ name: 'scheduleType', control });
   const cronValue = useWatch({ name: 'cron', control });
   const { data: schedule, isLoading, refetch, isFetching } = useQuery(
      getDiscoverScheduleByIdQuery({ id: defaultValue.scheduleId })
   );
   let tabIndex = 1;
   const [isValidating, setIsValidating] = useState(false);
   const [isReady, setIsReady] = useState(false);

   useEffect(() => {
      if (disclosure.isOpen) {
         refetch();
      }
      setIsReady(disclosure.isOpen);
   }, [disclosure.isOpen, refetch]);

   useEffect(() => {
      if (disclosure.isOpen === false) {
         reset();
      }

      if (disclosure.isOpen === true && defaultValue.scheduleId !== undefined && !isLoading && !isFetching) {
         const data = schedule?.data;
         if (data && data.length === 1) {
            reset({
               ...getDefaultValues({
                  scheduleName: isCopy ? `Copy of ${data[0].name}` : data[0].name,
                  scheduleValue: data[0].time,
                  scheduleEnabled: data[0].enabled === 1,
               }),
            });
         }
      }
   }, [disclosure.isOpen, reset, defaultValue.scheduleId, isLoading, schedule, isFetching, isCopy]);

   const hasTime = () =>
      scheduleType === ScheduleType.Weekly ||
      scheduleType === ScheduleType.Monthly ||
      scheduleType === ScheduleType.Daily;

   function handleFormSubmit(data: ScheduleFormValues) {
      if (!defaultValue.scheduleId) {
         onSubmit({
            name: data?.scheduleName,
            time: getCronToSubmit({ scheduleType, data }),
            enabled: 1, // enable the task by default
         });
      } else {
         const task = schedule?.data?.[0];
         if (isCopy && task) {
            onSubmit({
               ...task,
               name: data?.scheduleName,
            });
         } else {
            onSubmit({
               id: defaultValue.scheduleId,
               name: data?.scheduleName,
               time: getCronToSubmit({ scheduleType, data }),
               enabled: data?.enabled ? 1 : 0,
            });
         }
      }
   }

   const validateSchedule = useCallback(
      async (id?: number, value?: string | number) => {
         if (!validateDuplicateSchedule) {
            return;
         }
         setIsValidating(true);
         try {
            const resp = await validateDuplicateSchedule(id, value);
            setIsValidating(false);
            return resp;
         } catch (error) {
            setIsValidating(false);
            return;
         }
      },
      [validateDuplicateSchedule]
   );

   const isDisabled = (fieldName: string) => {
      return disabledFields && disabledFields.includes(fieldName);
   };

   const handleSwitchChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
      setValue('enabled', e.target.checked, { shouldDirty: true });
   }, [setValue]);

   return (
      <>
         <Modal
            isOpen={isReady && !isFetching}
            isCentered
            onClose={disclosure.onClose}
            closeOnOverlayClick={false}
         >
            <ModalOverlay />
            <ModalContent maxWidth={'100vw'} width={'max-content'} padding={5}>
               <ModalHeader>{title}</ModalHeader>
               <ModalCloseButton />
               <ModalBody padding={0}>
                  <Container maxWidth="1200px">
                     <Flex
                        direction="column"
                        alignItems="flex-start"
                        as="form"
                        onSubmit={methods.handleSubmit(handleFormSubmit)}
                        gap={2}
                        autoComplete="off"
                     >
                        {allowEnableConfiguration && (
                           <Box width={'50ch'} resize={'both'}>
                              <FormControl>
                                 <FormLabel label='Enabled' isRequired>
                                    <>
                                       <Box></Box> {/* push the switch below the form label*/}
                                       <Switch
                                          isChecked={watch('enabled')}
                                          onChange={handleSwitchChange}
                                       />
                                       {errors?.enabled?.message}
                                    </>
                                 </FormLabel>
                              </FormControl>
                           </Box>)}
                        <Box width={'50ch'} resize={'both'}>
                           <Input
                              isRequired
                              label="name"
                              isDisabled={isDisabled('scheduleName')}
                              {...register('scheduleName', {
                                 required: 'Please provide a schedule name',
                                 setValueAs: (v) => v?.trim(),
                                 validate: (value) => (value ?? "").length > 0 || "Please provide a valid schedule name",
                              })}
                              error={errors?.scheduleName?.message}
                              tabIndex={tabIndex}
                           />
                        </Box>
                        <Box width={'50ch'}>
                           <FormControl>
                              <FormLabel label="Schedule Type" isRequired>
                                 <Select tabIndex={tabIndex++} {...register('scheduleType')} isDisabled={isDisabled('scheduleType')}>
                                    {Object.entries(ScheduleType).map(([key, value]) => (
                                       <option key={key} value={value}>
                                          {key}
                                       </option>
                                    ))}
                                 </Select>
                              </FormLabel>
                           </FormControl>
                        </Box>

                        {scheduleType === ScheduleType.Once && (
                           <Box width={'50ch'}>
                              <FormControl isRequired isInvalid={!!errors.runOnce?.message}>
                                 <FormLabel label="Date Time" isRequired>
                                    <TimeInput
                                       type="datetime-local"
                                       tabIndex={tabIndex++}
                                       isDisabled={isDisabled('runOnce')}
                                       {...register('runOnce', {
                                          required:
                                             'Select a future date and time to schedule the task',
                                          validate: {
                                             isDuplicate: async (val: string | undefined) => {
                                                return await validateSchedule(
                                                   defaultValue.scheduleId,
                                                   new Date(val as string).getTime()
                                                );
                                             },
                                             isValid: (date: string | Date | undefined) => {
                                                const d1 = new Date(date as string);
                                                const d2 = new Date();
                                                if (d1.getTime() < d2.getTime())
                                                   return 'Select a future date and time to schedule the task';
                                                return undefined;
                                             },
                                          },
                                       })}
                                    />
                                 </FormLabel>
                                 <FormErrorMessage>{errors.runOnce?.message}</FormErrorMessage>
                              </FormControl>
                           </Box>
                        )}
                        {scheduleType === ScheduleType.Weekly && (
                           <Box width={'50ch'}>
                              <VStack gap={3} alignItems={'flex-start'}>
                                 <FormControl isRequired isInvalid={!!errors.weekDays?.message}>
                                    <FormLabel label="Week days" isRequired>
                                       <></>
                                    </FormLabel>

                                    <Stack
                                       spacing={[1, 5]}
                                       direction={['column', 'row']}
                                       wrap={'wrap'}
                                       borderStyle={'solid'}
                                       borderWidth={'1px'}
                                       padding={2}
                                    >
                                       {Object.entries(DaysOfWeek).map(([day, value], index) => (
                                          <Checkbox
                                             key={day}
                                             value={value}
                                             tabIndex={tabIndex++}
                                             isDisabled={isDisabled('weekDays')}
                                             {...register(
                                                'weekDays',
                                                index === 0
                                                   ? { required: 'Please select one to proceed' }
                                                   : {}
                                             )}
                                          >
                                             {day}
                                          </Checkbox>
                                       ))}
                                    </Stack>
                                    {errors.weekDays?.message && (
                                       <FormErrorMessage>
                                          {errors.weekDays?.message}
                                       </FormErrorMessage>
                                    )}
                                 </FormControl>
                              </VStack>
                           </Box>
                        )}

                        {scheduleType === ScheduleType.Monthly && (
                           <VStack alignItems={'flex-start'} width={'100%'}>
                              <VStack alignItems={'flex-start'} width={'100%'} borderRadius={'5px'}>
                                 <Box width={'50ch'}>
                                    <FormControl
                                       isRequired
                                       isInvalid={!!errors.daysOfMonth?.message}
                                    >
                                       <FormLabel label="Days of month" isRequired>
                                          <></>
                                       </FormLabel>
                                       <Stack
                                          spacing={[1, 5]}
                                          direction={['column', 'row']}
                                          wrap={'wrap'}
                                          padding={2}
                                          borderStyle={'solid'}
                                          borderWidth={'1px'}
                                       >
                                          {Array(31)
                                             .fill(1)
                                             .map((v, index) => (
                                                <Checkbox
                                                   key={index}
                                                   tabIndex={tabIndex++}
                                                   value={v + index}
                                                   isDisabled={isDisabled('daysOfMonth')}
                                                   {...register(
                                                      'daysOfMonth',
                                                      index === 0
                                                         ? {
                                                            required:
                                                               'Please select one to proceed',
                                                         }
                                                         : {}
                                                   )}
                                                >
                                                   {v + index}
                                                </Checkbox>
                                             ))}
                                       </Stack>
                                       {errors.daysOfMonth?.message && (
                                          <FormErrorMessage>
                                             {errors.daysOfMonth?.message}
                                          </FormErrorMessage>
                                       )}
                                    </FormControl>
                                 </Box>
                              </VStack>
                           </VStack>
                        )}

                        {hasTime() && (
                           <Box width={'50ch'}>
                              <FormControl isRequired isInvalid={!!errors.runAt?.message}>
                                 <FormLabel label="Time" isRequired>
                                    <TimeInput
                                       type="time"
                                       tabIndex={tabIndex++}
                                       isDisabled={isDisabled('runAt')}
                                       {...register('runAt', {
                                          required: 'Select the time for the schedule',
                                          validate: {
                                             isDuplicate: async (
                                                val: string | undefined,
                                                data: ScheduleFormValues
                                             ) => {
                                                return await validateSchedule(
                                                   defaultValue.scheduleId,
                                                   getCronToSubmit({ scheduleType, data })
                                                );
                                             },
                                          },
                                       })}
                                    />
                                 </FormLabel>
                                 <FormErrorMessage>{errors.runAt?.message}</FormErrorMessage>
                              </FormControl>
                           </Box>
                        )}

                        {scheduleType === ScheduleType.Advanced && (
                           <>
                              <Box width={'50ch'} resize={'both'}>
                                 <Input
                                    isRequired
                                    label="Cron"
                                    isDisabled={isDisabled('cron')}
                                    {...register('cron', {
                                       required: 'Cron input cannot be empty',
                                       validate: {
                                          isValid: (item) => {
                                             return (
                                                getCronValue(item, cronValue) !== '' ||
                                                'Please provide a valid cron input'
                                             );
                                          },
                                          isDuplicate: async (
                                             val: string | undefined,
                                             data: ScheduleFormValues
                                          ) => {
                                             return await validateSchedule(
                                                defaultValue.scheduleId,
                                                getCronToSubmit({ scheduleType, data })
                                             );
                                          },
                                       },
                                    })}
                                    error={errors?.cron?.message}
                                 />
                              </Box>
                              <Box width={'50ch'} resize={'both'} marginTop={3}>
                                 <Alert status="info" textAlign={'left'}>
                                    <AlertIcon alignSelf={'flex-start'} />
                                    <AlertDescription fontSize={12}>
                                       {getCronValue(null, cronValue) ? (
                                          getCronValue(null, cronValue)
                                       ) : (
                                          <Stack>
                                             <Text>
                                                If you are unfamiliar with cron statement syntax,
                                                then please refer to{' '}
                                                <Text as="b">
                                                   <Link
                                                      href="https://docs.statseeker.com/discovery/scheduling-rewalk/#schedAdvanced"
                                                      isExternal
                                                   >
                                                      Scheduling Documentation
                                                   </Link>
                                                </Text>{' '}
                                                for assistance.
                                             </Text>
                                          </Stack>
                                       )}
                                    </AlertDescription>
                                 </Alert>
                              </Box>
                           </>
                        )}

                        <Flex
                           justifyContent={'flex-start'}
                           gap="md"
                           paddingTop={'2rem'}
                           alignSelf={'flex-end'}
                        >
                           <Button
                              tabIndex={tabIndex++}
                              onClick={methods.handleSubmit(handleFormSubmit)}
                              isLoading={isSubmitting || isValidating}
                              isDisabled={Object.keys(dirtyFields).length === 0 && !isCopy}
                           >
                              {saveButtonTitle}
                           </Button>
                           <Button
                              tabIndex={tabIndex++}
                              onClick={disclosure.onClose}
                              isDisabled={isSubmitting}
                              variant="ghost"
                           >
                              Cancel
                           </Button>
                        </Flex>
                     </Flex>
                  </Container>
               </ModalBody>
            </ModalContent>
         </Modal>
      </>
   );
}

export default ScheduleForm;
