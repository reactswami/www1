import { Button, Center, Flex, Text } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { type ReactElement, useState } from 'react';
import { queryKeys } from '~/lib/ReactQuery/keys';

export type TypedDevSeedDataButton = typeof DevSeedDataButton;

const DevSeedDataButton = (): ReactElement => {
   const [isLoading, setIsLoading] = useState(false);
   const queryClient = useQueryClient();
   const isProduction = import.meta.env.PROD;

   if (isProduction) {
      // Don't show in production environment!
      return <></>;
   }

   // This is pretty ugly, but it allows to avoid importing faker by default!
   let db: any;
   let seedDb: () => void;

   // @ts-ignore
   if (import.meta.env.MODE === 'development') {
      import('~/test/server/db').then((module) => {
         db = module.db;
         seedDb = module.seedDb;
      });
   }

   return (
      <Flex direction="column" alignItems="center">
         <Button
            variant="link"
            isLoading={isLoading}
            loadingText={'Seeding the database'}
            colorScheme="purple"
            onClick={async () => {
               setIsLoading(true);
               await seedDb(); // Create a device_oa with a known id, for testing

               await db.device_oa.create({
                  id: '999',
               });
               queryClient.invalidateQueries({ queryKey: queryKeys.all });
            }}
         >
            Seed the database with mock data
         </Button>
         <Center>
            <Text as="i" size="xs">
               (Not available in production, for development purposes only.)
            </Text>
         </Center>
      </Flex>
   );
};

export default DevSeedDataButton;
