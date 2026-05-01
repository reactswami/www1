import { useQuery, useQueryClient, type UseQueryOptions } from "@tanstack/react-query";
import { useCallback, useMemo, useRef } from "react";
import { type SelectOption } from "../type";

/**
 * A custom hook that integrates TanStack Query with React Select's async functionality.
 * Provides automatic caching, type-safe data transformation, debounced search, and optimized data fetching.
 * 
 * Features:
 * - Automatic query caching via TanStack Query
 * - Debounced search input (default 300ms)
 * - Batches multiple rapid input changes into a single query
 * - Type-safe data transformation
 * - Automatic loading of default options
 * - Compatible with React Select's async loadOptions prop
 * 
 * @template T - The type of items returned by the query function
 * 
 * @param {function(T): {value: string|number, label: string}} mapToOption - 
 *        Transform function to map API data to SelectOption format.
 *        Converts your data type T into {value, label} format.
 *        Called for each item in the query results.
 * 
 * @param {function(string?, Record<string, any>?): UseQueryOptions<T[]>} queryOptions - 
 *        Function that returns TanStack Query options for fetching data.
 *        Receives the search input value and additional query parameters.
 *        Should return a configuration object with queryKey and queryFn.
 * 
 * @param {Record<string, any>} [queryParams] - 
 *        Optional additional parameters to pass to queryOptions.
 *        Useful for filtering, pagination, or other API parameters.
 *        These params are passed on both initial load and search queries.
 * 
 * @param {number} [debounceMs=300] - 
 *        Debounce delay in milliseconds for search input.
 *        Helps reduce API calls during rapid typing.
 *        Set to 0 to disable debouncing.
 *        @default 300
 * 
 * @returns {{
 *   loadOptions: function(string): Promise<Array<{value: string|number, label: string}>>,
 *   defaultOptions: Array<{value: string|number, label: string}> | undefined,
 *   isLoading: boolean
 * }} Object containing:
 *   - loadOptions: Function compatible with React Select's async loadOptions prop
 *   - defaultOptions: Pre-loaded options mapped to SelectOption format, shown when input is empty
 *   - isLoading: Loading state for the initial default options query
 * 
 * @example
 * // Basic usage with users
 * const { loadOptions, defaultOptions, isLoading } = useAsyncSelect(
 *   (user) => ({ value: user.id, label: user.name }),
 *   (search) => ({
 *     queryKey: ['users', search],
 *     queryFn: () => fetchUsers(search)
 *   })
 * );
 * 
 * @example
 * // With additional query parameters
 * const { loadOptions, defaultOptions } = useAsyncSelect(
 *   (product) => ({ value: product.id, label: product.name }),
 *   (search, params) => ({
 *     queryKey: ['products', search, params],
 *     queryFn: () => fetchProducts({ search, ...params })
 *   }),
 *   { categoryId: 5, inStock: true }
 * );
 * 
 * @example
 * // With custom debounce delay
 * const { loadOptions } = useAsyncSelect(
 *   (item) => ({ value: item.id, label: item.title }),
 *   (search) => ({
 *     queryKey: ['items', search],
 *     queryFn: () => searchItems(search)
 *   }),
 *   undefined,
 *   500 // 500ms debounce
 * );
 * 
 * @example
 * // Usage with React Select
 * <AsyncSelect
 *   loadOptions={loadOptions}
 *   defaultOptions={defaultOptions}
 *   isLoading={isLoading}
 *   placeholder="Search..."
 * />
 */
export function useAsyncSelect<T, Filter>(
    mapToOption: (item: T) => SelectOption & T,
    queryOptions: (entitySearch?: string, additionalParams?: Filter) => UseQueryOptions<T[]>,
    queryParams?: Filter,
    debounceMs: number = 300
) {
    type SelectEntityType = T & SelectOption;

    // Load default options on mount using the query without search input
    const { data: defaultOptions, isLoading } = useQuery(queryOptions(undefined, queryParams));

    const queryClient = useQueryClient();
    const mappedDefaultOptions = useMemo(() => {
        return defaultOptions?.map(mapToOption);
    }, [defaultOptions, mapToOption]);

    /**
     * Reference to store the debounce timeout.
     * Allows clearing previous timeout when new input arrives.
     */
    const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    /**
     * Array of promise resolvers waiting for the debounced query to complete.
     * All pending promises are resolved/rejected together when the query finishes.
     */
    const pendingResolvers = useRef<Array<{
        resolve: (value: any) => void;
        reject: (reason?: any) => void;
    }>>([]);

    /**
     * Load options function compatible with React Select's async API.
     * Implements debouncing to batch rapid input changes into a single query.
     * 
     * @param {string} inputValue - The search input value from React Select
     * @returns {Promise<Array<SelectEntityType>>} Promise resolving to array of select options
     */
    const loadOptions = useCallback(
        (inputValue: string): Promise<Array<SelectEntityType>> => {
            // If no input, return default options immediately (no debounce)
            if (!inputValue) {
                return Promise.resolve(defaultOptions?.map(mapToOption) ?? []);
            }

            // Return a promise that will be resolved after debounce
            return new Promise((resolve, reject) => {
                // Clear existing timeout
                if (debounceTimeout.current) {
                    clearTimeout(debounceTimeout.current);
                }

                // Add this resolver to pending queue
                pendingResolvers.current.push({ resolve, reject });

                // Set new timeout
                debounceTimeout.current = setTimeout(async () => {
                    try {
                        // Fetch data with the search input and query params
                        const queryOption = queryOptions(inputValue, queryParams);
                        const filter = queryOption?.select;
                        let data = await queryClient.fetchQuery(queryOption);
                        if (filter) {
                            data = filter(data);
                        }
                        const mappedData = data?.map(mapToOption) ?? [];
                        // Resolve all pending promises with the same data
                        pendingResolvers.current.forEach((resolver) => {
                            resolver.resolve(mappedData);
                        });
                    } catch (error) {
                        // Reject all pending promises with the error
                        pendingResolvers.current.forEach((resolver) => {
                            resolver.reject(error);
                        });
                    } finally {
                        // Clear pending resolvers
                        pendingResolvers.current = [];
                        debounceTimeout.current = null;
                    }
                }, debounceMs);
            });
        },
        [defaultOptions, mapToOption, queryClient, queryOptions, debounceMs, queryParams]
    );

    return {
        loadOptions,
        defaultOptions: mappedDefaultOptions,
        isLoading
    };
}