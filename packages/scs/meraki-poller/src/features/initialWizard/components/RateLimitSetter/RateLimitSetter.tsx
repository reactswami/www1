import { Box, Flex } from '@chakra-ui/react';
import styled from '@emotion/styled';
import { Input } from '@statseeker/components';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { updateGlobalConfig } from '~/api';
import { RateLimitHelperText } from '~/components';
import { DEFAULT_RATE_LIMIT } from '~/config/defaults';
import { StepperButtons } from '~/features/initialWizard/components';
import { useToast } from '~/lib/Chakra';
import { type APIGlobalSchema } from '~/types/api';
import { type DeepPartial } from '~/types/utils';

const StyledInput = styled.div`
   .chakra-input__group {
      input {
         flex-grow: 0;
         max-width: 8ch;
      }
   }
`;

interface FieldValues {
   rate_limit: string;
}
interface Props {
   onNext: () => void;
   onPrevious: () => void;
}

export const RateLimitSetter = ({ onNext, onPrevious }: Props) => {
   const toast = useToast();
   const {
      register,
      formState: { errors },
      handleSubmit,
   } = useForm<FieldValues>({
      defaultValues: { rate_limit: DEFAULT_RATE_LIMIT.toString() },
   });
   const { mutate, isPending } = useMutation({
      mutationFn: (newConfig: DeepPartial<APIGlobalSchema>) => updateGlobalConfig(newConfig),
      onSuccess: onNext,
      onError: () =>
         toast({
            status: 'error',
            title: 'Error',
            description:
               'Error contacting the server. If the problem persists, please contact Statseeker support.',
         }),
   });
   const onSubmit = async (data: FieldValues) => {
      const rateLimit = Number(data.rate_limit);
      await mutate({ rate_limit: rateLimit });
   };

   return (
      <form>
         <Flex direction="column" gap="sm" maxWidth="28rem">
            <RateLimitHelperText />
         </Flex>
         <Box height={3} />
         <StyledInput>
            <Input
               {...register('rate_limit', {
                  required: 'Please provide a rate limit',
                  pattern: {
                     value: /^\d+$/,
                     message: 'Invalid value: please provide a numeric value between 1 and 10',
                  },
                  min: {
                     value: 0.1,
                     message: 'Invalid value: rate limit must be 1 or greater',
                  },
                  max: {
                     value: 10,
                     message: 'Invalid value: rate limit cannot be greater than 10',
                  },
               })}
               helpText={'Rate limit can be set from 1 to 10 requests per second'}
               error={errors['rate_limit']?.message as string}
               rightAddon={<p>request(s) per second</p>}
            />
         </StyledInput>
         <StepperButtons
            onNext={handleSubmit(onSubmit)}
            onPrevious={onPrevious}
            isLoading={isPending}
            canPrevious={true}
         />
      </form>
   );
};
