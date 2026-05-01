import { z } from 'zod';
import { type TRACK_DELAY_STATUS } from "~/hooks/useTrackDelay";

export const SearchActionSchema = z.object({
   action: z.string(),
   title: z.string(),
   target: z.enum(['_self', '_blank']),
   height: z.number().optional().nullable(),
   width: z.number().optional().nullable(),
});

// Define the SearchDetails schema
export const SearchDetailsSchema = z.object({
   name: z.string(),
   description: z.union([
      z.record(z.string(), z.string().nullable()), // Record<string, string>
      z.string()
   ]).optional(),
   actions: z.array(SearchActionSchema),
   category: z.string(),
   visible: z.boolean(),
   status: z.string().optional().nullable(),
});

export type SearchFilter = {
   filter: string;
   label: string;
   selected: boolean;
};

export type SearchAction = z.infer<typeof SearchActionSchema>;
export type SearchDetails = z.infer<typeof SearchDetailsSchema>;

export enum ResultStatus {
   online,
   offline,
   disabled,
   enabled,
   up,
   down,
   _default
}

export enum TRACKED_ITEM {
   search_api = 'backend_api',
   timeto_navigate = 'timeto_navigate',
};

export type TResultStatus = keyof typeof ResultStatus;

export type SearchState = {
   searchTerm?: string;
   searchFilters: SearchFilter[];
   isAllSelected: boolean;
   hasNewData: boolean;
   lastHoverFilterIndex: number;
   hoverFilterIndex: number;
   hoverActionIndex: number;
   selectedResultIndex: number;
   searchResults: SearchDetails[];
   searchFrequentDetails?: string[];
   searchFrequentViewed?: SearchDetails[];
   isLoading: boolean;
   startSearch: boolean;
   triggerCloseAction: boolean;
   trackDelay: TRACK_DELAY_STATUS;
   trackedItem?: TRACKED_ITEM;
};

export type SearchActionPayLoad = Pick<SearchFilter, 'filter'>;

export type ActionSearch =
   | { type: 'FILTER_CLICK'; payload: SearchActionPayLoad }
   | { type: 'NAVIGATE_RESULT'; payload: { dir: 'up' | 'down'; index: number } }
   | { type: 'NAVIGATE_FILTER'; payload: { dir: 'left' | 'right'; index: number } }
   | { type: 'NAVIGATE_ACTION'; payload: { dir: 'left' | 'right'; index: number } }
   | { type: 'RESET_FILTER_HOVER' }
   | { type: 'RESET_ACTION_HOVER' }
   | { type: 'SET_SEARCH'; payload: string }
   | { type: 'RESET_STATE' }
   | { type: 'CLEAR_RECENT' }
   | { type: 'TRIGGER_DELAY'; payload: { status: TRACK_DELAY_STATUS; trackItem?: TRACKED_ITEM } }
   | { type: 'CLEAR_RECENT' }
   | { type: 'TRIGGER_CLOSE_ACTION'; payload: number }
   | { type: 'UPDATE_FREQUENT_SEARCH'; payload?: string[] }
   | { type: 'UPDATE_FREQUENT_VIEWED'; payload?: SearchDetails[] }
   | { type: 'UPDATE_CATEGORIES'; payload: string[] }
   | { type: 'UPDATE_SEARCH'; payload: SearchDetails[] };
