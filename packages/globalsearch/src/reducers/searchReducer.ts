import { TRACK_DELAY_STATUS } from '../hooks/useTrackDelay';
import {
   type SearchState,
   type ActionSearch,
   type SearchDetails,
   TRACKED_ITEM,
} from '../types';
import { resetResult, resetState } from '../utils';
import filterClickActions from './filterActions';

const RESET_HOVER_STATE = {
   hoverFilterIndex: -1,
   hoverActionIndex: -1,
} as const;

const getVisibleResults = (results: SearchDetails[] | null): SearchDetails[] => {
   return results?.filter(r => r.visible === true) ?? [];
};

const getActiveResults = (state: SearchState): SearchDetails[] => {
   const { searchTerm, searchResults, searchFrequentViewed } = state;
   return searchTerm ? searchResults : searchFrequentViewed ?? [];
};

const calculateCircularIndex = (
   currentIndex: number,
   change: number,
   total: number,
   direction: 'up' | 'down' | 'left' | 'right'
): number => {
   if (total === 0) return 0;

   switch (direction) {
      case 'down':
      case 'right':
         return (currentIndex + change) % total;
      case 'up':
      case 'left':
         return (currentIndex - change + total) % total;
      default:
         return currentIndex;
   }
};

const calculateHoverIndex = (
   currentHoverIndex: number,
   direction: 'left' | 'right',
   change: number,
   total: number
): number => {
   if (total === 0) return -1;

   const startIndex = currentHoverIndex === -1 ? 0 : currentHoverIndex;
   return calculateCircularIndex(startIndex, change, total, direction);
};


const handleFilterClick = (state: SearchState, action: ActionSearch): SearchState => {
   if (action.type !== 'FILTER_CLICK') {
      return state;
   }
   const { payload } = action;

   if (!payload?.filter) {
      return state;
   }

   const handler = filterClickActions[payload.filter] ?? filterClickActions._default;
   // Fire search every time the category is changed
   return {
      ...handler(state, payload),
      startSearch: state.searchTerm ? true : false,
      isLoading: state.searchTerm ? true : false,
   };
};

const handleNavigateResult = (state: SearchState, action: ActionSearch): SearchState => {
   if (action.type !== 'NAVIGATE_RESULT') {
      return state;
   }
   const { payload: { dir, index } } = action;
   const { selectedResultIndex } = state;

   const results = getActiveResults(state);
   const visibleResults = getVisibleResults(results);
   const totalCount = visibleResults.length;

   if (totalCount === 0) {
      return state;
   }

   const newSelectedIndex = calculateCircularIndex(selectedResultIndex, index, totalCount, dir);

   return {
      ...state,
      ...RESET_HOVER_STATE,
      selectedResultIndex: newSelectedIndex,
      hoverActionIndex: -1
   };
};

const handleNavigateFilter = (state: SearchState, action: ActionSearch): SearchState => {
   if (action.type !== 'NAVIGATE_FILTER') {
      return state;
   }
   const { payload: { dir, index: filterIndex } } = action;
   const { searchFilters, hoverFilterIndex, lastHoverFilterIndex } = state;

   // +1 for the "ALL" filter that's not in the dynamic filter list
   const filterCount = searchFilters.length + 1;

   if (filterCount === 0) {
      return state;
   }

   const newHoverIndex = calculateHoverIndex(lastHoverFilterIndex !== -1 ? lastHoverFilterIndex : hoverFilterIndex, dir, filterIndex, filterCount);

   return {
      ...state,
      lastHoverFilterIndex: -1,
      hoverFilterIndex: newHoverIndex,
      hoverActionIndex: -1,
   };
};

const handleNavigateAction = (state: SearchState, action: ActionSearch): SearchState => {
   if (action.type !== 'NAVIGATE_ACTION') {
      return state;
   }
   const { payload: { dir, index } } = action;
   const { selectedResultIndex, hoverActionIndex } = state;

   const results = getActiveResults(state);
   const selectedResult = results[selectedResultIndex];
   const actionCount = selectedResult?.actions?.length ?? 0;

   if (actionCount === 0) {
      return state;
   }

   const newHoverIndex = hoverActionIndex === -1 ? 0 : calculateHoverIndex(hoverActionIndex, dir, index, actionCount);

   return {
      ...state,
      hoverActionIndex: newHoverIndex,
      hoverFilterIndex: -1,
   };
};

const handleResetFilterHover = (state: SearchState): SearchState => ({
   ...state,
   lastHoverFilterIndex: state.hoverFilterIndex,
   hoverFilterIndex: -1,
});

