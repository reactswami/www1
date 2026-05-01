import { Box, FormControl, FormErrorMessage } from '@chakra-ui/react';
import { ChevronDownIcon, Cross2Icon } from '@radix-ui/react-icons';
import { FormLabel } from '@statseeker/components/Legacy/Input/Label/Label';
import { Controller, type Control, type FieldErrors } from 'react-hook-form';
import AsyncSelect, { components, type CSSObjectWithLabel } from 'react-select';
import { useFetchEntity } from '~/hooks';
import { type Equipment, type RowData } from '~/types';

export function ScannersMultiSelect({
   control,
   errors,
}: {
   control: Control<RowData>;
   errors: FieldErrors<RowData>;
}) {
   const { data, error } = useFetchEntity('device_equipment');

   return (
      <FormControl isInvalid={!!errors?.ctWorkstationScanners?.message}>
         <FormLabel label="Scanners">
            <Controller
               name="ctWorkstationScanners"
               control={control}
               render={({ field }) => (
                  <AsyncSelect
                     {...field}
                     value={field.value?.map((value) => ({ value, label: value }))}
                     isMulti
                     placeholder="Select ..."
                     hideSelectedOptions={false}
                     components={{
                        ValueContainer,
                        DropdownIndicator: CustomDropdownIndicator,
                        ClearIndicator: CustomClearIndicator,
                     }}
                     styles={{
                        control: (base: CSSObjectWithLabel) => ({
                           ...base,
                           minHeight: 0,
                           height: 'var(--chakra-sizes-8)',
                           borderRadius: '0.125rem',
                           borderColor: errors?.ctWorkstationScanners?.message
                              ? 'rgb(202, 33, 38);'
                              : 'inherit',
                           ':focus-visible': {
                              borderColor: 'var(--chakra-colors-primary-500)',
                              boxShadow: '0 0 0 1px var(--chakra-colors-primary-500)',
                           },
                           fontSize: 'var(--chakra-fontSizes-sm)',
                           fontWeight: 'var(--chakra-fontWeights-normal)',
                           color: 'inherit',
                           textTransform: 'none',
                           boxShadow: errors?.ctWorkstationScanners?.message
                              ? 'rgb(202, 33, 38) 0px 0px 0px 1px;'
                              : 'none',
                        }),
                        indicatorsContainer: (base: CSSObjectWithLabel) => ({
                           ...base,
                           display: 'flex',
                           gap: ' var(--chakra-space-sm)',
                        }),
                        option: (base: CSSObjectWithLabel, state) => ({
                           ...base,
                           fontWeight: 'normal',
                           textTransform: 'none',
                           backgroundColor: state.isSelected
                              ? 'var(--chakra-colors-primary-500)'
                              : state.isFocused
                              ? 'var(--chakra-colors-primary-500)'
                              : 'white',
                           color: state.isSelected
                              ? 'white'
                              : state.isFocused
                              ? 'white'
                              : 'var(--chakra-colors-gray-900)',
                        }),
                        dropdownIndicator: (base: CSSObjectWithLabel) => ({
                           ...base,
                           padding: '6px',
                           color: '#3d4e61',
                        }),
                        clearIndicator: (base: CSSObjectWithLabel) => ({
                           ...base,
                           padding: '6px',
                        }),
                        placeholder: (base: CSSObjectWithLabel) => ({
                           ...base,
                           fontSize: 'var(--chakra-fontSizes-sm)',
                           color: 'var(--chakra-colors-gray-500)',
                        }),
                     }}
                     options={data
                        ?.filter((e: Equipment) => e.productLine === 'CT')
                        .map((item: Equipment) => ({
                           value: item.name,
                           label: item.name,
                        }))}
                     onChange={(option: readonly { value: string; label: string }[]) =>
                        field.onChange(option.map((v) => v.value))
                     }
                  ></AsyncSelect>
               )}
            ></Controller>
         </FormLabel>
         {errors && <FormErrorMessage>{errors.ctWorkstationScanners?.message}</FormErrorMessage>}
      </FormControl>
   );
}

const ValueContainer = (props: any) => {
   let length = props.getValue().length;

   return length > 1 ? (
      <components.ValueContainer {...props}>
         {`${length} Items`}
         {props.children[1]}
      </components.ValueContainer>
   ) : (
      <components.ValueContainer {...props}>{props.children}</components.ValueContainer>
   );
};

const CustomDropdownIndicator = (props: any) => {
   return (
      <components.DropdownIndicator {...props}>
         <ChevronDownIcon />
      </components.DropdownIndicator>
   );
};

const CustomClearIndicator = (props: any) => {
   return (
      <components.ClearIndicator {...props}>
         <Box _hover={{ color: 'primary.400' }}>
            <Cross2Icon cursor="pointer" />
         </Box>
      </components.ClearIndicator>
   );
};
