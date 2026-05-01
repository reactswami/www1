import { Box, Button, Container, Flex, Spacer } from '@chakra-ui/react';
import { TypeAheadSelectInput } from '@statseeker/components';
import { Input } from '@statseeker/components/Legacy/Input/Input';
import { useEffect, useMemo } from 'react';
import { FormProvider, type SubmitHandler, useForm } from 'react-hook-form';
import { EntityTypeAhead } from '../EntityTypehead';
import useLocationCategory from '~/features/screeningpoint/hooks/useLocationCategory';
import { useEntityState } from '~/hooks/useEntityState';
import { type EntityType, type RowData } from '~/types/models';
import { showEntityDropdown } from '~/utils';
import { ENTITY_TYPE, LOCATION_CATEGORY } from '~/utils/constants';

interface FormProps {
   onSubmit: SubmitHandler<RowData>;
   isSubmitting: boolean;
   defaultValues?: Partial<RowData>;
   isEnabled?: boolean;
   onCancel: () => void;
   id?: number;
   entityType: EntityType;
}

type DirtyFieldsList = {
   [key: string]: boolean;
};
const PASSENGER_SCAN_EFFICIENCY_TARGETS: EntityType[] = [
   ENTITY_TYPE.SCREENING_POINT,
   ENTITY_TYPE.LANE,
];

