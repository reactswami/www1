import { Box, Button, Flex, Heading } from '@chakra-ui/react';
import styled from '@emotion/styled';
import { Input } from '@statseeker/components';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { AffectedEntityList } from '~/components/AffectedEntityList';
import { Loader } from '~/components/Loader';
import { RateLimitHelperText } from '~/components/RateLimitHelperText';
import { DEFAULT_RATE_LIMIT } from '~/config/defaults';
import { Section } from '~/features/settings/components/Section';
import { useFetchGlobalConfig } from '~/hooks/useFetchGlobalConfig';
import { type ApiOrganizationCustomRule } from '~/types/api';

const StyledInput = styled.div`
   .chakra-input__group {
      input {
         flex-grow: 0;
         max-width: 8ch;
      }
   }
`;
const StyledNameInput = styled.div`
   input {
      max-width: min(16rem, 100%);
   }
`;

interface OrganizationRuleFormProps {
   onSubmit: SubmitHandler<OrganizationRuleFieldValues>;
   selectedOrganizations: string[];
   defaultValues?: OrganizationRuleFieldValues;
   isLoading: boolean;
   shouldEnsureUniqueName?: boolean;
}

export type OrganizationRuleFieldValues = Partial<ApiOrganizationCustomRule>;

export const OrganizationRuleForm = ({
   onSubmit,
   selectedOrganizations,
   defaultValues = {
      enabled: true,
      rate_limit: DEFAULT_RATE_LIMIT,
      name: '',
   },
   isLoading,
   shouldEnsureUniqueName = false,
}: OrganizationRuleFormProps) => {
   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm<OrganizationRuleFieldValues>({
      defaultValues,
   });
   const navigate = useNavigate();
   const { data, isLoading: isFetchingGlobalConfig } = useFetchGlobalConfig();

   if (isFetchingGlobalConfig) {
      return <Loader />;
   }

   return (
      <Flex flexDirection={'row'}>
         <Box flexBasis={'70%'}>
            <Section>
               <form>
                  <StyledNameInput>
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
                                    !data?.data.rules.organization
                                       .map(({ name }) => name)
                                       .includes(v ?? '') ||
                                    `Invalid name: ${v} already exists, please choose a different name`
                                 );
                              },
                           },
                        })}
                        error={errors['name']?.message as string}
                        defaultValue={defaultValues?.name}
                     />
                  </StyledNameInput>

                  <Flex
                     flexDirection={'column'}
                     justifyContent={'flex-start'}
                     gap="sm"
                     paddingY={4}
                  >
                     <Heading size="sm">Rate limit</Heading>

                     <RateLimitHelperText />

                     <StyledInput>
                        <Input
                           {...register('rate_limit', {
                              required: 'Please provide a rate limit',
                              pattern: {
                                 value: /^\d+$/,
                                 message:
                                    'Invalid value: please provide a numeric value between 1 and 10',
                              },
                              min: {
                                 value: 0.1,
                                 message:
                                    'Invalid value: rate limit must be 0.1 or greater',
                              },
                              max: {
                                 value: 10,
                                 message:
                                    'Invalid value: rate limit cannot be greater than 10',
                              },
                           })}
                           helpText={
                              'Rate limit can be set from 1 to 10 requests per second'
                           }
                           error={errors['rate_limit']?.message as string}
                           rightAddon={<p>request(s) per second</p>}
                        />
                     </StyledInput>
                  </Flex>

                  <Flex gap="base">
                     <Button
                        isLoading={isLoading}
                        onClick={handleSubmit(onSubmit)}
                     >
                        Save
                     </Button>
                     <Button
                        isDisabled={isLoading}
                        variant={'ghost'}
                        onClick={() => navigate(-1)}
                     >
                        Cancel
                     </Button>
                  </Flex>
               </form>
            </Section>
         </Box>

         <Box flexBasis={'30%'}>
            <AffectedEntityList
               selectedEntities={selectedOrganizations}
               type="organization"
            />
         </Box>
      </Flex>
   );
};
