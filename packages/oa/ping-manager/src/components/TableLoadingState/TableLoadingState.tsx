import { Box, Flex, Spinner, Text } from '@chakra-ui/react';

export const PingTableLoadingState = () => {
   return (
      <Box position="sticky" top={'calc(50vh - 200px)'} height="0" zIndex={3}>
         <Flex
            border={'1px'}
            borderColor="gray.200"
            borderRadius="md"
            direction="column"
            shadow={'sm'}
            gap="sm"
            justifyContent="center"
            alignItems="center"
            background={'whiteAlpha.800'}
            height="300px"
            width="300px"
            margin={'auto'}
         >
            <Spinner size="xl" />
            <Text>Loading</Text>
         </Flex>
      </Box>
   );
};
