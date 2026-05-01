import { Box, Flex, Heading } from '@chakra-ui/react';
import styled from '@emotion/styled';
import { Input } from '@statseeker/components';
import { useFormContext } from 'react-hook-form';
import { RateLimitHelperText } from '..';
import { DEFAULT_RATE_LIMIT } from '~/config/defaults';

const StyledBox = styled(Box)`
   input {
      max-width: 8ch;
   }
`;

export interface OrganizationConfig {
   requestTimeout: number;
   rateLimit: number;
   requestLimit: number;
   maxRetries: number;
}

export const defaultOrganizationConfig: OrganizationConfig = {
   rateLimit: 5,
   requestLimit: 10,
   maxRetries: 1,
   requestTimeout: 60,
};

export const OrganizationConfigForm = () => {
   const {
      register,
      formState: { errors },
      getValues,
   } = useFormContext();
   return (
      <Flex flexDirection={'column'} gap="sm">
         <Heading size="sm">Rate limit</Heading>
         <Flex flexDirection={'column'} gap="xxs">
            <RateLimitHelperText />
         </Flex>
         <StyledBox>
            <Input
               defaultValue={
                  getValues('rate_limit')?.toString() ?? DEFAULT_RATE_LIMIT
               }
               {...register('rate_limit', {
                  required: 'Please provide a rate limit',
                  pattern: {
                     value: /^\d+$/,
                     message:
                        'Invalid value: please provide a numeric value between 1 and 10',
                  },
                  min: {
                     value: 0.1,
                     message: 'Invalid value: rate limit must be 1 or greater',
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
         </StyledBox>
      </Flex>
   );
};
