import {
    Button,
    Flex,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuItemOption,
    MenuList,
    MenuOptionGroup,
    Tag,
    Circle,
    Text
} from '@chakra-ui/react';
import { Cross2Icon } from '@radix-ui/react-icons';
import { FilterIcon } from '@statseeker/ui/icons';
import React from 'react';
import { type FilterContext, type FilterGroup, type FilterOption, type GenericFilterProps } from './type';

// Helper to derive type from value at runtime
const getFilterType = (value: FilterGroup['value']): 'radio' | 'checkbox' =>
    Array.isArray(value) ? 'checkbox' : 'radio';


/**
 * Internal component that renders the content of a filter option.
 * Displays optional circle indicator, icon, and label with text transformation.
 * 
 * @param {Object} props - Component props
 * @param {FilterOption} props.option - The filter option to render
 * @returns {JSX.Element} Rendered option content
 * @private
 */
const OptionContent: React.FC<{
    option: FilterOption<any>;
}> = ({ option }) => {
    return (
        <Flex alignItems="center" gap="sm">
            {option.circleColor && (
                <Circle
                    size={3}
                    backgroundColor={option.circleColor}
                    marginRight={1}
                />
            )}
            {option.icon && option.icon}
            <Text
                fontSize="sm"
                textTransform={option.textTransform || 'none'}
            >
                {option.label}
            </Text>
        </Flex>
    );
};

/**
 * A generic, context-aware filter component that supports both radio and checkbox filter groups.
 * 
 * Features:
 * - Radio (single-select) and checkbox (multi-select) filter types
 * - Context-based visibility and disabled states for groups and individual options
 * - Visual indicators (colored circles, icons)
 * - Automatic filter count badge
 * - Toggle behavior for radio buttons (click again to deselect)
 * - Loading state support
 * - Customizable text transformation
 * 
 * @template TContext - The type of context object for conditional logic. Defaults to FilterContext
 * 
 * @param {GenericFilterProps<TContext>} props - Component props
 * @returns {JSX.Element} Rendered filter menu component
 * 
 * @example
 * ```typescript
 * // Basic usage with radio filters
 * const filterGroups: FilterGroup[] = [
 *   {
 *     id: 'status',
 *     title: 'Status',
 *     type: 'radio',
 *     value: currentStatus,
 *     options: [
 *       { label: 'Active', value: 'active', circleColor: 'green.500' },
 *       { label: 'Inactive', value: 'inactive', circleColor: 'red.500' }
 *     ]
 *   }
 * ];
 * 
 * <FilterActions
 *   filterGroups={filterGroups}
 *   onFilterChange={(id, value) => handleFilterChange(id, value)}
 *   onResetFilters={() => resetAllFilters()}
 * />
 * ```
 * 
 * @example
 * ```typescript
 * // Advanced usage with context-based visibility
 * interface MyContext extends FilterContext {
 *   dataType: string;
 *   hasSelectedItems: boolean;
 * }
 * 
 * const context: MyContext = {
 *   dataType: 'devices',
 *   hasSelectedItems: true
 * };
 * 
 * const filterGroups: FilterGroup<MyContext>[] = [
 *   {
 *     id: 'advanced',
 *     title: 'Advanced Filters',
 *     type: 'checkbox',
 *     visible: (ctx) => ctx.hasSelectedItems,
 *     disabled: (ctx) => !ctx.dataType,
 *     options: [...]
 *   }
 * ];
 * 
 * <FilterActions<MyContext>
 *   filterGroups={filterGroups}
 *   onFilterChange={handleChange}
 *   onResetFilters={handleReset}
 *   context={context}
 * />
 * ```
 */
