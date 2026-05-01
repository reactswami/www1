import {
   Box,
   Button,
   Flex,
   FormControl,
   FormLabel,
   Switch,
   Text,
   Tooltip,
} from '@chakra-ui/react';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import { type IpRange, type IpRangeConfig } from '@statseeker/api/internal_api/entities';
import { Input } from '@statseeker/components';
import { useToast } from '@statseeker/hooks/useToast';
import { getProductName } from '@statseeker/utils/environment';
import { memo, useCallback, useMemo } from 'react';
import { type Control, Controller, FormProvider, type RegisterOptions } from 'react-hook-form';
import { NetworkRangesBuilder } from '../NetworkRangesBuilder';
import { useRangesForm } from './useRangesForm';

export type RangeFormProps =
   | (
        | {
             mode: 'add';
          }
        | {
             mode: 'edit' | 'copy';
             defaultValues: IpRangeConfig;
          }
     ) & {
        onSuccess: (data: IpRangeConfig[]) => void;
        onError: (message: string) => void;
        allowImportExport?: boolean;
     };

export const RangesForm = memo(function RangesForm({
   props = { mode: 'add', allowImportExport: true, onSuccess: () => {}, onError: () => {} },
}: {
   props: RangeFormProps;
}) {
   const { methods, rangesMutation } = useRangesForm({ props });
   const {
      register,
      handleSubmit,
      control,
      formState: { errors, isDirty },
   } = methods;

   const isChecked = (value: number) => {
      return 1 === value;
   };
   const toast = useToast();

   const onSubmit = useCallback(function onSubmit(data: IpRangeConfig) {
      rangesMutation.mutate({ ipRangeConfig: data });
   }, [rangesMutation]);

   const handleSubmitCheck = useCallback(function handleSubmitConfirmation() {
      if (!isDirty && props.mode === 'edit') {
         toast({
            title: 'Unchanged',
            description: 'Save is not needed as data has not been modified',
            status: 'info',
         });
      }
      else {
         handleSubmit(onSubmit)();
      }
   }, [isDirty, props.mode, toast, handleSubmit, onSubmit]);

   const ipRangeValidators: Omit<RegisterOptions, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'> = useMemo(() => ({
      validate: {
         required: (ip_range: IpRange) => {
            if (ip_range.include && ip_range.include.join('').trim() !== '') {
               return true;
            }
            return '{include[0]}At least one include range must be provided';
         },
         invalid: (ip_range: IpRange) => {
            // We do need to escape the [] for some reason
            // eslint-disable-next-line no-useless-escape
            const ipv4Regex = new RegExp(/^[0-9.,:\[\]*\/ -]+\.[0-9.,:\[\]*\/ -]+$/);
            // eslint-disable-next-line no-useless-escape
            const ipv6Regex = new RegExp(/^[0-9a-fA-F,:\[\]*\/ -]+:[0-9a-fA-F,:\[\]*\/ -]*$/);
            for (let i = 0; i < ip_range.include.length; i++) {
               let value = ip_range.include[i];
               if (value === null || value.trim() === '') {
                  continue;
               }
               let v4Test = value.match(ipv4Regex);
               let v6Test = value.match(ipv6Regex);
               if (!v4Test && !v6Test || v4Test && v6Test) {
                  return `{include[${i}]}Invalid format, see help for valid formats`;
               }
            }
            for (let i = 0; i < ip_range.exclude.length; i++) {
               let value = ip_range.exclude[i];
               if (value === null || value.trim() === '') {
                  continue;
               }
               let v4Test = value.match(ipv4Regex);
               let v6Test = value.match(ipv6Regex);
               if (!v4Test && !v6Test || v4Test && v6Test) {
                  return `{exclude[${i}]}Invalid format, see help for valid formats`;
               }
            }
            return true;
         },
         identical: (ip_range: IpRange) => {
            let inMap: {[key: string]: number} = {};
            for (let i = 0; i < ip_range.include.length; i++) {
               let value = ip_range.include[i];
               if (value === null) {
                  continue;
               }
               value = value.trim();
               if (inMap[value] !== undefined) {
                  return `{include[${i}]}This range is already defined as an include`;
               }
               inMap[value] = i;
            }
            let exMap: {[key: string]: number} = {};
            for (let i = 0; i < ip_range.exclude.length; i++) {
               let value = ip_range.exclude[i];
               if (value === null) {
                  continue;
               }
               value = value.trim();
               if (exMap[value] !== undefined) {
                  return `{exclude[${i}]}This range is already defined as an exclude`;
               }
               exMap[value] = i;
            }
            let includes = Object.keys(inMap);
            for (let i = 0; i < includes.length; i++) {
               if (exMap[includes[i]] !== undefined) {
                  return `{include[${i}]}This range is defined as an exclude, so it will not be included`;
               }
            }
            return true;
         }
      },
   }), []);

   return (
      <FormProvider {...methods}>
         <form
            id="RangesForm"
            onSubmit={handleSubmit(handleSubmitCheck)}
            noValidate
         >
            <Flex gap={3} flexDir={'column'}>
               <Text>
                  These IP Address Ranges will be saved in {getProductName()} and made available for
                  use in future Network Discovery processes.
               </Text>
               <Box w={350}>
                  <Input
                     tabIndex={100}
                     isRequired
                     label="Name"
                     {...register('name', {
                        required: 'Please provide a name',
                     })}
                     error={errors.name?.message}
                  />
               </Box>
               <Controller
                  control={control}
                  name="enabled"
                  render={({ field: { onChange, onBlur, value, ref } }) => {
                     return (
                        <FormControl display="flex" alignItems="center" gap={2}>
                           <FormLabel htmlFor={'enabled'} margin={0} lineHeight={1}>
                              {'ENABLED FOR NETWORK DISCOVERY'}
                           </FormLabel>
                           <Tooltip
                              label={
                                 'If enabled these ranges will be used by default in Network Discoveries. These ranges can still be manually selected for use in Network Discoveries even if disabled.'
                              }
                           >
                              <InfoCircledIcon />
                           </Tooltip>
                           <Switch
                              tabIndex={101}
                              onChange={(e) => onChange(e.target.checked ? 1 : 0)}
                              onBlur={onBlur}
                              name={'enabled'}
                              isChecked={isChecked(Number(value))}
                              defaultChecked={true}
                              ref={ref}
                           />
                        </FormControl>
                     );
                  }}
               />
               <Controller
                  // This wasn't happy, and i've no idea what changed to make it so
                  control={control as Control<any>}
                  name="ip_range"
                  rules={ipRangeValidators}
                  render={({ field, fieldState }) => {
                     return (
                        <NetworkRangesBuilder
                           value={field.value}
                           onChange={field.onChange}
                           error={fieldState.error}
                           exposeNulls={true}
                           allowImportExport={props.allowImportExport}
                        />
                     );
                  }}
               />
               <Box marginTop={15}>
                  <Button className="SaveRange" type="submit" tabIndex={9000}>
                     Save
                  </Button>
               </Box>
            </Flex>
         </form>
      </FormProvider>
   );
});
