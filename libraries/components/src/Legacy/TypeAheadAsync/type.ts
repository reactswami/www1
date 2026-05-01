import { type GroupBase } from 'react-select';
import { type AsyncProps } from 'react-select/async';
/**
 * Represents an option in the select dropdown.
 */
export type SelectOption = {
    /** The unique value of the option */
    value: string | number;
    /** The display label for the option */
    label: string;
};

/**
 * Callback type for single selection changes.
 * @param option - The selected option, or null if cleared
 */
export type SingleSelectHandler = (option: SelectOption | null) => void;

/**
 * Callback type for multiple selection changes.
 * @param options - Array of selected options
 */
export type MultiSelectHandler = (options: SelectOption[]) => void;

/**
 * Base props shared by all TypeAheadAsync variants.
 * @template IsMulti - Boolean indicating if multiple selections are allowed
 */
export interface BaseTypeAheadAsyncProps<IsMulti extends boolean>
    extends Omit<AsyncProps<SelectOption, IsMulti, GroupBase<SelectOption>>, 'loadOptions' | 'onChange' | 'isMulti'> {
    /**
     * Default options to display before any search is performed.
     * Can be an array of options or true to load default options on mount.
     * @default undefined
     */
    defaultOptions?: SelectOption[] | boolean;

    /**
     * Async function to load options based on user input.
     * @param inputValue - The current search string entered by the user
     * @returns Promise resolving to an array of matching options
     */
    loadOptions?: (inputValue: string) => Promise<SelectOption[]>;

    /**
     * Message to display when no options are found.
     * @default 'No results found'
     */
    emptyMessage?: string;

    /**
     * Determines if multiple selections are allowed.
     */
    isMulti: IsMulti;

    /**
     * Defines the size (height) of the select component
     */
    size?: 'sm' | 'md' | 'lg';
}

/**
 * Props for single-selection mode.
 */
export interface SingleSelectProps extends BaseTypeAheadAsyncProps<boolean> {
    /**
     * Callback fired when the selected option changes.
     * Receives null when selection is cleared.
     */
    onChange: SingleSelectHandler;

    /**
     * The currently selected option for controlled component usage.
     */
    value?: SelectOption | null;

    /**
     * Must be false for single-selection mode.
     */
    isMulti: false;
}

/**
 * Props for multi-selection mode.
 */
export interface MultiSelectProps extends BaseTypeAheadAsyncProps<boolean> {
    /**
     * Callback fired when the selected options change.
     * Receives an array of selected options.
     */
    onChange: MultiSelectHandler;

    /**
     * The currently selected options for controlled component usage.
     */
    value?: SelectOption[];

    /**
     * Must be true for multi-selection mode.
     */
    isMulti: true;
}

/**
 * Union type for all TypeAheadAsync prop variants.
 */
export type TypeAheadAsyncProps = SingleSelectProps | MultiSelectProps;
