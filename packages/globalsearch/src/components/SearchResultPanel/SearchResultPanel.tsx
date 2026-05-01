import { Box, Flex } from '@chakra-ui/react';
import { Text } from '@statseeker/components/Typography/Text';
import { useVirtualizer } from '@tanstack/react-virtual';
import { memo, useEffect, useRef } from 'react';
import { type SearchDetails } from '../../types/type';
import FrequentSearch from '../FrequentSearch/FrequentSearch';
import { useSearchContext } from '../SearchContext/SearchContext';
import SearchResult from '../SearchResult/SearchResult';

function SearchResultPanel({
   searchResults,
   frequentSearches,
}: {
   frequentSearches?: string[];
   searchResults: SearchDetails[];
}) {
   const {
      state: { hasNewData, selectedResultIndex },
   } = useSearchContext();
   const parentRef = useRef<HTMLDivElement>(null);

   const results = searchResults.filter((res) => hasNewData || res.visible === true);

   const rowVirtualizer = useVirtualizer({
      count: results.length,
      getScrollElement: () => parentRef.current,
      estimateSize: () => 120,
      enabled: true,
   });
   useEffect(() => {
      rowVirtualizer.scrollToIndex(selectedResultIndex);
   }, [selectedResultIndex, rowVirtualizer]);
   return (
      <Flex
         direction="column"
         maxH={frequentSearches ? '40vh' : '60vh'}
         w="100%"
         alignItems={'flex-start'}
         overflow={'auto'}
      >
         {frequentSearches && (
            <>
               <FrequentSearch frequentSearch={frequentSearches} />
               {searchResults.length > 0 && <Text fontSize={'smaller'} pt={2} pl={2} pb={2} fontWeight={'bold'}>
                  Frequently Viewed
               </Text>}
            </>
         )}
         <Box flex="1 1 auto" overflow={'auto'} alignSelf={'stretch'} ref={parentRef}>
            <Flex
               direction="column"
               alignItems={'flex-start'}
               gap={2}
               style={{
                  height: `${rowVirtualizer.getTotalSize()}px`,
                  width: '100%',
                  position: 'relative',
               }}
            >
               {rowVirtualizer.getVirtualItems().map((virtualRow) => (
                  <Box
                     ref={rowVirtualizer.measureElement}
                     key={virtualRow.key}
                     data-index={virtualRow.index}
                     style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',

                        transform: `translateY(${virtualRow?.start}px)`,
                     }}
                  >
                     <SearchResult
                        {...results[virtualRow.index]}
                        actions={results[virtualRow.index].actions}
                        selected={virtualRow.index === selectedResultIndex}
                        resultIndex={virtualRow.index}
                        key={virtualRow.key}
                     />
                  </Box>
               ))}
            </Flex>
         </Box>
      </Flex>
   );
}

// Memoize the component with custom comparison
export default memo(SearchResultPanel, (prevProps, nextProps) => {
   // Only re-render if isOpen prop changes or onOpen reference changes
   return (
      prevProps.frequentSearches === nextProps.frequentSearches &&
      prevProps.frequentSearches?.length === nextProps.frequentSearches?.length &&
      prevProps.searchResults === nextProps.searchResults &&
      prevProps.searchResults.length === nextProps.searchResults.length
   );
});
