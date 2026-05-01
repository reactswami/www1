import { Alert, AlertDescription, AlertIcon, Box, Button, Collapse, Flex } from '@chakra-ui/react';
import { MinusCircledIcon, PlusCircledIcon } from '@radix-ui/react-icons';
import { Input } from '@statseeker/components';
import { useMutation } from '@tanstack/react-query';
import { type ReactElement, useState } from 'react';

import { useForm } from 'react-hook-form';
import { testConnection } from '~/api/testConnection';
import { ProxyForm, StepperButtons } from '~/features/initialWizard/components';
import { useToast } from '~/lib/Chakra';
import { type ApiConnection } from '~/types/api';

export type InputValues = ApiConnection;

interface Props {
   nextStep: ({ organizationsFound }: { organizationsFound: number }) => void;
   buttonLabel?: string;
   buttonIcon?: ReactElement;
}

export const ConnectionForm = ({ nextStep, buttonLabel, buttonIcon }: Props) => {
   const toast = useToast();
   const [showProxy, setShowProxy] = useState(false);
   const {
      register,
      formState: { errors },
      handleSubmit,
      resetField,
   } = useForm<InputValues>();

   const { mutate, isPending, isError } = useMutation({
      mutationFn: testConnection,
      onSuccess: (data) => {
         toast({
            status: 'success',
            title: 'Connection successful',
            description: `${data.data.organization_count} organizations found`,
         });
         nextStep({ organizationsFound: data.data.organization_count });
      },
   });

   const handleToggleProxy = () => {
      setShowProxy(!showProxy);
      if (!showProxy) {
         resetProxyForm();
      }
   };

   const onSubmit = async (data: ApiConnection) => {
      await mutate(data);
   };

   const resetProxyForm = () => {
      const inputsToReset: (keyof ApiConnection)[] = [
         'proxy_server',
         'proxy_username',
         'proxy_password',
         'proxy_port',
      ];
      for (const input of inputsToReset) {
         resetField(input);
      }
   };

   return (
      <Box as={'form'}>
         {isError && (
            <Alert status="error" borderRadius={'sm'}>
               <AlertIcon />
               <AlertDescription>
                  Failure to connect to the API, please review your settings.
               </AlertDescription>
            </Alert>
         )}
         <Input
            label="API Key"
            required
            {...register('api_key', {
               required: 'Please provide api key',
            })}
            error={errors['api_key']?.message as string}
         />
         <Collapse in={showProxy} animateOpacity>
            <Box height={2} />
            <ProxyForm register={register} errors={errors} />
         </Collapse>
         <Flex justifyContent={'space-between'} alignItems={'center'} paddingTop={3}>
            <Button
               onClick={handleToggleProxy}
               variant={'ghost'}
               rightIcon={showProxy ? <MinusCircledIcon /> : <PlusCircledIcon />}
            >
               {showProxy ? 'Hide proxy settings' : 'Show proxy settings'}
            </Button>
            <StepperButtons
               onNext={handleSubmit(onSubmit)}
               isLoading={isPending}
               canPrevious={false}
               buttonLabel={buttonLabel}
               buttonIcon={buttonIcon}
            />
         </Flex>
      </Box>
   );
};
