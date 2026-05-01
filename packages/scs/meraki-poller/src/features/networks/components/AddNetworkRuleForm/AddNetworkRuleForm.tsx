import { Box, Flex } from '@chakra-ui/react';
import { type SubmitHandler } from 'react-hook-form';
import { AffectedEntityList } from '~/components/AffectedEntityList';
import { type DEFAULT_DATAYPES_VALUES } from '~/config/defaults';
import { type FieldValues, Form } from '~/features/networks/components';
import { Section } from '~/features/settings/components/Section';

interface Props {
   onSubmit: SubmitHandler<FieldValues>;
   selectedNetworks: string[];
   defaultValues?: FieldValues;
   defaultDatatypes?: typeof DEFAULT_DATAYPES_VALUES;
   isLoading: boolean;
   shouldEnsureUniqueName?: boolean;
}
export const AddNetworkRuleForm = ({
   onSubmit,
   selectedNetworks,
   isLoading,
   defaultValues,
   shouldEnsureUniqueName,
}: Props) => {
   return (
      <Flex flexDirection={'row'}>
         <Box flexBasis={'70%'}>
            <Section>
               <Form
                  defaultValues={defaultValues}
                  isLoading={isLoading}
                  onSubmit={onSubmit}
                  shouldEnsureUniqueName={shouldEnsureUniqueName ?? true}
               />
            </Section>
         </Box>

         <Box flexBasis={'30%'}>
            <AffectedEntityList
               selectedEntities={selectedNetworks}
               type="network"
            />
         </Box>
      </Flex>
   );
};
