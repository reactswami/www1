import { Box, Container } from '@chakra-ui/react';
import { Input, TypeAheadSelectInput, Flex, Spacer, Heading, Button } from '@statseeker/components';
import { validate } from '@statseeker/utils/validator';
import { useEffect, useState } from 'react';
import { FormProvider, type SubmitHandler, useForm } from 'react-hook-form';
import { ScannersMultiSelect } from '~/components';
import { EntityTypeAhead } from '~/components/EntityTypehead';
import { NetworkTypeahead } from '~/components/NetworkTypeahead/NetworkTypeahead';
import useEquipmentType from '~/features/equipment/hooks/useEquipmentType';
import { useEntityState } from '~/hooks/useEntityState';
import { type RowData } from '~/types/models';
import { ENTITY_TYPE } from '~/utils/constants';

interface FormProps {
   onSubmit: SubmitHandler<RowData>;
   isSubmitting: boolean;
   defaultValues?: Partial<RowData>;
   isEnabled?: boolean;
   onCancel: () => void;
   id?: number;
}

type DirtyFieldsList = {
   [key: string]: boolean;
};

export const FormEquipment = ({
   onSubmit,
   isSubmitting,
   onCancel,
   defaultValues,
   isEnabled = true,
}: FormProps) => {
   const isDisabled = !isEnabled;
   const methods = useForm<RowData>({
      defaultValues: {
         ...defaultValues,
         ctWorkstationScanners: defaultValues?.ctWorkstationScanners
            ? defaultValues?.ctWorkstationScanners.split(',')
            : [],
      },
   });
   const {
      register,
      formState: { errors, dirtyFields },
      clearErrors,
      control,
      reset,
   } = methods;
   const { setSaving, getEntityPayload, registerEntity, validateEntity } = useEntityState({
      ...defaultValues,
   });
   const [network, setNetwork] = useState<number | null>(defaultValues?.networkId || null);

   const [equipmentError, setEquipmentError] = useState({ type: '', productLine: '', model: '' });

   const {
      equipmentTypes,
      productLines,
      models,
      setSelectedEquipmentType,
      setSelectedProductLine,
      selectedProductLine,
      selectedEquipmentType,
      selectedModelName,
      setSelectedModelName,
   } = useEquipmentType({
      modelName: defaultValues?.modelName,
      productLine: defaultValues?.productLine,
      equipmentType: defaultValues?.equipmentType,
   });

   const equipmentErrors = {
      productError: 'Please enter a product line',
      modelError: 'Please enter a model',
   };
   function hasCertainFieldsChanged(dirtyFieldsList: DirtyFieldsList) {
      const fieldsToCheck = ['title'];

      const isAnyFieldDirty = Object.keys(dirtyFieldsList).some((dirtyField: string) =>
         fieldsToCheck.includes(dirtyField)
      );

      return isAnyFieldDirty;
   }

   const validateEquipment = () => {
      let isValid = true;
      let type = '';
      let productLine = '';
      let model = '';
      if (!selectedEquipmentType) {
         type = 'Equipment type cannot be empty';
         isValid = false;
      }

      if (!selectedProductLine) {
         productLine = equipmentErrors.productError;
         isValid = false;
      }

      if (!selectedModelName) {
         model = equipmentErrors.modelError;
         isValid = false;
      }

      setEquipmentError({ type, model, productLine });
      return isValid;
   };

   function handleFormSubmit(data: RowData) {
      setSaving(true);
      const isEntityValid = validateEntity(ENTITY_TYPE.DEVICE_EQUIPMENT);
      const isEquipmentValid = validateEquipment();
      if (!isEquipmentValid || !isEntityValid) {
         return;
      }

      const dataNew: any = {
         ...data,
         ...getEntityPayload(ENTITY_TYPE.DEVICE_EQUIPMENT),
         equipmentType: selectedEquipmentType,
         productLine: selectedProductLine,
         modelName: selectedModelName,
         networkId: network,
      };

      onSubmit({
         ...dataNew,
         dirtyFields: hasCertainFieldsChanged(dirtyFields),
      });
   }

   useEffect(() => {
      clearErrors(['firmware', 'serialNumber']);
   }, [selectedEquipmentType]);

   return (
      <FormProvider {...methods}>
         <Container maxWidth="1200px" paddingY={8}>
            <Flex
               direction="column"
               alignItems="flex-start"
               as="form"
               onSubmit={methods.handleSubmit(handleFormSubmit)}
            >
               <Flex gap="lg">
                  <Box>
                     <Box maxWidth={'40ch'}>
                        <Input
                           isRequired
                           label="title"
                           {...register('name', {
                              required: 'Please provide a name',
                              validate: {
                                 isDeviceName: (v: string) =>
                                    validate(v).isDeviceName() || 'Invalid device name',
                              },
                           })}
                           error={errors?.name?.message}
                        />
                        <Input
                           isRequired
                           label="IP Address"
                           {...register('ipaddress', {
                              required: 'Please provide an IP Address',
                              validate: {
                                 isIpAddress: (v: string) =>
                                    validate(v).isIpAddress() || 'invalid ip address format',
                              },
                           })}
                           error={errors?.ipaddress?.message}
                        />
                     </Box>
                  </Box>
               </Flex>
               <Spacer minHeight={'2rem'} />
               <Flex gap="xxl" placeSelf={'stretch'}>
                  {/** Column 1 */}
                  <Flex direction={'column'} gap="sm" flexShrink={0} flexGrow={1}>
                     <Heading size="sm">Equipment</Heading>
                     <TypeAheadSelectInput
                        defaultValue={
                           selectedEquipmentType
                              ? { name: selectedEquipmentType, value: selectedEquipmentType }
                              : undefined
                        }
                        isLoading={false}
                        isSuccess={true}
                        isError={false}
                        error={equipmentError.type}
                        isRequired={true}
                        options={equipmentTypes.map((data: string) => ({
                           name: data,
                           value: data,
                        }))}
                        label={'Equipment type'}
                        onChange={(value) => {
                           console.log('value', value);
                           setSelectedEquipmentType(value);
                           setSelectedProductLine('');
                           setSelectedModelName('');
                           setEquipmentError({ ...equipmentError, type: '' });
                        }}
                     />
                     {productLines && productLines.length > 0 ? (
                        <TypeAheadSelectInput
                           defaultValue={
                              selectedProductLine
                                 ? { name: selectedProductLine, value: selectedProductLine }
                                 : undefined
                           }
                           isLoading={false}
                           isSuccess={true}
                           isError={false}
                           error={equipmentError.productLine}
                           isRequired={true}
                           options={productLines.map((data: string) => ({
                              name: data,
                              value: data,
                           }))}
                           label={'Product Line'}
                           onChange={(value) => {
                              setSelectedProductLine(value);
                              setSelectedModelName('');
                              setEquipmentError({ ...equipmentError, productLine: '' });
                           }}
                           inputName="productLine"
                        />
                     ) : (
                        <Input
                           isRequired
                           isDisabled={isDisabled}
                           label="Product Line"
                           {...register('productLine', {
                              required: equipmentErrors.productError,
                           })}
                           error={errors?.productLine?.message}
                           onChange={(e) => {
                              setSelectedProductLine(e.target.value);
                           }}
                        />
                     )}
                     {models && models.length > 0 ? (
                        <TypeAheadSelectInput
                           isLoading={false}
                           isSuccess={true}
                           isError={false}
                           isRequired={true}
                           error={equipmentError.model}
                           options={models.map((data: string) => ({
                              name: data,
                              value: data,
                           }))}
                           label={'Model'}
                           onChange={(id) => {
                              setSelectedModelName(id);
                              setEquipmentError({ ...equipmentError, model: '' });
                           }}
                           defaultValue={
                              selectedModelName
                                 ? { name: selectedModelName, value: selectedModelName }
                                 : undefined
                           }
                        />
                     ) : (
                        <Input
                           isRequired
                           isDisabled={isDisabled}
                           label="Model"
                           {...register('modelName', {
                              required: equipmentErrors.modelError,
                           })}
                           onChange={(e) => {
                              setSelectedModelName(e.target.value);
                           }}
                           error={errors?.modelName?.message}
                        />
                     )}
                     {selectedEquipmentType === 'Miscellaneous' ? (
                        <>
                           <Input
                              isDisabled={isDisabled}
                              label="Firmware Version"
                              {...register('firmware', {
                                 required: false,
                              })}
                              error={errors?.firmware?.message}
                           />
                           <Input
                              isDisabled={isDisabled}
                              label="Serial Number"
                              {...register('serialNumber', {
                                 required: false,
                              })}
                              error={errors?.serialNumber?.message}
                           />
                        </>
                     ) : (
                        <>
                           <Input
                              isRequired
                              isDisabled={isDisabled}
                              label="Firmware Version"
                              {...register('firmware', {
                                 required: 'Please enter a firmware version',
                              })}
                              error={errors?.firmware?.message}
                           />
                           <Input
                              isRequired
                              isDisabled={isDisabled}
                              label="Serial Number"
                              {...register('serialNumber', {
                                 required: 'Please enter a serial number',
                              })}
                              error={errors?.serialNumber?.message}
                           />
                           {selectedEquipmentType === 'Workstation' ? null : (
                              <Input
                                 label="Scan efficiency target"
                                 {...register('scanEfficiencyTargetCfg', {
                                    pattern: {
                                       value: /^[0-9]*$/,
                                       message: 'Scan efficiency target must contain only numbers',
                                    },
                                 })}
                                 error={errors?.scanEfficiencyTargetCfg?.message}
                                 type="number"
                              />
                           )}
                        </>
                     )}
                     <Input label="Algorithm Version" {...register('algorithmVersion')} />

                     {selectedProductLine === 'PVS Workstation' ||
                        selectedProductLine === 'SVS Workstation' ||
                        selectedProductLine === 'CT' ? (
                        <NetworkTypeahead
                           onChange={(values) => setNetwork(Number(values))}
                           defaultValue={network ? network : undefined}
                        />
                     ) : null}
                     {selectedProductLine === 'PVS Workstation' ||
                        selectedProductLine === 'SVS Workstation' ? (
                        <>
                           <ScannersMultiSelect control={control} errors={errors} />
                           <Input
                              label="Decision Time Target"
                              type="number"
                              {...register('ctWorkstationDecisionTimeTarget', {
                                 valueAsNumber: true,
                                 min: {
                                    value: 0,
                                    message:
                                       'Decision time target must be greater than or equal to 0',
                                 },
                              })}
                              error={errors?.ctWorkstationDecisionTimeTarget?.message}
                           />
                        </>
                     ) : null}
                  </Flex>
                  {/** Column 2 */}
                  <Flex direction={'column'} gap="sm" flexShrink={0} flexGrow={1}>
                     <Heading size="sm">Location</Heading>
                     <EntityTypeAhead {...registerEntity('airport')} />
                     <EntityTypeAhead {...registerEntity('terminal')} />
                     <EntityTypeAhead {...registerEntity('screening_point')} />
                     <EntityTypeAhead {...registerEntity('lane')} />
                     <Input
                        isDisabled={isDisabled}
                        label="Latitude"
                        {...register('latitude', {
                           valueAsNumber: true,
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
                        label="Longitude"
                        {...register('longitude', {
                           valueAsNumber: true,
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
                  <Button variant="primary" onClick={methods.handleSubmit(handleFormSubmit)} isLoading={isSubmitting}>
                     Save
                  </Button>
                  <Button onClick={onCancel} isDisabled={isSubmitting} variant="tertiary">
                     Cancel
                  </Button>
               </Flex>
            </Flex>
         </Container>
      </FormProvider>
   );
};
