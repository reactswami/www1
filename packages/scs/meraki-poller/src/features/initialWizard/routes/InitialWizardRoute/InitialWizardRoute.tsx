import { Flex } from '@chakra-ui/react';
import { Layout } from '~/components';
import { Stepper } from '~/features/initialWizard/components';

export const WizardPage = () => {
   return (
      <Layout subtitle="Initial setup">
         <Flex
            justifyContent="center"
            direction={'column'}
            alignItems="center"
            flexGrow={1}
            paddingBottom={48}
            gap="sm"
         >
            <Stepper />
         </Flex>
      </Layout>
   );
};
