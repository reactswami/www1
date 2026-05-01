import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo } from 'react';
import { useSearchContext } from '../components/SearchContext/SearchContext';
import { describeCredentialsQuery, getSearchResults } from '../lib/ReactQuery/queryOptions/search';
import { openInNewWindow, orderCategories, ORDERED_CATEGORIES, STORAGE_KEYS } from '../utils';
import useLocalStorage from './useLocalStorage';
import { type SearchDetails, SearchDetailsSchema } from '~/types';

const MAX_STORED_ITEMS = 5;

const createSearchResultsMerge = (dispatch: any) => {
   return (existing: SearchDetails[], added: SearchDetails[]) => {
      const existingReal = existing.filter(detail => SearchDetailsSchema.safeParse(detail).success);

      if (added.length === 0) {
         return { result: existingReal, hasChanged: false };
      }
      const addedReal = added.filter(detail => SearchDetailsSchema.safeParse(detail).success);

      // Check for duplicates based on name and actions length
      const isDuplicate = existingReal.some((existingItem) =>
         addedReal.some((newItem) =>
            newItem?.name === existingItem?.name &&
            newItem?.actions?.length === existingItem?.actions?.length
         )
      );

      if (isDuplicate) {
         return { result: existingReal, hasChanged: false };
      }

      // Keep most recent items
      const combined = [...addedReal, ...existingReal];
      const result = combined.slice(0, MAX_STORED_ITEMS);
      dispatch({ type: 'UPDATE_FREQUENT_VIEWED', payload: result });

      return { result, hasChanged: true };
   };
};

const createSearchTermsMerge = (dispatch: any) => {
   return (existing: string[], added: string[]) => {
      if (added.length === 0) {
         return { result: existing, hasChanged: false };
      }

      const isDuplicate = existing.some((existingTerm) =>
         added.some((newTerm) => newTerm === existingTerm)
      );

      if (isDuplicate) {
         return { result: existing, hasChanged: false };
      }

      const combined = [...added, ...existing];
      const result = combined.slice(0, MAX_STORED_ITEMS);

      dispatch({ type: 'UPDATE_FREQUENT_SEARCH', payload: result });

      return { result, hasChanged: true };
   };
};

