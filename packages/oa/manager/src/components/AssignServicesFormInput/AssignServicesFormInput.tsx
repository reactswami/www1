import { Checkbox, FormControl, FormLabel, Text } from '@chakra-ui/react';

import { useFormContext, useWatch } from 'react-hook-form';

interface Props {
   id: string;
   name: string;
   description: string;
   disable: boolean;
}

export const AssignServicesFormInput = ({ id, name, description, disable }: Props) => {
   const { register, control, setValue, formState } = useFormContext();
   const value = useWatch({ control, name: id });

   return (
      <FormControl
         flexGrow={1}
         display="flex"
         alignItems="center"
         cursor={'pointer'}
         borderRadius="sm"
         transition="100ms ease-in background"
         _hover={{
            background: 'gray.100',
         }}
      >
         <FormLabel
            display="flex"
            alignItems="center"
            flexGrow={'1'}
            margin={0}
            padding={3}
            cursor={'pointer'}
         >
            <Text as="b" flexBasis={'16ch'} flexShrink={0}>
               {name}
            </Text>
            <Text flexGrow={1}>{description}</Text>
         </FormLabel>
         <Checkbox
            size="lg" paddingRight={3} flexGrow={0} {...register(id)}
            isChecked={value} isDisabled={formState.isSubmitting || disable}
            onChange={(e) => setValue(id, e.target.checked, { shouldDirty: true })}
         />
      </FormControl>
   );
};
