import { useTheme } from '@chakra-ui/react';
import { getReactSelectStyles } from '@statseeker/components/utils/utils';
import { memo, useCallback } from 'react';
import {
    type StylesConfig,
    type GroupBase,
    type OnChangeValue,
    components,
    type NoticeProps,
    type ActionMeta
} from 'react-select';
import AsyncSelect from 'react-select/async';
import {
    type MultiSelectHandler,
    type MultiSelectProps,
    type SingleSelectHandler,
    type SingleSelectProps,
    type TypeAheadAsyncProps,
    type SelectOption
} from './type';

/**
 * Custom component for displaying the "no options" message.
 * Memoized to avoid unnecessary re-renders.
 */
const CustomNoOptionsMessage = memo(
    ({ message, ...props }: NoticeProps<SelectOption, boolean, GroupBase<SelectOption>> & { message: string }) => {
        return (
            <components.NoOptionsMessage {...props}>
                <span>{message}</span>
            </components.NoOptionsMessage>
        );
    }
);
CustomNoOptionsMessage.displayName = 'CustomNoOptionsMessage';

/**
 * Convert size prop to maxHeight value for react-select menu.
 * Provides a mapping from size keywords to pixel values.
 */
export const getHeight = (size?: 'sm' | 'md' | 'lg') => {
   switch (size) {
      case 'sm':
         return '37px';
      case 'md':
         return '80px';
      case 'lg':
         return '160px';
      default:
         return '37px';
   }
};


/**
 * An async type-ahead select component with Chakra UI theming support.
 * Supports both single and multiple selection modes with automatic caching
 * and debounced search functionality.
 * 
 * @param props - Component props (see SingleSelectProps or MultiSelectProps)
 * 
 * @example
 * // Single selection
 * <TypeAheadAsync
 *   isMulti={false}
 *   loadOptions={async (input) => fetchUsers(input)}
 *   onChange={(option) => console.log('Selected:', option)}
 *   defaultOptions={[{ value: 1, label: 'John' }]}
 * />
 * 
 * @example
 * // Multiple selection
 * <TypeAheadAsync
 *   isMulti={true}
 *   loadOptions={async (input) => fetchUsers(input)}
 *   onChange={(options) => console.log('Selected:', options)}
 *   placeholder="Select multiple users..."
 * />
 * 
 * @example
 * // Controlled component
 * const [selected, setSelected] = useState<SelectOption | null>(null);
 * 
 * <TypeAheadAsync
 *   isMulti={false}
 *   value={selected}
 *   loadOptions={async (input) => fetchUsers(input)}
 *   onChange={setSelected}
 * />
 */
export function TypeAheadAsync({
    loadOptions,
    defaultOptions,
    onChange,
    isMulti = false,
    styles: customStyles,
    emptyMessage = 'No results found',
    size,
    ...restProps
}: TypeAheadAsyncProps) {
    const chakraTheme = useTheme();

    // Apply Chakra theme styles with custom overrides
    const styles = getReactSelectStyles<boolean, SelectOption>(
        chakraTheme,
        customStyles as StylesConfig<SelectOption, boolean>
    );

    /**
     * Memoized custom components configuration.
     * Returns an object with the CustomNoOptionsMessage component.
     */
    const customComponents = useCallback(
        () => ({
            NoOptionsMessage: (props: NoticeProps<SelectOption, boolean, GroupBase<SelectOption>>) => (
                <CustomNoOptionsMessage {...props} message={emptyMessage} />
            ),
        }),
        [emptyMessage]
    );

    /**
     * Memoized change handler that processes selection changes.
     * Handles both clear actions and regular selections, converting
     * the value to the appropriate format based on single/multi mode.
     */
    const handleChange = useCallback(
        (newValue: OnChangeValue<SelectOption, boolean>, actionMeta: ActionMeta<SelectOption>) => {
            if (actionMeta.action === 'clear') {
                // Handle clear action based on isMulti
                if (isMulti) {
                    (onChange as MultiSelectHandler)([]);
                } else {
                    (onChange as SingleSelectHandler)(null);
                }
            } else {
                // Type-safe onChange invocation
                if (isMulti) {
                    (onChange as MultiSelectHandler)(newValue as SelectOption[]);
                } else {
                    (onChange as SingleSelectHandler)(newValue as SelectOption | null);
                }
            }
        },
        [onChange, isMulti]
    );

    return (
        <AsyncSelect
            cacheOptions
            isMulti={isMulti}
            defaultOptions={defaultOptions}
            loadOptions={loadOptions}
            components={customComponents()}
            menuPortalTarget={document.body}
            onChange={handleChange}
            styles={{
                container: (base) => ({
                    ...base,
                }),
                ...styles,
                valueContainer: (base) => ({
                    ...base,
                    maxHeight: getHeight(size),
                    overflowY: 'auto',
                }),
            }}
            {...restProps}
        />
    );
}

/**
 * Convenience wrapper for single-selection TypeAheadAsync.
 * Automatically sets isMulti to false, providing better type inference.
 * 
 * @param props - Component props excluding isMulti
 * 
 * @example
 * <TypeAheadAsyncSingle
 *   loadOptions={async (input) => fetchUsers(input)}
 *   onChange={(user) => console.log('Selected user:', user)}
 *   placeholder="Select a user..."
 * />
 */
export function TypeAheadAsyncSingle(
    props: Omit<SingleSelectProps, 'isMulti'>
) {
    return <TypeAheadAsync {...props} isMulti={false} />;
}

/**
 * Convenience wrapper for multi-selection TypeAheadAsync.
 * Automatically sets isMulti to true, providing better type inference.
 * 
 * @param props - Component props excluding isMulti
 * 
 * @example
 * <TypeAheadAsyncMulti
 *   loadOptions={async (input) => fetchUsers(input)}
 *   onChange={(users) => console.log('Selected users:', users)}
 *   placeholder="Select multiple users..."
 * />
 */
export function TypeAheadAsyncMulti(
    props: Omit<MultiSelectProps, 'isMulti'>
) {
    return <TypeAheadAsync {...props} isMulti={true} />;
}