const handleResetActionFilterHover = (state: SearchState): SearchState => ({
   ...state,
   hoverActionIndex: 0,
});

const handleClearRecent = (state: SearchState): SearchState => ({
   ...state,
   searchFrequentDetails: [],
   searchFrequentViewed: [],
});

const handleUpdateFrequentSearch = (state: SearchState, action: ActionSearch): SearchState => {
   if (action.type !== 'UPDATE_FREQUENT_SEARCH') {
      return state;
   }
   const { payload } = action;

   return {
      ...state,
      searchFrequentDetails: payload ?? [],
   };
};

const handleUpdateFrequentViewed = (state: SearchState, action: ActionSearch): SearchState => {
   if (action.type !== 'UPDATE_FREQUENT_VIEWED') {
      return state;
   }
   const { payload } = action;

   return {
      ...state,
      searchFrequentViewed: (payload ?? []).map(resetResult),
   };
};

const handleTriggerCloseAction = (state: SearchState, action: ActionSearch): SearchState => {
   if (action.type !== 'TRIGGER_CLOSE_ACTION') {
      return state;
   }

   return {
      ...state,
      triggerCloseAction: true,
      trackDelay: TRACK_DELAY_STATUS.END,
      trackedItem: TRACKED_ITEM.timeto_navigate,
      selectedResultIndex: action.payload
   };
};

const handleSetSearch = (state: SearchState, action: ActionSearch): SearchState => {
   if (action.type !== 'SET_SEARCH') {
      return state;
   }
   const { payload } = action;
   const hasPayload = !!payload;

   return {
      ...state,
      selectedResultIndex: 0,
      searchTerm: payload ?? '',
      startSearch: hasPayload,
      isLoading: hasPayload,
      trackDelay: TRACK_DELAY_STATUS.START,
   };
};

const handleUpdateSearch = (state: SearchState, action: ActionSearch): SearchState => {
   if (action.type !== 'UPDATE_SEARCH') {
      return state;
   }
   const { payload } = action;
   const resetedState = resetState(state, false);

   return {
      ...resetedState,
      searchResults: (payload ?? []).map(resetResult),
      startSearch: false,
      isLoading: false,
      triggerCloseAction: false,
      trackDelay: TRACK_DELAY_STATUS.PAUSE,
      trackedItem: TRACKED_ITEM.search_api
   };
};

const handleUpdateCategories = (state: SearchState, action: ActionSearch): SearchState => {
   if (action.type !== 'UPDATE_CATEGORIES') {
      return state;
   }
   const { payload } = action;
   return {
      ...state,
      isLoading: false,
      searchFilters: payload.map(category => ({ filter: category.toLowerCase(), label: category, selected: false })),
   };
};

const handleResetState = (state: SearchState): SearchState => {
   const resetedState = resetState(state);

   return {
      ...resetedState,
      searchTerm: '',
   };
};

const handleDelay = (state: SearchState, action: ActionSearch): SearchState => {
   if (action.type !== 'TRIGGER_DELAY') {
      return state;
   }
   const { status, trackItem } = action.payload;

   return {
      ...state,
      trackDelay: status,
      trackedItem: trackItem
   };
};


// Main reducer with action handler mapping
const actionHandlers: Record<ActionSearch['type'], (state: SearchState, action: ActionSearch) => SearchState> = {
   'FILTER_CLICK': handleFilterClick,
   'NAVIGATE_RESULT': handleNavigateResult,
   'NAVIGATE_FILTER': handleNavigateFilter,
   'NAVIGATE_ACTION': handleNavigateAction,
   'RESET_FILTER_HOVER': handleResetFilterHover,
   'RESET_ACTION_HOVER': handleResetActionFilterHover,
   'CLEAR_RECENT': handleClearRecent,
   'UPDATE_FREQUENT_SEARCH': handleUpdateFrequentSearch,
   'UPDATE_FREQUENT_VIEWED': handleUpdateFrequentViewed,
   'TRIGGER_CLOSE_ACTION': handleTriggerCloseAction,
   'SET_SEARCH': handleSetSearch,
   'UPDATE_SEARCH': handleUpdateSearch,
   'RESET_STATE': handleResetState,
   'TRIGGER_DELAY': handleDelay,
   'UPDATE_CATEGORIES': handleUpdateCategories,
};

export default function searchReducer(
   state: SearchState,
   action: ActionSearch
): SearchState {
   const handler = actionHandlers[action.type];
   if (!handler) {
      console.warn(`Unknown action type: ${action.type}`);
      return state;
   }

   return handler(state, action);
}