export const FormEntity = ({
   onSubmit,
   isSubmitting,
   onCancel,
   defaultValues,
   entityType,
}: FormProps) => {
   const methods = useForm<RowData>({ defaultValues });
   const {
      register,
      formState: { errors, dirtyFields },
      setValue,
   } = methods;

   const { setSaving, getEntityPayload, registerEntity, validateEntity } = useEntityState({
      ...defaultValues,
   });

   const hasEfficiencyTargets = PASSENGER_SCAN_EFFICIENCY_TARGETS.includes(entityType);

   function hasCertainFieldsChanged(dirtyFieldsList: DirtyFieldsList) {
      const fieldsToCheck = ['title'];

      const isAnyFieldDirty = Object.keys(dirtyFieldsList).some((dirtyField: string) =>
         fieldsToCheck.includes(dirtyField)
      );

      return isAnyFieldDirty;
   }

   function handleFormSubmit(data: RowData) {
      setSaving(true);

      if (!validateEntity(entityType)) {
         return;
      }

      const dataNew: any = {
         ...data,
         ...getEntityPayload(entityType),
      };

      onSubmit({
         ...dataNew,
         dirtyFields: hasCertainFieldsChanged(dirtyFields),
      });
   }

   // Entity type wont change in the form
   const isScreeningPoint = entityType === ENTITY_TYPE.SCREENING_POINT;

   // co-locate with the TypeAheadSelectInput render, or:
   useEffect(() => {
      if (isScreeningPoint) {
         register('locationCategory', { required: 'Please provide a location' });
      }
   }, [entityType]);

   const { locationCategories, selectedLocationCategory, setSelectedLocationCategory } =
      useLocationCategory({ locationCategory: defaultValues?.locationCategory, enabled: isScreeningPoint });

   const locationCategoryOptions = useMemo(
      () => locationCategories?.map((data: string) => ({ name: data, value: data })),
      [locationCategories]
   );

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
                           {...register('title', {
                              required: 'please provide a name',
                              pattern: {
                                 value: /^[a-zA-Z0-9][ ,_.a-zA-Z0-9-]*$/,
                                 message:
                                    'Invalid title. Title should start with a letter or number and use only letters, numbers, spaces, commas, periods, underscores, and hyphens',
                              },
                           })}
                           error={errors?.title?.message}
                        />
                     </Box>
                     {showEntityDropdown('airport', entityType) ? (
                        <Box maxWidth={'40ch'} marginTop={'10px'}>
                           <EntityTypeAhead {...registerEntity('airport')} />
                        </Box>
                     ) : null}
                     {showEntityDropdown('terminal', entityType) ? (
                        <Box maxWidth={'40ch'} marginTop={'10px'}>
                           <EntityTypeAhead {...registerEntity('terminal')} />
                        </Box>
                     ) : null}
                     {showEntityDropdown('screening_point', entityType) ? (
                        <Box maxWidth={'40ch'} marginTop={'10px'}>
                           <EntityTypeAhead
                              {...registerEntity('screening_point')}
                              onItemChange={(e) => {
                                 return e?.locationCategory
                                    ? setValue(
                                       'showMore',
                                       e?.locationCategory === LOCATION_CATEGORY.BACK_OF_HOUSE
                                    )
                                    : setValue('showMore', false);
                              }}
                           />
                        </Box>
                     ) : null}
                     {showEntityDropdown('lane', entityType) ? (
                        <Box maxWidth={'40ch'} marginTop={'10px'}>
                           <EntityTypeAhead {...registerEntity('lane')} />
                        </Box>
                     ) : null}
                     {isScreeningPoint ? (
                        <Box marginTop={'10px'}>
                           <TypeAheadSelectInput
                              key={selectedLocationCategory ?? 'unset'}
                              label="Location"
                              defaultValue={
                                 selectedLocationCategory
                                    ? {
                                       name: selectedLocationCategory,
                                       value: selectedLocationCategory,
                                    }
                                    : undefined
                              }
                              isRequired={true}
                              options={locationCategoryOptions}
                              isLoading={false}
                              isSuccess={true}
                              isError={false}
                              error={errors.locationCategory?.message}
                              onChange={(value) => {
                                 setSelectedLocationCategory(value);
                                 setValue('locationCategory', value);
                              }}
                           />
                        </Box>
                     ) : null}
                     {hasEfficiencyTargets ? (
                        <Box maxWidth={'40ch'} marginTop={'10px'}>
                           {!selectedLocationCategory ? null : selectedLocationCategory === LOCATION_CATEGORY.BACK_OF_HOUSE ? (
                              <Input
                                 label="Scan efficiency target"
                                 {...register('checkedBaggageScanEfficiencyTargetCfg', {
                                    pattern: {
                                       value: /^[0-9]*$/,
                                       message:
                                          'Invalid checked baggage scan efficiency target. Checked Baggage Scan efficiency target must contain only numbers',
                                    },
                                 })}
                                 error={errors?.checkedBaggageScanEfficiencyTargetCfg?.message}
                                 type="number"
                              />
                           ) : (
                              <>
                                 <Input
                                    label="Passenger scan efficiency target"
                                    {...register('passengerScanEfficiencyTargetCfg', {
                                       pattern: {
                                          value: /^[0-9]*$/,
                                          message:
                                             'Invalid passenger scan efficiency target. Passenger Scan efficiency target must contain only numbers',
                                       },
                                    })}
                                    error={errors?.passengerScanEfficiencyTargetCfg?.message}
                                    type="number"
                                 />
                                 <Input
                                    label="PAX baggage scan efficiency target"
                                    {...register('carryOnBaggageScanEfficiencyTargetCfg', {
                                       pattern: {
                                          value: /^[0-9]*$/,
                                          message:
                                             'Invalid PAX baggage scan efficiency target. PAX baggage efficiency target must contain only numbers',
                                       },
                                    })}
                                    error={errors?.carryOnBaggageScanEfficiencyTargetCfg?.message}
                                    type="number"
                                 />
                                 <Input
                                    label="Trace scan efficiency target"
                                    {...register('traceScanEfficiencyTargetCfg', {
                                       pattern: {
                                          value: /^[0-9]*$/,
                                          message:
                                             'Invalid trace scan efficiency target. Trace scan efficiency target must contain only numbers',
                                       },
                                    })}
                                    error={errors?.traceScanEfficiencyTargetCfg?.message}
                                    type="number"
                                 />
                              </>
                           )}
                        </Box>
                     ) : null}
                  </Box>
               </Flex>
               <Spacer minHeight={'2rem'} />
               <Flex justifyContent={'flex-start'} gap="md" paddingTop={'2rem'}>
                  <Button onClick={methods.handleSubmit(handleFormSubmit)} isLoading={isSubmitting}>
                     Save
                  </Button>
                  <Button onClick={onCancel} isDisabled={isSubmitting} variant="ghost">
                     Cancel
                  </Button>
               </Flex>
            </Flex>
         </Container>
      </FormProvider>
   );
};
