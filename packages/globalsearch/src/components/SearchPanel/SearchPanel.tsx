import { Divider, Flex, useMediaQuery } from '@chakra-ui/react';
import { memo, useMemo } from 'react';
import { useSearchContext } from '../SearchContext/SearchContext';
import SearchEmptyMessage from '../SearchEmptyMessage/SearchEmptyMessage';
import SearchFilterPanel from '../SearchFilterPanel/SearchFilterPanel';
import SearchFooter from '../SearchFooter/SearchFooter';
import SearchResultPanel from '../SearchResultPanel/SearchResultPanel';
import SearchWelcomeMessage from '../SearchWelcomeMessage/SearchWelcomeMessage';
import { ActiveDisplayWidth, BREAKPOINTS } from '~/utils';

const SearchPanel = memo(() => {
   const {
      state: {
         searchResults,
         searchFrequentDetails,
         searchFrequentViewed,
         searchTerm,
         isLoading,
         searchFilters
      },
   } = useSearchContext();

   const [isLessThan765] = useMediaQuery(BREAKPOINTS.MOBILE);

   // Memoize expensive computations
   const computedValues = useMemo(() => {
      const visibleResults = searchResults.filter((res) => res.visible === true);
      const hasSearchTerm = Boolean(searchTerm?.trim());
      const hasFrequentDetails = Boolean(searchFrequentDetails?.length);
      const hasFrequentViewed = Boolean(searchFrequentViewed?.length);
      const hasCategories = Boolean(searchFilters?.length);

      return {
         visibleResults,
         hasSearchTerm,
         hasFrequentDetails,
         hasFrequentViewed,
         hasCategories,
         resultCount: visibleResults.length,
         results: hasSearchTerm ? searchResults : searchFrequentViewed ?? [],
      };
   }, [searchResults, searchFrequentDetails, searchFrequentViewed, searchTerm, searchFilters]);

   // Memoize display conditions
   const displayConditions = useMemo(() => {
      const { hasSearchTerm, hasFrequentDetails, hasFrequentViewed, resultCount, hasCategories } = computedValues;

      return {
         showFooter:
            (hasCategories && !isLoading && hasSearchTerm && resultCount > 0) ||
            hasFrequentDetails ||
            hasFrequentViewed,
         showWelcome: (!hasSearchTerm && !hasFrequentDetails && !hasFrequentViewed) || isLoading || !hasCategories,
         showFrequentViewed: hasCategories && !hasSearchTerm && (hasFrequentDetails || hasFrequentViewed),
         showEmptyResult: hasCategories && hasSearchTerm && !isLoading && resultCount === 0,
         showSearchResults: hasCategories && hasSearchTerm && resultCount > 0 && !isLoading,
         showCategories: hasCategories,
      };
   }, [computedValues, isLoading]);

   // Memoize props for consistent reference
   const stackProps = useMemo(
      () => ({
         alignItems: 'flex-start' as const,
         gap: 0,
         bg: 'white',
         borderRadius: 'sm',
         boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
         ...(!isLessThan765 && { borderTop: '1px solid #d8d8d1', mt: 2 }),
      }),
      [isLessThan765]
   );

   const { hasSearchTerm, results, resultCount } = computedValues;
   const { showFooter, showWelcome, showFrequentViewed, showEmptyResult, showSearchResults, showCategories } =
      displayConditions;

   return (
      <Flex direction="column" {...stackProps}
         {...!showCategories && { minW: `${ActiveDisplayWidth}vw` }}
      >
         {showCategories && <SearchFilterPanel searchResults={results} />}

         <Divider orientation="horizontal" />

         {showEmptyResult && <SearchEmptyMessage />}

         {showSearchResults && <SearchResultPanel searchResults={searchResults} />}

         {showFrequentViewed && (
            <SearchResultPanel
               frequentSearches={searchFrequentDetails}
               searchResults={searchFrequentViewed ?? []}
            />
         )}

         {showWelcome && <SearchWelcomeMessage isLoading={isLoading} />}

         {showFooter && <SearchFooter count={hasSearchTerm ? resultCount : undefined} />}
      </Flex>
   );
});

// Set display name for better debugging
SearchPanel.displayName = 'SearchPanel';

export default SearchPanel;
