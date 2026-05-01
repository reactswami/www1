import { Flex } from '@chakra-ui/react';
import { Input } from '@statseeker/components';
import { type FormState, type UseFormRegister } from 'react-hook-form';
import { type InputValues } from '~/components';

interface Props {
   register: UseFormRegister<InputValues>;
   errors: FormState<InputValues>['errors'];
}

export const ProxyForm = ({ register, errors }: Props) => {
   const portRegexp = new RegExp(
      /^([1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/
   );

   const urlRegexp = new RegExp(
      /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/
   );

   return (
      <Flex gap="sm" direction="column">
         <Flex width={'100%'} gap="sm">
            <Input
               label="Proxy server"
               {...register('proxy_server', {
                  pattern: {
                     value: urlRegexp,
                     message: 'Provide a valid url',
                  },
               })}
               flexGrow={0}
               flexBasis={'80%'}
            />
            <Input
               label="Port"
               flexGrow={0}
               flexBasis={'19%'}
               {...register('proxy_port', {
                  pattern: {
                     value: portRegexp,
                     message: 'Provide a valid port',
                  },
               })}
               error={errors['proxy_port']?.message as string}
            />
         </Flex>
         <Input label="Username" {...register('proxy_username')} />
         <Input label="Password" type="password" {...register('proxy_password')} />
      </Flex>
   );
};
