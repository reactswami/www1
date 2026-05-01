import { Flex, Heading, Text } from '@chakra-ui/react';

export const PingTableEmptyState = () => {
   return (
      <Flex
         position="absolute"
         height="100%"
         width="100%"
         direction="column"
         justifyContent="center"
         alignItems="center"
         background={'page.500'}
      >
         <Heading size="xl">No devices found</Heading>
         <Text>We did not find any devices matching your query.</Text>
      </Flex>
   );
};