export const FilterActions = <TContext extends FilterContext>({
    filterGroups,
    onFilterChange,
    onResetFilters,
    isLoading = false,
    appliedFiltersCount,
    context = {} as TContext,
}: GenericFilterProps<TContext>) => {

    /**
        * Evaluates a condition that can be either a static boolean or a function.
        *
        * @param {boolean | ((context: TContext) => boolean) | undefined} condition - The condition to evaluate
        * @param {boolean} defaultValue - Default value if condition is undefined
        * @returns {boolean} The evaluated result
        * @private
        */
    const evaluateCondition = (
        condition: boolean | ((context: TContext) => boolean) | undefined,
        defaultValue: boolean
    ): boolean => {
        if (condition === undefined) return defaultValue;
        return typeof condition === 'function' ? condition(context) : condition;
    };

    // Filter out invisible groups
    const visibleGroups = filterGroups.map(g => ({ ...g, type: getFilterType(g.value) })).filter((group) =>
        evaluateCondition(group.visible, true)
    );

    // Calculate applied filters count if not provided
    const filtersCount = appliedFiltersCount ?? visibleGroups.reduce((count, group) => {
        if (Array.isArray(group.value)) {
            return count + group.value.length;
        }
        return count + (group.value ? 1 : 0);
    }, 0);

    /**
     * Handles changes to radio button filters with toggle behavior.
     * If the same value is clicked again, it will be deselected.
     *
     * @param {string} groupId - The ID of the filter group
        * @param {string | undefined} currentValue - The currently selected value
        * @param {string} newValue - The newly clicked value
        * @private
        */
    const handleRadioChange = (groupId: string, currentValue: string | undefined, newValue: string) => {
        // Toggle behavior: if clicking the same value, clear it
        onFilterChange(groupId, currentValue === newValue ? '' : newValue);
    };

    /**
     * Handles changes to checkbox filters.
     * Toggles the clicked value in the array of selected values.
     *
     * @param {string} groupId - The ID of the filter group
        * @param {string[]} currentValues - The currently selected values
        * @param {string} toggledValue - The value to toggle
        * @private
        */
    const handleCheckboxChange = (
        groupId: string,
        currentValues: string[],
        toggledValue: string
    ) => {
        const newValues = currentValues.includes(toggledValue)
            ? currentValues.filter((v) => v !== toggledValue)
            : [...currentValues, toggledValue];
        onFilterChange(groupId, newValues);
    };

    return (
        <Menu closeOnSelect={false}>
            <MenuButton
                as={Button}
                variant="outline"
                leftIcon={<FilterIcon />}
                isDisabled={isLoading}
                size='sm'
            >
                <Flex alignItems="center" gap="sm">
                    Filters
                    {filtersCount > 0 && (
                        <Tag
                            size="sm"
                            fontSize="xs"
                            colorScheme="orange"
                            variant="subtle"
                            borderRadius="full"
                        >
                            {filtersCount}
                        </Tag>
                    )}
                </Flex>
            </MenuButton>
            <MenuList>
                {visibleGroups.map((group, groupIndex) => {
                    const isGroupDisabled = evaluateCondition(group.disabled, false);

                    // Filter visible options
                    const visibleOptions = group.options.filter((option) =>
                        evaluateCondition(option.visible, true)
                    );

                    // Skip rendering if no visible options
                    if (visibleOptions.length === 0) return null;

                    return (
                        <React.Fragment key={group.id}>
                            {groupIndex > 0 && <MenuDivider />}
                            <MenuOptionGroup
                                type={group.type}
                                title={group.title}
                                value={group.type === 'radio' ? (group.value as string) ?? '' : (group.value as string[])}
                            >
                                {visibleOptions.map((option) => {
                                    const isOptionDisabled = isGroupDisabled || evaluateCondition(option.disabled, false);

                                    return (
                                        <MenuItemOption
                                            key={option.value}
                                            value={option.value}
                                            isDisabled={isOptionDisabled}
                                            onClick={() => {
                                                if (isOptionDisabled) return;

                                                if (group.type === 'radio') {
                                                    handleRadioChange(group.id, group.value as string, option.value);
                                                } else {
                                                    handleCheckboxChange(
                                                        group.id,
                                                        (group.value as string[]) || [],
                                                        option.value
                                                    );
                                                }
                                            }}
                                            borderColor="gray.300"
                                            background="white"
                                            transition="100ms ease-out background"
                                            cursor={isOptionDisabled ? 'not-allowed' : 'pointer'}
                                            opacity={isOptionDisabled ? 0.5 : 1}
                                            _hover={{
                                                background: isOptionDisabled ? 'white' : 'blue.50',
                                            }}
                                        >
                                            <OptionContent option={option} />
                                        </MenuItemOption>
                                    );
                                })}
                            </MenuOptionGroup>
                        </React.Fragment>
                    );
                })}
                <MenuDivider />
                <MenuItem
                    fontSize="sm"
                    onClick={onResetFilters}
                    color="red.600"
                >
                    <Flex alignItems="center" gap={2}>
                        <Cross2Icon />
                        Reset filters
                    </Flex>
                </MenuItem>
            </MenuList>
        </Menu>
    );
};

export default FilterActions;