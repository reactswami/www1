import { Box, Flex } from '@chakra-ui/react';
import { Button } from '@statseeker/components/Form/Button';
import { RotateCwIcon } from '@statseeker/components/Media/Icon/RotateCwIcon';
import { Text } from '@statseeker/components/Typography/Text';
import { memo, useCallback } from 'react';
import { useSearchContext } from '../SearchContext/SearchContext';

function FrequentSearch({ frequentSearch }: { frequentSearch?: string[] }) {
   const { dispatch } = useSearchContext();

   const handleSetSearch = useCallback(
      (result: string) => () => {
         dispatch({
            type: 'SET_SEARCH',
            payload: result || '',
         });
      },
      [dispatch]
   );

   return (
      <Box w="100%" pt={1} pb={1}>
         <Flex w="100%" justifyContent={'flex-start'} pr={1}>
            <Text fontSize={'smaller'} pt={2} pl={2} pb={2} fontWeight={'bold'}>
               Recent
            </Text>
         </Flex>

         <Flex wrap={'wrap'} pl={3} gap={2}>
            {frequentSearch?.map((result) => (
               <Button
                  key={result}
                  icon={<RotateCwIcon size="sm" />}
                  variant="secondary"
                  aria-label="search"
                  outline={'none'}
                  border={'none'}
                  fontSize={'12px'}
                  padding={'4px'}
                  color={'search.body'}
                  fontWeight={'normal'}
                  onClick={handleSetSearch(result)}
               >
                  {result}
               </Button>
            ))}
         </Flex>
      </Box>
   );
}

export default memo(FrequentSearch);