function useSearchActions() {
   const {
      dispatch,
      state: { searchFilters, hoverFilterIndex, searchResults,
         searchTerm, searchFrequentViewed, startSearch, selectedResultIndex, hoverActionIndex },
   } = useSearchContext();
   const { data: searchDescribe, isLoading: isCategoryLoading, isError: isErrorCategory } = useQuery(describeCredentialsQuery());

   useEffect(() => {
      if (searchFilters.length === 0) {
         if (!isCategoryLoading && searchDescribe?.describe?.options?.categories.values) {
            dispatch({ type: 'UPDATE_CATEGORIES', payload: orderCategories(Object.keys(searchDescribe?.describe?.options?.categories.values)) });
         } else if (isErrorCategory) {
            dispatch({ type: 'UPDATE_CATEGORIES', payload: ORDERED_CATEGORIES });
         }
      }
   }, [isCategoryLoading, dispatch, searchFilters, searchDescribe, isErrorCategory]);

   const { isError } = useQuery(getSearchResults({ options: { query: searchTerm ?? '', categories: searchFilters.filter(f => f.selected).map(f => f.filter) } }, startSearch, dispatch));

   useEffect(() => {
      if (isError) {
         dispatch({ type: 'UPDATE_SEARCH', payload: [] });
      }
   }, [isError, dispatch]);

   const resultSearch = useMemo(() => searchTerm ? searchResults : searchFrequentViewed ?? [],
      [searchTerm, searchResults, searchFrequentViewed]);

   const [, setFrequentResult, { clear: clearFrequentResults }] = useLocalStorage<SearchDetails>(
      STORAGE_KEYS.SEARCH_RESULTS,
      [],
      createSearchResultsMerge(dispatch),
      {
         onError: (error, operation) => {
            console.error(`Error ${operation} frequent search results:`, error);
         },
      }
   );

   const [, setRecentSearch, { clear: clearRecentSearches }] = useLocalStorage<string>(
      STORAGE_KEYS.SEARCH_TERMS,
      [],
      createSearchTermsMerge(dispatch),
      {
         onError: (error, operation) => {
            console.error(`Error ${operation} recent search terms:`, error);
         },
      }
   );

   const runPrimaryAction = useCallback(({ resultIndex = -1 }: { resultIndex?: number }) => {
      const results = resultSearch.filter(res => res.visible);
      if (results.length === 0) {
         return;
      }
      const index = resultIndex !== -1 ? resultIndex : selectedResultIndex;

      if (searchTerm) {
         setFrequentResult([results[index]]);
         setRecentSearch([searchTerm]);
      }

      const result = SearchDetailsSchema.safeParse(results[index]);
      if (!result.success) {
         return;
      }

      const action = results[index].actions[0];
      if (action.height && action.width) {
         openInNewWindow(action);
      } else if (action.target === '_blank') {
         const newWindow = window.open(action.action, '_blank');
         newWindow?.addEventListener('load', function () {
            newWindow.focus();
         });
      } else {
         window.location.href = action.action;
      }
      dispatch({ type: 'TRIGGER_CLOSE_ACTION', payload: index });

   }, [resultSearch, searchTerm, setFrequentResult, setRecentSearch, dispatch, selectedResultIndex]);

   const runSecondaryAction = useCallback(({ resultIndex = -1, actionIndex = -1 }: { resultIndex?: number; actionIndex?: number }) => {
      const results = resultSearch.filter(res => res.visible);
      if (results.length === 0) {
         return;
      }

      const index = resultIndex !== -1 ? resultIndex : selectedResultIndex;
      const indexAction = actionIndex !== -1 ? actionIndex : hoverActionIndex;

      const result = SearchDetailsSchema.safeParse(results[index]);
      if (!result.success) {
         return;
      }

      if (searchTerm) {
         setFrequentResult([results[index]]);
         setRecentSearch([searchTerm]);
      }
      const actions = results[index].actions;
      if (indexAction < actions.length) {
         const action = actions[indexAction];
         const actionLink = actions[indexAction].action;
         if (action.height && action.width) {
            openInNewWindow(action);
         } else if (action.target === '_blank') {
            const newWindow = window.open(actionLink, '_blank');
            newWindow?.addEventListener('load', function () {
               newWindow.focus();
            });
         } else {
            window.location.href = actionLink;
         }
      }
      dispatch({ type: 'TRIGGER_CLOSE_ACTION', payload: index });

   }, [resultSearch, searchTerm, setFrequentResult, setRecentSearch, hoverActionIndex, dispatch, selectedResultIndex]);

   const selectFilter = useCallback((filterIndex: number = -1) => {
      const index = filterIndex !== -1 ? filterIndex : hoverFilterIndex;
      const filter = index === 0 ? 'All' : searchFilters[index - 1].filter;
      dispatch({ type: 'FILTER_CLICK', payload: { filter } });
   }, [dispatch, hoverFilterIndex, searchFilters]);

   const setSearch = useCallback((search: string) => {
      if (search.trim() === searchTerm?.trim()) {
         return;
      }
      dispatch({ type: 'SET_SEARCH', payload: search });
   }, [dispatch, searchTerm]);

   const clearRecents = useCallback(() => {
      clearFrequentResults();
      clearRecentSearches();
      dispatch({ type: 'CLEAR_RECENT' });
   }, [clearFrequentResults, clearRecentSearches, dispatch]);

   const resetSearch = useCallback(() => {
      dispatch({
         type: 'RESET_STATE',
      });
   }, [dispatch]);

   return {
      runPrimaryAction,
      runSecondaryAction,
      clearRecents,
      setSearch,
      selectFilter,
      resetSearch
   };
};

export default useSearchActions;
