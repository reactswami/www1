import { Text } from '@statseeker/components/Typography/Text';
import { TRACK_DELAY_STATUS } from '../hooks/useTrackDelay';
import { type SearchAction, type TResultStatus } from '../types';
import { type SearchState, type SearchFilter, type SearchDetails } from '~/types';

export const pillColors: Record<
   string,
   'blue' | 'cyan' | 'gray' | 'pink' | 'purple' | 'yellow' | 'success' | 'warning' | 'danger'
> = {
   device: 'blue', // blue.500
   interface: 'purple', // purple.500
   dashboard: 'yellow', // yellow.400
   report: 'pink', // pink.400
   group: 'cyan', // cyan.500
   administration: 'gray', // gray.500
};

export const ActiveDisplayWidth = 32;

export const CONTAINER_WIDTHS = {
   CLOSED_DESKTOP: '7vw',
   CLOSED_MOBILE: '1px',
   OPEN: `620px`,
   INPUT_WIDTH: '180PX',
   INPUT_MARGIN: '5px'
} as const;

export const GLOBAL_SEARCH_INPUT_ID = ['globalsearch-input', 'global-search-top', 'global-search'];

export const resetFilter = (filter: SearchFilter) => ({
   ...filter,
   selected: false,
});

export const resetResult = (res: SearchDetails, index: number): SearchDetails =>
   index === 0 ? { ...res, visible: true } : { ...res, visible: true };

export const resetState = (state: SearchState, resetCategories = true): SearchState => {
   const { searchFilters, searchResults, searchFrequentViewed, searchTerm } = state;

   const results = searchTerm ? searchResults : searchFrequentViewed ?? [];
   const updatedResults = results.map(resetResult);

   return {
      ...state,
      ...(resetCategories && { searchFilters: searchFilters.map(resetFilter), isAllSelected: true }),
      selectedResultIndex: 0,
      lastHoverFilterIndex: -1,
      hoverFilterIndex: -1,
      hoverActionIndex: -1,
      triggerCloseAction: false,
      ...(searchTerm && { searchResults: updatedResults }),
      ...(!searchTerm && { searchFrequentViewed: updatedResults }),
      trackDelay: TRACK_DELAY_STATUS.IDLE,
      trackedItem: undefined,
      isLoading: false
   };
};

export const ReportStatusColor: Record<TResultStatus, string> = {
   offline: 'red.300',
   online: 'green.500',
   enabled: 'green.500',
   disabled: 'gray.500',
   up: 'green.500',
   down: 'red.300',
   _default: 'orange.500',
};

declare global {

   interface RegExpConstructor {
      /**
       * Escapes any potential regex syntax characters in a string, returning a new string.
       * @param string The string to escape
       * @returns The escaped string safe for use in regex patterns
       */
      escape(string: string): string;
   }
};

export const highlightText = (text?: string, searchTerm?: string) => {
   if (!searchTerm || !text) return text;

   const regex = new RegExp(`(${searchTerm})`, 'gi');
   const parts = text.split(regex);

   return parts.map((part, index) =>
      regex.test(part) ? (
         <Text
            as="span"
            key={index}
            color={'search.highlightText'}
            bg="search.highlightBg"
            fontWeight="semibold"
         >
            {part}
         </Text>
      ) : (
         part
      )
   );
};

type RecordValue = string | string[];
type RecordType = { [key: string]: RecordValue };

export function convertMetaDataToString(record: RecordType | undefined): Record<string, string> {
   const result: Record<string, string> = {};
   const unicodeDot = '\u2022';

   for (const key in record) {
      const value = record[key];
      result[key] = Array.isArray(value) ? value.join(` ${unicodeDot} `) : value;
   }

   return result;
}

// Define the ordered sections template
export const ORDERED_CATEGORIES = [
   "Device",
   "Interface",
   "Group",
   "Dashboard",
   "Report",
   "Administration"
];

export function orderCategories(unorderedCategories: string[]) {
   const categorySet = new Set(unorderedCategories);
   return ORDERED_CATEGORIES.filter(section => categorySet.has(section));
}


export const BREAKPOINTS = {
   MOBILE: '(max-width: 810px)',
   ICONS: '(max-width: 1600px)',
} as const;

export const openInNewWindow = (action: SearchAction) => {
   const target = Math.round(Math.random() * 100000);
   const options = `location=no,menubar=no,status=no,titlebar=no,toolbar=no,scrollbars=yes,resizable=yes,width=${action.width},height=${action.height}`;
   window.open(action.action, String(target), options);
};

declare global {
   interface Window {
      cur_user: string;
   }
}

export const STORAGE_KEYS = {
   SEARCH_RESULTS: import.meta.env.MODE === 'test' ? 'admin' : window.cur_user + 'searchResults',
   SEARCH_TERMS: import.meta.env.MODE === 'test' ? 'admin' : window.cur_user + 'searchKeys',
} as const;
