import { Box, Flex, Text } from '@chakra-ui/react';
import { SearchIcon } from '@statseeker/components/Media/Icon/SearchIcon';

function SearchEmptyMessage() {
   return (
      <Flex direction="column" color={'search.body'} alignItems={'center'} p={5} width={'100%'}>
         <Box className="magnify">
            <SearchIcon size="xl" />
         </Box>
         <Text w={'100%'} textAlign={'center'}>
            We couldn't find what you're looking for at this point in time.
         </Text>
         <Text w={'100%'} textAlign={'center'}>
            Try searching with a different search term or a category.
         </Text>
      </Flex>
   );
}

export default SearchEmptyMessage;
