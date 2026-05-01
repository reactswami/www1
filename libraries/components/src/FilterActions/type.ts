import { type ChakraProps } from "@chakra-ui/react";
import type React from "react";

/**
 * Type of filter - either single selection (radio) or multi-selection (checkbox)
 */
export type FilterType = 'radio' | 'checkbox';
type BooleanOrFn<TContext> = boolean | ((context: TContext) => boolean);

/**
 * Base interface for filter context objects.
 * Extend this interface to create typed contexts for your specific use cases.
 * 
 * @example
 * ```typescript
 * interface MyFilterContext extends FilterContext {
 *   dataType: string;
 *   hasSelectedItems: boolean;
 * }
 * ```
 */
export interface FilterContext { }

/**
 * Configuration for an individual filter option within a filter group.
 * 
 * @template TContext - The type of context object used for conditional logic
 * 
 * @property {string} label - The display text for the option
 * @property {string} value - The value used when this option is selected
 * @property {React.ReactNode} [icon] - Optional icon to display before the label
 * @property {ChakraProps['color']} [circleColor] - Optional color for a status circle indicator
 * @property {'capitalize' | 'uppercase' | 'lowercase' | 'none'} [textTransform] - Text transformation to apply to the label
 * @property {boolean | ((context: TContext) => boolean)} [visible] - Controls whether this option is visible. Can be a boolean or function that receives context
 * @property {boolean | ((context: TContext) => boolean)} [disabled] - Controls whether this option is disabled. Can be a boolean or function that receives context
 * 
 * @example
 * ```typescript
 * const option: FilterOption = {
 *   label: 'Active',
 *   value: 'active',
 *   circleColor: 'green.500',
 *   textTransform: 'capitalize',
 *   visible: (ctx) => ctx.hasPermission,
 *   disabled: (ctx) => !ctx.dataLoaded
 * }
 * ```
 */
export interface FilterOption<TContext> {
    label: string;
    value: string;
    icon?: React.ReactNode;
    circleColor?: ChakraProps['color'];
    textTransform?: 'capitalize' | 'uppercase' | 'lowercase' | 'none';
    visible?: boolean | ((context: TContext) => boolean);
    disabled?: boolean | ((context: TContext) => boolean);
}

/**
 * Configuration for a group of related filter options.
 * 
 * @template TContext - The type of context object used for conditional logic
 * 
 * @property {string} id - Unique identifier for this filter group. Used as the key when reporting filter changes
 * @property {string} title - Display title shown above the filter options
 * @property {FilterType} type - Whether this is a single-select (radio) or multi-select (checkbox) filter
 * @property {FilterOption<TContext>[]} options - Array of filter options in this group
 * @property {string | string[]} [value] - Current selected value(s). String for radio, array for checkbox
 * @property {boolean | ((context: TContext) => boolean)} [visible] - Controls whether this entire group is visible
 * @property {boolean | ((context: TContext) => boolean)} [disabled] - Controls whether this entire group is disabled
 * 
 * @example
 * ```typescript
 * const filterGroup: FilterGroup = {
 *   id: 'status',
 *   title: 'Status',
 *   type: 'checkbox',
 *   options: [
 *     { label: 'Active', value: 'active' },
 *     { label: 'Inactive', value: 'inactive' }
 *   ],
 *   value: ['active'],
 *   disabled: (ctx) => !ctx.dataTypeSelected
 * }
 * ```
 */
interface FilterGroupBase<TContext> {
    id: string;
    title: string;
    options: FilterOption<TContext>[];
    visible?: BooleanOrFn<TContext>;
    disabled?: BooleanOrFn<TContext>;
}
export type FilterGroup<TContext = FilterContext> = FilterGroupBase<TContext>
    & ({
        type?: 'radio';
        value?: string;
    }
        | {
            type?: 'checkbox';
            value: string[];
        });

/**
 * Props for the FilterActions component.
 * 
 * @template TContext - The type of context object used for conditional logic
 * 
 * @property {FilterGroup<TContext>[]} filterGroups - Array of filter group configurations
 * @property {(filterId: string, value: string | string[]) => void} onFilterChange - Callback when a filter value changes
 * @property {() => void} onResetFilters - Callback when the reset filters button is clicked
 * @property {boolean} [isLoading] - Whether the component should show a loading state (disables the button)
 * @property {number} [appliedFiltersCount] - Optional override for the filter count badge. If not provided, automatically calculated
 * @property {TContext} [context] - Context object passed to visibility and disabled condition functions
 * 
 * @example
 * ```typescript
 * <FilterActions
 *   filterGroups={filterGroups}
 *   onFilterChange={(id, value) => setFilters({ ...filters, [id]: value })}
 *   onResetFilters={() => setFilters({})}
 *   context={{ dataType: 'devices' }}
 * />
 * ```
 */
export interface GenericFilterProps<TContext = FilterContext> {
    filterGroups: FilterGroup<TContext>[];
    onFilterChange: (filterId: string, value: string | string[]) => void;
    onResetFilters: () => void;
    isLoading?: boolean;
    appliedFiltersCount?: number;
    context?: TContext;
}