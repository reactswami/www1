import { Box, Button, Container, Flex, Spacer } from '@chakra-ui/react';
import { Input } from '@statseeker/components/Legacy/Input';
import { useState } from 'react';
import { FormProvider, type SubmitHandler, useForm } from 'react-hook-form';
import { EntityTypeAhead } from '../EntityTypehead';
import { useEntityState } from '~/hooks/useEntityState';
import { type EntityType, type RowData } from '~/types/models';
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

export const FormLane = ({
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
   } = methods;

   const { setSaving, getEntityPayload, registerEntity, validateEntity } = useEntityState({
      ...defaultValues,
   });

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
         ...getEntityPayload(ENTITY_TYPE.LANE),
      };

      onSubmit({
         ...dataNew,
         dirtyFields: hasCertainFieldsChanged(dirtyFields),
      });
   }

   const [showBaggageScanner, setShowBaggageScanner] = useState<boolean | undefined>(undefined);

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
                     <Box maxWidth={'40ch'} marginTop={'10px'}>
                        <EntityTypeAhead {...registerEntity('airport')} />
                     </Box>
                     <Box maxWidth={'40ch'} marginTop={'10px'}>
                        <EntityTypeAhead {...registerEntity('terminal')} />
                     </Box>
                     <Box maxWidth={'40ch'} marginTop={'10px'}>
                        <EntityTypeAhead
                           {...registerEntity('screening_point')}
                           onItemChange={(e) => {
                              if (!e?.locationCategory) {
                                 setShowBaggageScanner(undefined);
                                 return;
                              }
                              setShowBaggageScanner(e?.locationCategory === LOCATION_CATEGORY.BACK_OF_HOUSE);
                           }}
                        />
                     </Box>
                     <Box maxWidth={'40ch'} marginTop={'10px'}>
                        {showBaggageScanner === undefined ? null : showBaggageScanner ? (
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
