import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TRACK_DELAY_STATUS } from '../hooks/useTrackDelay';
import {
   type SearchState,
   type ActionSearch,
   type SearchDetails,
   TRACKED_ITEM
} from '../types';
import searchReducer from './searchReducer';

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

describe('searchReducer', () => {
   let testState: SearchState;

   beforeEach(() => {
      testState = {
         ...initialState,
         searchTerm: '',
         searchFilters: [
            { filter: 'device', label: 'Device', selected: false },
            { filter: 'interface', label: 'Interface', selected: false },
            { filter: 'group', label: 'Group', selected: false },
            { filter: 'dashboard', label: 'Dashboard', selected: false },
            { filter: 'report', label: 'Report', selected: false },
            { filter: 'administration', label: 'Administration', selected: false },
         ],
         searchFrequentViewed: [
            { name: 'Test Device 1', category: 'device', visible: true, actions: [], description: '' },
            { name: 'Test Interface 1', category: 'interface', visible: true, actions: [], description: '' },
            { name: 'Test Group 1', category: 'group', visible: true, actions: [], description: '' },
            { name: 'Test Dashboard 1', category: 'dashboard', visible: true, actions: [], description: '' },
            { name: 'Test Report 1', category: 'report', visible: true, actions: [], description: '' },
            { name: 'Test Admin 1', category: 'administration', visible: true, actions: [], description: '' },
         ],
         isLoading: false,
         hasNewData: false,
      };
   });

   describe('FILTER_CLICK actions', () => {
      it('should reset state when "All" filter is clicked', () => {
         const action: ActionSearch = {
            type: 'FILTER_CLICK',
            payload: { filter: 'All' }
         };

         const result = searchReducer(testState, action);

         // verify that resetState was called and applied correctly
         expect(result.selectedResultIndex).toBe(0);
         expect(result.hoverFilterIndex).toBe(-1);
         expect(result.lastHoverFilterIndex).toBe(-1);
         expect(result.hoverActionIndex).toBe(-1);
         expect(result.triggerCloseAction).toBe(false);
         expect(result.trackDelay).toBe(TRACK_DELAY_STATUS.IDLE);
         expect(result.trackedItem).toBeUndefined();
         expect(result.startSearch).toBe(false);
         expect(result.isLoading).toBe(false);

         // verify filters are reset
         expect(result.searchFilters.every(f => f.selected === false)).toBe(true);
         expect(result.isAllSelected).toBe(true);
      });

      it('should toggle filter selection when not all filters are selected', () => {
         const action: ActionSearch = {
            type: 'FILTER_CLICK',
            payload: { filter: 'device' }
         };

         const result = searchReducer(testState, action);

         const deviceFilter = result.searchFilters.find(f => f.filter === 'device');
         expect(deviceFilter?.selected).toBe(true);
         expect(result.startSearch).toBe(false);
         expect(result.isLoading).toBe(false);
      });

      it('should trigger search when searchTerm exists', () => {
         const stateWithSearch = { ...testState, searchTerm: 'test query' };
         const action: ActionSearch = {
            type: 'FILTER_CLICK',
            payload: { filter: 'device' }
         };

         const result = searchReducer(stateWithSearch, action);

         expect(result.startSearch).toBe(true);
         expect(result.isLoading).toBe(true);
      });

      it('should handle all filters selected scenario', () => {
         const stateWithAllSelected = {
            ...testState,
            isAllSelected: true,
            searchFilters: testState.searchFilters.map(f => ({ ...f, selected: true }))
         };

         const action: ActionSearch = {
            type: 'FILTER_CLICK',
            payload: { filter: 'device' }
         };

         const result = searchReducer(stateWithAllSelected, action);

         const deviceFilter = result.searchFilters.find(f => f.filter === 'device');
         const otherFilters = result.searchFilters.filter(f => f.filter !== 'device');

         expect(deviceFilter?.selected).toBe(true);
         expect(otherFilters.every(f => f.selected === false)).toBe(true);
      });

      it('should update visible results when no search term and filters change', () => {
         const stateWithFrequentViewed = {
            ...testState,
            searchFrequentViewed: [
               { name: 'Device 1', category: 'device', visible: true, actions: [], description: '' },
               { name: 'Interface 1', category: 'interface', visible: true, actions: [], description: '' },
               { name: 'Dashboard 1', category: 'dashboard', visible: true, actions: [], description: '' },
            ]
         };

         const action: ActionSearch = {
            type: 'FILTER_CLICK',
            payload: { filter: 'device' }
         };

         const result = searchReducer(stateWithFrequentViewed, action);

         expect(result.searchFrequentViewed).toBeDefined();
         expect(result.selectedResultIndex).toBe(0);
      });
   });

   describe('NAVIGATE_RESULT actions', () => {
      beforeEach(() => {
         testState.searchFrequentViewed = [
            { name: 'Result 1', category: 'device', visible: true, actions: [], description: '' },
            { name: 'Result 2', category: 'interface', visible: true, actions: [], description: '' },
            { name: 'Result 3', category: 'group', visible: true, actions: [], description: '' },
            { name: 'Result 4', category: 'dashboard', visible: true, actions: [], description: '' },
            { name: 'Result 5', category: 'report', visible: true, actions: [], description: '' },
         ];
      });

      it('should navigate down through results', () => {
         const action: ActionSearch = {
            type: 'NAVIGATE_RESULT',
            payload: { dir: 'down', index: 1 }
         };

         const result = searchReducer(testState, action);

         expect(result.selectedResultIndex).toBe(1);
         expect(result.hoverFilterIndex).toBe(-1);
         expect(result.hoverActionIndex).toBe(-1);
      });

      it('should navigate up through results', () => {
         const stateAtIndex3 = { ...testState, selectedResultIndex: 3 };
         const action: ActionSearch = {
            type: 'NAVIGATE_RESULT',
            payload: { dir: 'up', index: 1 }
         };

         const result = searchReducer(stateAtIndex3, action);

         expect(result.selectedResultIndex).toBe(2);
      });

      it('should wrap around when navigating past end', () => {
         const stateAtLastIndex = { ...testState, selectedResultIndex: 4 };
         const action: ActionSearch = {
            type: 'NAVIGATE_RESULT',
            payload: { dir: 'down', index: 1 }
         };

         const result = searchReducer(stateAtLastIndex, action);

         expect(result.selectedResultIndex).toBe(0);
      });

      it('should handle empty results', () => {
         const emptyState = { ...testState, searchFrequentViewed: [] };
         const action: ActionSearch = {
            type: 'NAVIGATE_RESULT',
            payload: { dir: 'down', index: 1 }
         };

         const result = searchReducer(emptyState, action);

         expect(result.selectedResultIndex).toBe(0);
      });
   });

   describe('NAVIGATE_FILTER actions', () => {
      it('should navigate right through filters', () => {
         const action: ActionSearch = {
            type: 'NAVIGATE_FILTER',
            payload: { dir: 'right', index: 1 }
         };

         const result = searchReducer(testState, action);

         expect(result.hoverFilterIndex).toBe(1);
         expect(result.hoverActionIndex).toBe(-1);
         expect(result.lastHoverFilterIndex).toBe(-1);
      });

      it('should navigate left through filters', () => {
         const stateWithHover = { ...testState, hoverFilterIndex: 3 };
         const action: ActionSearch = {
            type: 'NAVIGATE_FILTER',
            payload: { dir: 'left', index: 1 }
         };

         const result = searchReducer(stateWithHover, action);

         expect(result.hoverFilterIndex).toBe(2);
      });

      it('should use lastHoverFilterIndex if available', () => {
         const stateWithLastHover = { ...testState, lastHoverFilterIndex: 2 };
         const action: ActionSearch = {
            type: 'NAVIGATE_FILTER',
            payload: { dir: 'right', index: 1 }
         };

         const result = searchReducer(stateWithLastHover, action);

         expect(result.hoverFilterIndex).toBe(3);
      });
   });
   describe('NAVIGATE_ACTION actions', () => {
      beforeEach(() => {
         testState.searchFrequentViewed = [
            {
               name: 'Result 1',
               category: 'device',
               visible: true,
               description: '',
               actions: [
                  { action: '/edit', title: 'Edit', target: '_self' },
                  { action: '/delete', title: 'Delete', target: '_self' },
                  { action: '/share', title: 'Share', target: '_blank' },
               ]
            },
         ];
      });

      it('should start action navigation from beginning', () => {
         const action: ActionSearch = {
            type: 'NAVIGATE_ACTION',
            payload: { dir: 'right', index: 1 }
         };

         const result = searchReducer(testState, action);

         expect(result.hoverActionIndex).toBe(0);
         expect(result.hoverFilterIndex).toBe(-1);
      });

      it('should navigate through actions', () => {
         const stateWithActionHover = { ...testState, hoverActionIndex: 0 };
         const action: ActionSearch = {
            type: 'NAVIGATE_ACTION',
            payload: { dir: 'right', index: 1 }
         };

         const result = searchReducer(stateWithActionHover, action);

         expect(result.hoverActionIndex).toBe(1);
      });

      it('should handle no actions available', () => {
         testState.searchFrequentViewed = [
            { name: 'Result 1', category: 'device', visible: true, actions: [], description: '' }
         ];

         const action: ActionSearch = {
            type: 'NAVIGATE_ACTION',
            payload: { dir: 'right', index: 1 }
         };

         const result = searchReducer(testState, action);

         expect(result).toEqual(testState);
      });
   });

   describe('RESET_FILTER_HOVER action', () => {
      it('should reset filter hover state', () => {
         const stateWithHover = { ...testState, hoverFilterIndex: 4 };
         const action: ActionSearch = { type: 'RESET_FILTER_HOVER' };

         const result = searchReducer(stateWithHover, action);

         expect(result.lastHoverFilterIndex).toBe(4);
         expect(result.hoverFilterIndex).toBe(-1);
      });
   });

   describe('RESET_ACTION_HOVER action', () => {
      it('should reset action hover to 0', () => {
         const action: ActionSearch = { type: 'RESET_ACTION_HOVER' };

         const result = searchReducer(testState, action);

         expect(result.hoverActionIndex).toBe(0);
      });
   });

   describe('CLEAR_RECENT action', () => {
      it('should clear frequent search data', () => {
         const stateWithData = {
            ...testState,
            searchFrequentDetails: ['recent search'],
            searchFrequentViewed: [{ name: 'Viewed', category: 'device', visible: true, actions: [], description: '' }],
         };

         const action: ActionSearch = { type: 'CLEAR_RECENT' };

         const result = searchReducer(stateWithData, action);

         expect(result.searchFrequentDetails).toEqual([]);
         expect(result.searchFrequentViewed).toEqual([]);
      });
   });

   describe('UPDATE_FREQUENT_SEARCH action', () => {
      it('should update frequent search details', () => {
         const newData = ['search term 1', 'search term 2'];
         const action: ActionSearch = {
            type: 'UPDATE_FREQUENT_SEARCH',
            payload: newData
         };

         const result = searchReducer(testState, action);

         expect(result.searchFrequentDetails).toEqual(newData);
      });

      it('should handle undefined payload', () => {
         const action: ActionSearch = {
            type: 'UPDATE_FREQUENT_SEARCH',
            payload: undefined
         };

         const result = searchReducer(testState, action);

         expect(result.searchFrequentDetails).toEqual([]);
      });
   });

   describe('UPDATE_FREQUENT_VIEWED action', () => {
      it('should update frequent viewed with reset results', () => {
         const newData: SearchDetails[] = [
            { name: 'Viewed 1', category: 'device', visible: false, actions: [], description: '' }
         ];
         const action: ActionSearch = {
            type: 'UPDATE_FREQUENT_VIEWED',
            payload: newData
         };

         const result = searchReducer(testState, action);

         expect(result.searchFrequentViewed).toHaveLength(1);
         // resetResult should be applied to make results visible
         expect(result.searchFrequentViewed![0]).toEqual({
            name: 'Viewed 1',
            category: 'device',
            visible: true, // resetResult sets visible to true
            actions: [],
            description: ''
         });
      });

      it('should handle undefined payload', () => {
         const action: ActionSearch = {
            type: 'UPDATE_FREQUENT_VIEWED',
            payload: undefined
         };

         const result = searchReducer(testState, action);

         expect(result.searchFrequentViewed).toEqual([]);
      });
   });

   describe('TRIGGER_CLOSE_ACTION action', () => {
      it('should trigger close action with tracking', () => {
         const action: ActionSearch = {
            type: 'TRIGGER_CLOSE_ACTION',
            payload: 2
         };

         const result = searchReducer(testState, action);

         expect(result.triggerCloseAction).toBe(true);
         expect(result.trackDelay).toBe(TRACK_DELAY_STATUS.END);
         expect(result.trackedItem).toBe(TRACKED_ITEM.timeto_navigate);
         expect(result.selectedResultIndex).toBe(2);
      });
   });

   describe('SET_SEARCH action', () => {
      it('should set search term and start loading', () => {
         const action: ActionSearch = {
            type: 'SET_SEARCH',
            payload: 'test query'
         };

         const result = searchReducer(testState, action);

         expect(result.searchTerm).toBe('test query');
         expect(result.startSearch).toBe(true);
         expect(result.isLoading).toBe(true);
         expect(result.selectedResultIndex).toBe(0);
         expect(result.trackDelay).toBe(TRACK_DELAY_STATUS.START);
      });

      it('should handle empty search term', () => {
         const action: ActionSearch = {
            type: 'SET_SEARCH',
            payload: ''
         };

         const result = searchReducer(testState, action);

         expect(result.searchTerm).toBe('');
         expect(result.startSearch).toBe(false);
         expect(result.isLoading).toBe(false);
      });
   });

   describe('UPDATE_SEARCH action', () => {
      it('should update search results and stop loading', () => {
         const searchResults: SearchDetails[] = [
            { name: 'Search Result 1', category: 'device', visible: false, actions: [], description: '' },
            { name: 'Search Result 2', category: 'interface', visible: false, actions: [], description: '' }
         ];
         const stateWithSearchTerm = { ...testState, searchTerm: 'test query' };
         const action: ActionSearch = {
            type: 'UPDATE_SEARCH',
            payload: searchResults
         };

         const result = searchReducer(stateWithSearchTerm, action);

         expect(result.searchResults).toHaveLength(2);
         // resetResult should be applied to make results visible
         expect(result.searchResults[0].visible).toBe(true);
         expect(result.searchResults[1].visible).toBe(true);
         expect(result.startSearch).toBe(false);
         expect(result.isLoading).toBe(false);
         expect(result.triggerCloseAction).toBe(false);
         expect(result.trackDelay).toBe(TRACK_DELAY_STATUS.PAUSE);
         expect(result.trackedItem).toBe(TRACKED_ITEM.search_api);

         // verify resetState was applied (resetCategories = false)
         expect(result.selectedResultIndex).toBe(0);
         expect(result.hoverFilterIndex).toBe(-1);
         expect(result.hoverActionIndex).toBe(-1);
      });

      it('should handle empty search results', () => {
         const action: ActionSearch = {
            type: 'UPDATE_SEARCH',
            payload: []
         };

         const result = searchReducer(testState, action);

         expect(result.searchResults).toEqual([]);
         expect(result.startSearch).toBe(false);
         expect(result.isLoading).toBe(false);
      });
   });

   describe('UPDATE_CATEGORIES action', () => {
      it('should update search filters from categories', () => {
         const categories = ['Device', 'Interface', 'Group', 'Dashboard', 'Report', 'Administration'];
         const action: ActionSearch = {
            type: 'UPDATE_CATEGORIES',
            payload: categories
         };

         const result = searchReducer(testState, action);

         expect(result.isLoading).toBe(false);
         expect(result.searchFilters).toEqual([
            { filter: 'device', label: 'Device', selected: false },
            { filter: 'interface', label: 'Interface', selected: false },
            { filter: 'group', label: 'Group', selected: false },
            { filter: 'dashboard', label: 'Dashboard', selected: false },
            { filter: 'report', label: 'Report', selected: false },
            { filter: 'administration', label: 'Administration', selected: false },
         ]);
      });

      it('should handle partial categories list', () => {
         const categories = ['Device', 'Dashboard', 'Administration'];
         const action: ActionSearch = {
            type: 'UPDATE_CATEGORIES',
            payload: categories
         };

         const result = searchReducer(testState, action);

         expect(result.isLoading).toBe(false);
         expect(result.searchFilters).toEqual([
            { filter: 'device', label: 'Device', selected: false },
            { filter: 'dashboard', label: 'Dashboard', selected: false },
            { filter: 'administration', label: 'Administration', selected: false },
         ]);
      });
   });

   describe('RESET_STATE action', () => {
      it('should reset state and clear search term', () => {
         const stateWithData = {
            ...testState,
            searchTerm: 'test',
            selectedResultIndex: 5,
            isLoading: true,
            hoverFilterIndex: 2,
            hoverActionIndex: 1,
            triggerCloseAction: true,
         };

         const action: ActionSearch = { type: 'RESET_STATE' };

         const result = searchReducer(stateWithData, action);

         // verify resetState was applied
         expect(result.searchTerm).toBe('');
         expect(result.selectedResultIndex).toBe(0);
         expect(result.lastHoverFilterIndex).toBe(-1);
         expect(result.hoverFilterIndex).toBe(-1);
         expect(result.hoverActionIndex).toBe(-1);
         expect(result.triggerCloseAction).toBe(false);
         expect(result.trackDelay).toBe(TRACK_DELAY_STATUS.IDLE);
         expect(result.trackedItem).toBeUndefined();

         // verify filters are reset
         expect(result.searchFilters.every(f => f.selected === false)).toBe(true);
         expect(result.isAllSelected).toBe(true);
      });
   });

   describe('TRIGGER_DELAY action', () => {
      it('should update tracking delay status', () => {
         const action: ActionSearch = {
            type: 'TRIGGER_DELAY',
            payload: {
               status: TRACK_DELAY_STATUS.START,
               trackItem: TRACKED_ITEM.search_api
            }
         };

         const result = searchReducer(testState, action);

         expect(result.trackDelay).toBe(TRACK_DELAY_STATUS.START);
         expect(result.trackedItem).toBe(TRACKED_ITEM.search_api);
      });

      it('should handle tracking delay without trackItem', () => {
         const action: ActionSearch = {
            type: 'TRIGGER_DELAY',
            payload: {
               status: TRACK_DELAY_STATUS.PAUSE
            }
         };

         const result = searchReducer(testState, action);

         expect(result.trackDelay).toBe(TRACK_DELAY_STATUS.PAUSE);
         expect(result.trackedItem).toBeUndefined();
      });
   });

   describe('Unknown action type', () => {
      it('should return unchanged state and log warning', () => {
         const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });
         const action = { type: 'UNKNOWN_ACTION' as any };

         const result = searchReducer(testState, action);

         expect(result).toEqual(testState);
         expect(consoleSpy).toHaveBeenCalledWith('Unknown action type: UNKNOWN_ACTION');

         consoleSpy.mockRestore();
      });
   });

   describe('Edge cases', () => {
      it('should handle FILTER_CLICK without payload', () => {
         const action: ActionSearch = {
            type: 'FILTER_CLICK',
            payload: undefined as any
         };

         const result = searchReducer(testState, action);

         expect(result).toEqual(testState);
      });

      it('should handle FILTER_CLICK with empty filter', () => {
         const action: ActionSearch = {
            type: 'FILTER_CLICK',
            payload: { filter: '' }
         };

         const result = searchReducer(testState, action);

         expect(result).toEqual(testState);
      });

      it('should handle navigation with mixed visibility results', () => {
         const stateWithMixedVisibility = {
            ...testState,
            searchFrequentViewed: [
               { name: 'Visible Device', category: 'device', visible: true, actions: [], description: '' },
               { name: 'Hidden Interface', category: 'interface', visible: false, actions: [], description: '' },
               { name: 'Visible Group', category: 'group', visible: true, actions: [], description: '' },
               { name: 'Hidden Dashboard', category: 'dashboard', visible: false, actions: [], description: '' },
               { name: 'Visible Report', category: 'report', visible: true, actions: [], description: '' },
            ]
         };

         const action: ActionSearch = {
            type: 'NAVIGATE_RESULT',
            payload: { dir: 'down', index: 1 }
         };

         const result = searchReducer(stateWithMixedVisibility, action);

         expect(result.selectedResultIndex).toBe(1);
      });

      it('should handle filter navigation with no filters', () => {
         const emptyFilterState = { ...testState, searchFilters: [] };
         const action: ActionSearch = {
            type: 'NAVIGATE_FILTER',
            payload: { dir: 'right', index: 1 }
         };

         const result = searchReducer(emptyFilterState, action);

         expect(result.hoverFilterIndex).toBe(0);
      });

      it('should handle action navigation with selected result having no actions', () => {
         const stateWithNoActions = {
            ...testState,
            searchFrequentViewed: [
               { name: 'Result 1', category: 'device', visible: true, actions: [], description: '' }
            ]
         };

         const action: ActionSearch = {
            type: 'NAVIGATE_ACTION',
            payload: { dir: 'right', index: 1 }
         };

         const result = searchReducer(stateWithNoActions, action);

         expect(result).toEqual(stateWithNoActions);
      });
   });

   describe('Complex filter logic', () => {
      it('should correctly handle isNotAllFiltersSelected logic', () => {
         // start with one filter selected
         const stateWithOneSelected = {
            ...testState,
            searchFilters: [
               { filter: 'device', label: 'Device', selected: true },
               { filter: 'interface', label: 'Interface', selected: false },
               { filter: 'group', label: 'Group', selected: false },
               { filter: 'dashboard', label: 'Dashboard', selected: false },
               { filter: 'report', label: 'Report', selected: false },
               { filter: 'administration', label: 'Administration', selected: false },
            ],
            isAllSelected: false
         };

         // Deselect the only selected filter
         const action: ActionSearch = {
            type: 'FILTER_CLICK',
            payload: { filter: 'device' }
         };

         const result = searchReducer(stateWithOneSelected, action);

         expect(result.isAllSelected).toBe(true);
         const deviceFilter = result.searchFilters.find(f => f.filter === 'device');
         expect(deviceFilter?.selected).toBe(false);
      });

      it('should handle frequent viewed results reordering', () => {
         const stateWithResults = {
            ...testState,
            searchFrequentViewed: [
               { name: 'Device 1', category: 'device', visible: true, actions: [], description: '' },
               { name: 'Interface 1', category: 'interface', visible: false, actions: [], description: '' },
               { name: 'Group 1', category: 'group', visible: true, actions: [], description: '' },
               { name: 'Dashboard 1', category: 'dashboard', visible: true, actions: [], description: '' },
               { name: 'Report 1', category: 'report', visible: false, actions: [], description: '' },
               { name: 'Admin 1', category: 'administration', visible: true, actions: [], description: '' },
            ]
         };

         const action: ActionSearch = {
            type: 'FILTER_CLICK',
            payload: { filter: 'administration' }
         };

         const result = searchReducer(stateWithResults, action);

         // Should have reordered results with visible ones first

         expect(result.searchFrequentViewed).toBeDefined();
         if (result.searchFrequentViewed) {
            expect(result.searchFrequentViewed[0].name).toEqual('Admin 1');
            expect(result.searchFrequentViewed[1].visible).toEqual(false);
            expect(result.searchFrequentViewed.length).toBe(6);
         }
      });
   });
});