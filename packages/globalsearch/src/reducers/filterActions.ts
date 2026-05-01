import { resetState } from '../utils';
import {
    type SearchFilter,
    type SearchState,
    type SearchActionPayLoad,
} from '~/types';

const filterClickActions: Record<
    string,
    (state: SearchState, payload: SearchActionPayLoad) => SearchState
> = {
    All: (state: SearchState) => {
        return resetState(state);
    },
    _default: (state: SearchState, payload: SearchActionPayLoad): SearchState => {
        const { searchFilters, searchTerm, searchFrequentViewed, isAllSelected } = state;


        // if all filters are selected then turn off only the filter which is selected and set to unselected every other ones
        // if all filters are not selected then toggle the selected filter and keep the other filter in the same state
        const updatedFilters = searchFilters.map((filter: SearchFilter) =>
            filter.filter === payload.filter
                ? {
                    ...filter,
                    selected: isAllSelected ? true : !filter.selected,

                }
                : {
                    ...filter,
                    selected: isAllSelected ? false : filter.selected,

                }
        );

        const selectedFilters = updatedFilters.filter(f => f.selected === true).map(f => f.filter);
        const isNotAllFiltersSelected = selectedFilters.length === 0;


        let updatedResults = searchFrequentViewed ?? [];
        // update the results for the selected filter to be visible in the results which has two cases
        // A. Case when all the filters are selected:
        // Action on selected filter: Should display the results of the filter
        // Action on other filters: The result of other filters should not be displayed
        // B. Case when not all the filters are selected
        // Action on selected filter: Should toggle the display of the selected filter
        // Action on other filters: Should not change the visibility of the results of other filters
        if (!searchTerm) {
            updatedResults = updatedResults.map((result) =>
            ({
                ...result, visible: isNotAllFiltersSelected || selectedFilters.includes(result.category), selected: false,
            }));

            const selectedResults = updatedResults.filter(res => res.visible).reverse().map(
                (res, index) => index === 0 ? { ...res, selected: true } : { ...res });

            updatedResults = [...selectedResults, ...updatedResults.filter(res => !res.visible)];
        }


        return {
            ...state,
            searchFilters: updatedFilters,
            isAllSelected: isNotAllFiltersSelected,
            hasNewData: false,
            selectedResultIndex: 0,
            hoverActionIndex: -1,
            ...(!searchTerm && { searchFrequentViewed: updatedResults }),
        };
    },
};

export default filterClickActions;