import { Heading, Text, VStack } from '@chakra-ui/react';

import { AssignServicesFormInput } from '~/components';
import { type Services } from '~/hooks';

interface Props {
   service: Services[number];
   disabledServices?: { state: boolean; id: string }[];
}

export const AssignServicesService = ({ service, disabledServices }: Props) => {
   const { name, description, components } = service;
   return (
      <VStack alignItems="flex-start">
         <Heading textTransform={'uppercase'} size="sm">
            {name}
         </Heading>
         <Text size="xs" color="gray.700">
            {description}
         </Text>
         {components.map(({ id, name, description }, index) => (
            <AssignServicesFormInput
               id={id}
               name={name}
               description={description}
               key={index}
               disable={disabledServices?.filter(ser => ser.id === id)?.[0]?.state ?? false}
            />
         ))}
      </VStack>
   );
};
