import { Button, Flex, Heading, Switch, Tooltip } from '@chakra-ui/react';
import styled from '@emotion/styled';
import {
   ExclamationTriangleIcon,
   InfoCircledIcon,
} from '@radix-ui/react-icons';
import { Input } from '@statseeker/components';
import { theme } from '@statseeker/ui/theme';
import { type SubmitHandler, useFormContext } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { NetworkConfigForm } from '~/components';
import { useFetchGlobalConfig } from '~/hooks/useFetchGlobalConfig';
import { type ApiNetworkCustomRule } from '~/types/api';

const NameInput = styled.div`
   input {
      max-width: min(16rem, 100%);
   }
`;

const StyledSwitch = styled.label`
   padding: 0.5rem;
   align-self: flex-start;
   border-radius: 0.25rem;
   transition: background 200ms ease-in;
   cursor: pointer;
   min-height: 3rem;
   flex-basis: 16rem;
   display: flex;
   align-items: center;
   > div {
      flex: 1 1 0;
   }
   &:hover {
      background-color: ${theme.colors.gray[100]};
   }
`;

const Alert = styled.div<{ color: 'red' | 'primary' }>`
   ${(props) => `
      border: 1px solid ${theme.colors[props.color][300]};
      background-color: ${theme.colors[props.color][25]};
      color: ${theme.colors[props.color][500]};
   `}
   font-size: ${theme.textStyles.label.fontSize};
   display: flex;
   align-items: center;
   gap: 0.5rem;
   padding: 0.25rem 0.5rem;
   border-radius: 0.25rem;
   margin-left: 1rem;
   max-width: max-content;
`;
export interface FieldValues extends ApiNetworkCustomRule {}

export interface FormProps {
   onSubmit: SubmitHandler<FieldValues>;
   defaultValues?: FieldValues;
   isLoading: boolean;
   shouldEnsureUniqueName?: boolean;
}
export const Form = ({
   onSubmit,
   defaultValues,
   isLoading,
   shouldEnsureUniqueName = false,
}: FormProps) => {
   const {
      register,
      watch,
      handleSubmit,
      setValue,
      formState: { errors, isDirty },
   } = useFormContext<FieldValues>();

   const navigate = useNavigate();
   const { data } = useFetchGlobalConfig();

   // Because we control the value of the selected network, we need to handle it ourselves
   const preSubmit = (data: FieldValues) => {
      onSubmit({ ...data });
   };

   const isShowDisableWarning = isDirty
      ? !watch('enabled')
      : defaultValues?.enabled === false;

   return (
      <form>
         <Flex flexDirection={'column'} as="form">
            <NameInput>
               <Input
                  label={'rule name'}
                  {...register('name', {
                     required: 'Please provide a name',
                     pattern: {
                        value: /\S+/,
                        message:
                           'Invalid value: please use at least one alphanumeric character.',
                     },
                     validate: {
                        isUnique: (v) => {
                           if (!shouldEnsureUniqueName) {
                              return true; // True mean 'all good to go!'
                           }
                           return (
                              !data?.data.rules.network
                                 .map(({ name }) => name)
                                 .includes(v) ||
                              `Invalid name: ${v} already exists, please choose a different name`
                           );
                        },
                     },
                  })}
                  error={errors['name']?.message as string}
                  defaultValue={defaultValues?.name}
               />
            </NameInput>

            <Flex flexDirection={'column'} gap="sm" paddingY={4}>
               <Heading size="sm">General options</Heading>
               <Flex flexDirection={'column'} flexGrow={1}>
                  <Flex alignItems={'center'}>
                     <StyledSwitch>
                        <Flex
                           alignItems={'center'}
                           justifyContent="space-between"
                        >
                           Enable data collection
                           <Switch
                              {...register('enabled', {
                                 onChange: (e) => {
                                    if (e.target.checked === false) {
                                       setValue('priority_network', false);
                                    }
                                 },
                              })}
                              defaultChecked={defaultValues?.enabled ?? true}
                           />
                        </Flex>
                     </StyledSwitch>
                     {isShowDisableWarning && (
                        <Alert role={'alert'} color="red">
                           <ExclamationTriangleIcon />
                           Data won't be collected for networks affected by this
                           rule
                        </Alert>
                     )}
                  </Flex>
               </Flex>
               <Flex flexDirection={'column'} flexGrow={1}>
                  <Flex alignItems={'center'}>
                     <StyledSwitch>
                        <Flex
                           alignItems={'center'}
                           justifyContent="space-between"
                        >
                           <Flex gap="sm" alignItems={'center'}>
                              Priority network
                              <Tooltip
                                 label={
                                    'Data for priority networks are collected before all other networks.'
                                 }
                              >
                                 <InfoCircledIcon />
                              </Tooltip>
                           </Flex>
                           <Switch
                              {...register('priority_network')}
                              isDisabled={isShowDisableWarning}
                              defaultChecked={
                                 isShowDisableWarning
                                    ? false
                                    : defaultValues?.priority_network ?? false
                              }
                           />
                        </Flex>
                     </StyledSwitch>
                  </Flex>
               </Flex>
            </Flex>

            <Flex gap="lg">
               <NetworkConfigForm />
            </Flex>
            <Flex gap="sm" paddingTop={8}>
               <Button
                  size="md"
                  onClick={handleSubmit(preSubmit)}
                  isLoading={isLoading}
               >
                  Save
               </Button>
               <Button
                  size="md"
                  variant={'ghost'}
                  onClick={() => navigate(-1)}
                  isDisabled={isLoading}
               >
                  Cancel
               </Button>
            </Flex>
         </Flex>
      </form>
   );
};
