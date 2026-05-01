
import { Box, FormControl, FormLabel, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { useDebounce } from '@statseeker/hooks';
import { type ChangeEvent } from 'react';
import { Tooltip, Flex, Input, InfoCircleIcon, SearchIcon } from '@statseeker/components';

/**
 * Props for the GlobalSearch component
 */
interface GlobalSearchProps {
    /**
     * Callback function triggered when the search input changes (after debounce)
     * @param event - The change event from the input element
     */
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    /**
     * Debounce delay in milliseconds
     * @default 500
     * @example
     * ```tsx
     * <GlobalSearch debounceDelay={300} onChange={handleChange} />
     * ```
     */
    debounceDelay?: number;
    /**
     * Default value for the search input
     * @example
     * ```tsx
     * <GlobalSearch defaultValue="device-123" onChange={handleChange} />
     * ```
     */
    defaultValue?: string;
    /**
     * Maximum length of the search input
     * @default 100
     */
    maxLength?: number;
    /**
     * Width of the search input using CSS units
     * @default '50ch'
     * @example
     * ```tsx
     * <GlobalSearch width="30ch" onChange={handleChange} />
     * <GlobalSearch width="400px" onChange={handleChange} />
     * ```
     */
    width?: string;
    /**
     * Whether the search input is disabled
     * @default false
     */
    disabled?: boolean;
    /**
     * Label text for the search input
     * @default 'Global search'
     * @example
     * ```tsx
     * <GlobalSearch label="Search devices" onChange={handleChange} />
     * ```
     */
    label?: string;
    /**
     * Tooltip text for the info icon
     * @default 'regular expression supported'
     */
    tooltipLabel?: string;
    /**
     * Whether to show the info tooltip
     * @default true
     */
    showTooltip?: boolean;
    /**
     * Placeholder text for the input
     * @example
     * ```tsx
     * <GlobalSearch placeholder="Type to search..." onChange={handleChange} />
     * ```
     */
    placeholder?: string;
    /**
     * Key prop to force re-render when needed. Useful when you want to reset the input
     * when another filter changes (e.g., changing the data type in a dropdown)
     * @example
     * ```tsx
     * <GlobalSearch resetKey={dataType} onChange={handleChange} />
     * ```
     */
    resetKey?: string | number;
}

/**
 * GlobalSearch Component
 * 
 * A reusable search input component with debouncing, tooltips, and customizable styling.
 * Designed for filtering and searching data in table headers and other list views.
 * 
 * @component
 * @example
 * Basic usage:
 * ```tsx
 * import { GlobalSearch } from './GlobalSearch';
 * 
 * function MyComponent() {
 *   const handleSearch = (event) => {
 *     console.log('Search value:', event.target.value);
 *   };
 * 
 *   return <GlobalSearch onChange={handleSearch} />;
 * }
 * ```
 * 
 * @example
 * With custom configuration:
 * ```tsx
 * <GlobalSearch
 *   onChange={handleSearch}
 *   defaultValue="initial search"
 *   width="40ch"
 *   label="Search Devices"
 *   placeholder="Enter device name..."
 *   debounceDelay={300}
 *   disabled={!isReady}
 * />
 * ```
 * 
 * @example
 * With reset key (clears input when key changes):
 * ```tsx
 * <GlobalSearch
 *   resetKey={selectedCategory}
 *   onChange={handleSearch}
 *   defaultValue={searchTerm}
 * />
 * ```
 */
export function GlobalSearch({
    onChange,
    defaultValue,
    maxLength = 100,
    width = '50ch',
    disabled = false,
    label = '',
    tooltipLabel = 'regular expression supported',
    showTooltip = true,
    placeholder,
    resetKey,
    debounceDelay = 500,
}: GlobalSearchProps) {
    const debouncedOnChange = useDebounce(onChange, debounceDelay);

    return (
        <FormControl width={width}>
            {label &&
                <FormLabel>
                    <Flex gap="xs" alignItems={'center'}>
                        {label}
                        {showTooltip && (
                            <Tooltip placement="right" label={tooltipLabel}>
                                <Box position="relative" bottom="2px">
                                    <InfoCircleIcon size='sm' />
                                </Box>
                            </Tooltip>
                        )}
                    </Flex>
                </FormLabel>
            }
            <InputGroup>
                <InputLeftElement>
                    <SearchIcon size='sm' />
                </InputLeftElement>
                <Input
                    key={resetKey}
                    onChange={debouncedOnChange}
                    defaultValue={defaultValue}
                    isDisabled={disabled}
                    placeholder={placeholder}
                    paddingLeft='2rem'
                    maxLength={maxLength}
                />
            </InputGroup>
        </FormControl>
    );
}