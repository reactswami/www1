import { Box, Flex, Spinner, Text } from '@chakra-ui/react';
import { SearchIcon } from '@statseeker/components/Media/Icon/SearchIcon';

export default ({ isLoading = false }: { isLoading?: boolean }) => {
   return (
      <Flex
         direction="column"
         alignItems={'center'}
         width={'100%'}
         p={10}
         color={'search.body'}
         alignSelf={'center'}
      >
         {isLoading && (
            <Box>
               <Spinner thickness=".25rem" speed="0.65s" emptyColor="gray.200" size="xl" />
            </Box>
         )}

         {!isLoading && (
            <>
               <SearchIcon size="xl" />
               <Text>Please enter a search term to start searching</Text>
            </>
         )}
      </Flex>
   );
};
