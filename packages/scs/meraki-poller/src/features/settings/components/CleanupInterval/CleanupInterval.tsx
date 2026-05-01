import { Flex, Switch } from '@chakra-ui/react';
import styled from '@emotion/styled';
import { Input } from '@statseeker/components';
import { theme } from '@statseeker/ui/theme';
import { useFormContext } from 'react-hook-form';
import { Loader } from '~/components/Loader';
import { useFetchGlobalConfig } from '~/hooks/useFetchGlobalConfig';
import { type ApiStalableDatatype } from '~/types/api';

const Label = styled.label`
   display: flex;
   align-items: center;
   flex: 0 0 12rem;
   justify-content: space-between;
   padding-right: 1rem;
   cursor: pointer;
   transition: 100ms all ease-in;
   padding: 0.5rem;
   border-radius: 0.25rem;
   text-transform: capitalize;
   :hover {
      background-color: ${theme.colors.gray[50]};
   }
   .label-content {
      flex-grow: 1;
   }
`;

const InputContainer = styled.div`
   input {
      flex: 0 0 3rem;
   }
`;

interface CleanupIntervalProps {
   keyValue: string;
}

export const CleanupInterval = ({ keyValue }: CleanupIntervalProps) => {
   const {
      register,
      formState: { errors, isSubmitting },
      watch,
      getValues,
      setValue,
   } = useFormContext();
   const { data, isLoading } = useFetchGlobalConfig();
   const defaultValue =
      data?.data.cleanup_rules[keyValue as ApiStalableDatatype] ?? 0;
   const defaultChecked = Boolean(defaultValue && defaultValue > 0);
   const currentValue = watch(keyValue);
   const showIntervalInput = currentValue > 0 || currentValue === '';

   if (isLoading || !data) {
      return <Loader />;
   }

   return (
      <Flex gap="sm" alignItems={'center'}>
         <Label>
            <span className="label-content">{keyValue}</span>
            <Switch
               defaultChecked={defaultChecked}
               onChange={(e) => {
                  setValue(keyValue, e.target.checked ? 1 : 0);
               }}
            />
         </Label>
         {showIntervalInput && (
            <InputContainer>
               <Input
                  isDisabled={isSubmitting}
                  defaultValue={defaultValue.toString()}
                  error={errors[keyValue]?.message as string}
                  {...register(keyValue, {
                     minLength: {
                        value: 1,
                        message: 'Invalid value: must be at least one day.',
                     },
                     required: 'Invalid value: must be at least one day.',
                     min: {
                        value: 1,
                        message: 'Invalid value: must be at least one day.',
                     },
                     max: {
                        value: 30,
                        message:
                           'Invalid value: cannot be greater than 30 days.',
                     },
                  })}
                  rightAddon={<span>Days</span>}
               />
            </InputContainer>
         )}
      </Flex>
   );
};
