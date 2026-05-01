// SearchContext.tsx
/* eslint-disable-no-unused-expressions */
import React, { createContext, useReducer, useContext, type ReactNode } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';
import { TRACK_DELAY_STATUS } from '../../hooks/useTrackDelay';
import searchReducer from '../../reducers/searchReducer';
import {
   type SearchState,
   type ActionSearch,
   type SearchDetails,
   SearchDetailsSchema,
} from '../../types/type';
import { resetResult, STORAGE_KEYS } from '../../utils';

interface SearchContextType {
   state: SearchState;
   dispatch: React.Dispatch<ActionSearch>;
}

export const initialState: SearchState = {
   searchFilters: [],
   hoverActionIndex: -1,
   hoverFilterIndex: -1,
   lastHoverFilterIndex: -1,
   selectedResultIndex: 0,
   isAllSelected: true,
   hasNewData: true,
   searchResults: [],
   searchFrequentDetails: [],
   isLoading: true,
   startSearch: false,
   triggerCloseAction: false,
   trackDelay: TRACK_DELAY_STATUS.IDLE,
};

// 6. Create the context
const SearchContext = createContext<SearchContextType | undefined>(undefined);

// 7. Provider component
const SearchProvider = ({ children }: { children: ReactNode }) => {
   const [searchResults] = useLocalStorage<SearchDetails>(STORAGE_KEYS.SEARCH_RESULTS, []);
   const [searchKeys] = useLocalStorage<string>(STORAGE_KEYS.SEARCH_TERMS, []);
   const [state, dispatch] = useReducer(searchReducer, {
      ...initialState,
      searchFrequentViewed: searchResults?.filter(res => SearchDetailsSchema.safeParse(res).success)?.map(resetResult),
      searchFrequentDetails: searchKeys,
   });

   return <SearchContext.Provider value={{ state, dispatch }}>{children}</SearchContext.Provider>;
};

// 8. Custom hook to use the context
const useSearchContext = (): SearchContextType => {
   const context = useContext(SearchContext);
   if (!context) {
      throw new Error('useSearchContext must be used within a SearchProvider');
   }
   return context;
};

export { SearchProvider, useSearchContext };
