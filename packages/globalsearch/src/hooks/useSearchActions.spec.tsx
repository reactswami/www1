/**
 * @vitest-environment jsdom
 */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, act, waitFor } from '@testing-library/react';
import { type ReactNode } from 'react';
import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';
import { SearchProvider, useSearchContext } from '../components/SearchContext/SearchContext';
import useSearchActions from '../hooks/useSearchActions';
import * as libQueries from '../lib';
import { type SearchDetails } from '../types/type';
import { openInNewWindow, orderCategories, ORDERED_CATEGORIES } from '../utils';


const utils = await import('../utils');
// Mock dependencies
vi.mock('../utils', async (importOriginal) => {
    const actual = await importOriginal<typeof utils>();
    return {
        ...actual,
        openInNewWindow: vi.fn(),
        orderCategories: vi.fn((categories: string[]) => categories),
        ORDERED_CATEGORIES: ['Device', 'Interface', 'Group', 'Dashboard', 'Report', 'Administration'],
        STORAGE_KEYS: {
            SEARCH_RESULTS: 'testUserSearchResults',
            SEARCH_TERMS: 'testUserSearchKeys',
        },
    };
});

vi.mock('../lib', () => ({
    describeCredentialsQuery: vi.fn(),
    getSearchResults: vi.fn(),
}));

let mockMergeFunction: ((existing: any[], added: any[]) => { result: any[]; hasChanged: boolean }) | undefined;
let mockSetValue: Mock;
let mockClear: Mock;
vi.mock('../hooks/useLocalStorage', () => ({
    default: vi.fn((key: string, initialValue: any[], mergeFunc: any) => {
        mockMergeFunction = mergeFunc;
        return [
            initialValue,
            mockSetValue,
            {
                clear: mockClear,
                refresh: vi.fn(),
            },
        ];
    }),
}));


// Mock window.open and window.location
const mockWindowOpen = vi.fn(() => ({
    addEventListener: vi.fn(),
    focus: vi.fn(),
}));

Object.defineProperty(window, 'open', {
    value: mockWindowOpen,
    writable: true,
});

Object.defineProperty(window, 'location', {
    value: { href: '' },
    writable: true,
});

// Mock global variables
Object.defineProperty(window, 'cur_user', {
    value: 'testUser',
    writable: true,
});

// Test data
const mockSearchDetails: SearchDetails[] = [
    {
        name: 'Test Device 1',
        description: 'Test device description',
        actions: [
            {
                action: '/device/1',
                title: 'View Device',
                target: '_self',
            },
            {
                action: '/device/1/edit',
                title: 'Edit Device',
                target: '_blank',
                width: 800,
                height: 600,
            },
        ],
        category: 'device',
        visible: true,
        status: 'online',
    },
    {
        name: 'Test Interface 1',
        description: 'Test interface description',
        actions: [
            {
                action: '/interface/1',
                title: 'View Interface',
                target: '_blank',
            },
        ],
        category: 'interface',
        visible: true,
        status: 'up',
    },
];

const mockSearchFilters = () => ORDERED_CATEGORIES.map(category => ({ filter: category, label: category, selected: false }));

const mockDescribeResponse = {
    describe: {
        options: {
            categories: {
                values: {
                    Device: 'Device',
                    Interface: 'Interface',
                    Group: 'Group',
                    Dashboard: 'Dashboard',
                    Report: 'Report',
                    Administration: 'Administration',
                },
            },
        },
    },
};

// Test wrapper component
const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });

    return ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            <SearchProvider>{children}</SearchProvider>
        </QueryClientProvider>
    );
};

describe('useSearchActions', () => {
    let mockDispatch: Mock;
    let mockUseQuery: Mock;

    beforeEach(() => {

        vi.clearAllMocks();
        mockDispatch = vi.fn();
        mockSetValue = vi.fn();
        mockClear = vi.fn();
        mockMergeFunction = undefined;

        vi.clearAllMocks();
        mockDispatch = vi.fn();
        mockUseQuery = vi.fn();

        // Mock useQuery responses
        mockUseQuery
            .mockReturnValueOnce({
                data: mockDescribeResponse,
                isLoading: false,
                isError: false,
            })
            .mockReturnValueOnce({
                isError: false,
            });

        // Mock the query functions
        (libQueries.describeCredentialsQuery as Mock).mockReturnValue({
            queryKey: ['credentials', 'describe'],
            queryFn: () => Promise.resolve(mockDescribeResponse),
        });

        (libQueries.getSearchResults as Mock).mockReturnValue({
            queryKey: ['search', 'results'],
            queryFn: () => Promise.resolve({ data: mockSearchDetails }),
        });

        mockWindowOpen.mockClear();
    });

    describe('initialization and categories', () => {
        it('should use ordered categories when describe query fails', async () => {
            mockUseQuery
                .mockReturnValueOnce({
                    data: null,
                    isLoading: false,
                    isError: true,
                });


            const wrapper = createWrapper();

            renderHook(
                () => {
                    const context = useSearchContext();
                    context.dispatch = mockDispatch;
                    context.state.searchFilters = [];

                    const actions = useSearchActions();
                    return { actions, context };
                },
                { wrapper }
            );

            await waitFor(() => {
                expect(mockDispatch).toHaveBeenCalledWith({
                    type: 'UPDATE_CATEGORIES',
                    payload: ORDERED_CATEGORIES,
                });
            });
        });

        it('should set filters only once', async () => {
            mockUseQuery
                .mockReturnValueOnce({
                    data: mockDescribeResponse,
                    isLoading: false,
                    isError: false,
                })
                .mockReturnValueOnce({
                    isError: true,
                });

            const wrapper = createWrapper();

            renderHook(
                () => {
                    const context = useSearchContext();
                    context.dispatch = mockDispatch;
                    context.state.searchFilters = mockSearchFilters();

                    const actions = useSearchActions();
                    return { actions, context };
                },
                { wrapper }
            );

            await waitFor(() => {
                expect(mockDispatch).toBeCalledTimes(0);
            });
        });
    });

    describe('runPrimaryAction', () => {
        beforeEach(() => {
            window.location.href = '';
        });

        it('should navigate to first action of selected result', async () => {
            const wrapper = createWrapper();

            const { result } = renderHook(
                () => {
                    const context = useSearchContext();
                    context.dispatch = mockDispatch;
                    context.state.searchResults = mockSearchDetails;
                    context.state.selectedResultIndex = 0;
                    context.state.searchTerm = 'test search';

                    return useSearchActions();
                },
                { wrapper }
            );

            await act(async () => {
                result.current.runPrimaryAction({});
            });

            expect(window.location.href).toBe('/device/1');
            expect(mockDispatch).toHaveBeenCalledWith({
                type: 'TRIGGER_CLOSE_ACTION',
                payload: 0,
            });
        });

        it('should open in new window when action has width and height', async () => {
            const mockSearchDetailsWithDimensions: SearchDetails[] = [
                {
                    ...mockSearchDetails[0],
                    actions: [
                        {
                            action: '/device/1/popup',
                            title: 'View Device Popup',
                            target: '_self',
                            width: 800,
                            height: 600,
                        },
                    ],
                },
            ];

            const wrapper = createWrapper();

            const { result } = renderHook(
                () => {
                    const context = useSearchContext();
                    context.dispatch = mockDispatch;
                    context.state.searchResults = mockSearchDetailsWithDimensions;
                    context.state.selectedResultIndex = 0;
                    context.state.searchTerm = 'test search';

                    return useSearchActions();
                },
                { wrapper }
            );

            await act(async () => {
                result.current.runPrimaryAction({});
            });

            expect(openInNewWindow).toHaveBeenCalledWith(mockSearchDetailsWithDimensions[0].actions[0]);
        });

        it('should open in new window for _blank target', async () => {
            const wrapper = createWrapper();

            const { result } = renderHook(
                () => {
                    const context = useSearchContext();
                    context.dispatch = mockDispatch;
                    context.state.searchResults = mockSearchDetails;
                    context.state.selectedResultIndex = 1; // Interface with _blank target
                    context.state.searchTerm = 'test search';

                    return useSearchActions();
                },
                { wrapper }
            );

            await act(async () => {
                result.current.runPrimaryAction({});
            });

            expect(mockWindowOpen).toHaveBeenCalledWith('/interface/1', '_blank');
        });

        it('open action when interacted using mouse click', async () => {
            const wrapper = createWrapper();

            const { result } = renderHook(
                () => {
                    const context = useSearchContext();
                    context.dispatch = mockDispatch;
                    context.state.searchResults = mockSearchDetails;
                    context.state.selectedResultIndex = 0;
                    context.state.searchTerm = 'test search';

                    return useSearchActions();
                },
                { wrapper }
            );

            await act(async () => {
                result.current.runPrimaryAction({ resultIndex: 1 });
            });

            expect(mockWindowOpen).toHaveBeenCalledWith('/interface/1', '_blank');
            expect(mockDispatch).toHaveBeenCalledWith({
                type: 'TRIGGER_CLOSE_ACTION',
                payload: 1,
            });
        });

        it('should handle empty results', async () => {
            const wrapper = createWrapper();

            const { result } = renderHook(
                () => {
                    const context = useSearchContext();
                    context.dispatch = mockDispatch;
                    context.state.searchResults = [];
                    context.state.selectedResultIndex = 0;
                    context.state.searchTerm = undefined;

                    return useSearchActions();
                },
                { wrapper }
            );

            await act(async () => {
                result.current.runPrimaryAction({});
            });

            expect(mockDispatch).not.toHaveBeenCalled();
            expect(window.location.href).toBe('');
        });

        it('should use cache when no search term', async () => {
            const wrapper = createWrapper();

            const { result } = renderHook(
                () => {
                    const context = useSearchContext();
                    context.dispatch = mockDispatch;
                    context.state.searchResults = [];
                    context.state.searchFrequentViewed = mockSearchDetails;
                    context.state.selectedResultIndex = 0;
                    context.state.searchTerm = '';

                    return useSearchActions();
                },
                { wrapper }
            );

            await act(async () => {
                result.current.runPrimaryAction({});
            });

            expect(window.location.href).toBe('/device/1');
        });

        it('should validate schema before processing', async () => {
            const invalidSearchDetails = [
                {
                    namez: 'Test Device 1',
                    descriptionz: 'Test device description',
                    actionz: [
                        {
                            action: '/device/1',
                            title: 'View Device',
                            target: '_self',
                        },
                        {
                            action: '/device/1/edit',
                            title: 'Edit Device',
                            target: '_blank',
                            width: 800,
                            height: 600,
                        },
                    ],
                    category: 'device',
                    visible: true,
                    status: 'online',
                },
            ];


            const wrapper = createWrapper();

            const { result } = renderHook(
                () => {
                    const context = useSearchContext();
                    context.dispatch = mockDispatch;
                    context.state.searchResults = [];
                    context.state.searchFrequentViewed = invalidSearchDetails;
                    context.state.selectedResultIndex = 0;
                    context.state.searchTerm = '';

                    return useSearchActions();
                },
                { wrapper }
            );

            await act(async () => {
                result.current.runPrimaryAction({});
            });

            expect(mockDispatch).not.toBeCalledWith({
                type: 'TRIGGER_CLOSE_ACTION',
                payload: expect.any(Number),
            });
        });

    });

    describe('runSecondaryAction', () => {

        it('should execute secondary action based on hover action index', async () => {
            const wrapper = createWrapper();

            const { result } = renderHook(
                () => {
                    const context = useSearchContext();
                    context.dispatch = mockDispatch;
                    context.state.searchResults = mockSearchDetails;
                    context.state.selectedResultIndex = 0;
                    context.state.hoverActionIndex = 1;
                    context.state.searchTerm = 'test search';
                    return useSearchActions();
                },
                { wrapper }
            );

            await act(async () => {
                result.current.runSecondaryAction({});
            });

            expect(openInNewWindow).toHaveBeenCalledWith(mockSearchDetails[0].actions[1]);
            expect(mockDispatch).toHaveBeenCalledWith({
                type: 'TRIGGER_CLOSE_ACTION',
                payload: 0,
            });
        });
        it('should execute when interacted with mouse', async () => {
            const wrapper = createWrapper();

            const { result } = renderHook(
                () => {
                    const context = useSearchContext();
                    context.dispatch = mockDispatch;
                    context.state.searchResults = mockSearchDetails;
                    context.state.selectedResultIndex = 0;
                    context.state.hoverActionIndex = 0;
                    context.state.searchTerm = 'test search';

                    return useSearchActions();
                },
                { wrapper }
            );

            await act(async () => {
                result.current.runSecondaryAction({ resultIndex: 1, actionIndex: 0 });
            });

            expect(mockWindowOpen).toHaveBeenCalledWith('/interface/1', '_blank');
            expect(mockDispatch).toHaveBeenCalledWith({
                type: 'TRIGGER_CLOSE_ACTION',
                payload: 1,
            });
        });

        it('should execute on cache when interacted with mouse', async () => {
            const wrapper = createWrapper();

            const { result } = renderHook(
                () => {
                    const context = useSearchContext();
                    context.dispatch = mockDispatch;
                    context.state.searchResults = [];
                    context.state.searchFrequentViewed = mockSearchDetails;
                    context.state.selectedResultIndex = 0;
                    context.state.hoverActionIndex = 0;
                    context.state.searchTerm = '';

                    return useSearchActions();
                },
                { wrapper }
            );

            await act(async () => {
                result.current.runSecondaryAction({ resultIndex: 1, actionIndex: 0 });
            });

            expect(mockWindowOpen).toHaveBeenCalledWith('/interface/1', '_blank');
            expect(mockDispatch).toHaveBeenCalledWith({
                type: 'TRIGGER_CLOSE_ACTION',
                payload: 1,
            });
        });

        it('should open in newwindow for actions with dimensions', async () => {
            const wrapper = createWrapper();

            const { result } = renderHook(
                () => {
                    const context = useSearchContext();
                    context.dispatch = mockDispatch;
                    context.state.searchResults = mockSearchDetails;
                    context.state.selectedResultIndex = 0;
                    context.state.hoverActionIndex = 1; // Action with width/height
                    context.state.searchTerm = 'test search';

                    return useSearchActions();
                },
                { wrapper }
            );

            await act(async () => {
                result.current.runSecondaryAction({});
            });

            expect(openInNewWindow).toHaveBeenCalledWith(mockSearchDetails[0].actions[1]);
        });

        it('should handle action index out of bounds', async () => {
            const wrapper = createWrapper();

            const { result } = renderHook(
                () => {
                    const context = useSearchContext();
                    context.dispatch = mockDispatch;
                    context.state.searchResults = mockSearchDetails;
                    context.state.selectedResultIndex = 0;
                    context.state.hoverActionIndex = 2; // Out of bounds
                    context.state.searchTerm = 'test search';

                    return useSearchActions();
                },
                { wrapper }
            );

            await act(async () => {
                result.current.runSecondaryAction({});
            });

            // Should not execute any action
            expect(openInNewWindow).not.toHaveBeenCalled();
            expect(mockWindowOpen).not.toHaveBeenCalled();
        });
    });

    describe('selectFilter', () => {
        it('should select "All" filter when index is 0', async () => {
            const wrapper = createWrapper();

            const { result } = renderHook(
                () => {
                    const context = useSearchContext();
                    context.dispatch = mockDispatch;
                    context.state.searchFilters = mockSearchFilters();
                    context.state.hoverFilterIndex = 0;

                    return useSearchActions();
                },
                { wrapper }
            );

            act(() => {
                result.current.selectFilter();
            });

            expect(mockDispatch).toHaveBeenCalledWith({
                type: 'FILTER_CLICK',
                payload: { filter: 'All' },
            });
        });

        it('should select specific filter when hovered by the keyboard', async () => {
            const wrapper = createWrapper();

            const { result } = renderHook(
                () => {
                    const context = useSearchContext();
                    context.dispatch = mockDispatch;
                    context.state.searchFilters = mockSearchFilters();
                    context.state.hoverFilterIndex = 1;

                    return useSearchActions();
                },
                { wrapper }
            );

            act(() => {
                result.current.selectFilter();
            });

            expect(mockDispatch).toHaveBeenCalledWith({
                type: 'FILTER_CLICK',
                payload: { filter: 'Device' },
            });
        });

        it('should select filter when clicked', async () => {
            const wrapper = createWrapper();

            const { result } = renderHook(
                () => {
                    const context = useSearchContext();
                    context.dispatch = mockDispatch;
                    context.state.searchFilters = mockSearchFilters();
                    context.state.hoverFilterIndex = 0;

                    return useSearchActions();
                },
                { wrapper }
            );

            act(() => {
                result.current.selectFilter(2);
            });

            expect(mockDispatch).toHaveBeenCalledWith({
                type: 'FILTER_CLICK',
                payload: { filter: 'Interface' },
            });
        });
    });

    describe('setSearch', () => {
        it('should trigger search action when term is different', async () => {
            const wrapper = createWrapper();

            const { result } = renderHook(
                () => {
                    const context = useSearchContext();
                    context.dispatch = mockDispatch;
                    context.state.searchTerm = 'old search';

                    return useSearchActions();
                },
                { wrapper }
            );

            act(() => {
                result.current.setSearch('new search');
            });

            expect(mockDispatch).toHaveBeenCalledWith({
                type: 'SET_SEARCH',
                payload: 'new search',
            });
        });

        it('should not trigger search when term is the same (trimmed)', async () => {
            const wrapper = createWrapper();

            const { result } = renderHook(
                () => {
                    const context = useSearchContext();
                    context.dispatch = mockDispatch;
                    context.state.searchTerm = 'same search';

                    return useSearchActions();
                },
                { wrapper }
            );

            act(() => {
                result.current.setSearch('  same search  ');
            });

            expect(mockDispatch).not.toHaveBeenCalled();
        });
    });

    describe('clearRecents', () => {
        it('should clear both localStorage and dispatch clear recent action', async () => {
            const wrapper = createWrapper();

            const { result } = renderHook(
                () => {
                    const context = useSearchContext();
                    context.dispatch = mockDispatch;

                    return useSearchActions();
                },
                { wrapper }
            );

            act(() => {
                result.current.clearRecents();
            });

            // Verify that both clear functions were called

            // Verify that dispatch was called with the correct action
            expect(mockDispatch).toHaveBeenCalledWith({
                type: 'CLEAR_RECENT',
            });
        });
    });

    describe('resetSearch', () => {
        it('should dispatch reset state action', async () => {
            const wrapper = createWrapper();

            const { result } = renderHook(
                () => {
                    const context = useSearchContext();
                    context.dispatch = mockDispatch;

                    return useSearchActions();
                },
                { wrapper }
            );

            act(() => {
                result.current.resetSearch();
            });

            expect(mockDispatch).toHaveBeenCalledWith({
                type: 'RESET_STATE',
            });
        });
    });

    describe('localStorage integration', () => {

        it('should store frequent results and search terms when executing actions with search term', async () => {
            const mockSetFrequentResult = vi.fn();
            const mockSetRecentSearch = vi.fn();

            let capturedMergeFunction: any = null;

            const useLocalStorageMock = await import('../hooks/useLocalStorage');
            vi.mocked(useLocalStorageMock.default).mockImplementation((key: string, initialValue: any, mergeFunction: any, options: any) => {
                // Capture the merge function for search results storage
                if (typeof key === 'string' && key.includes('SEARCH_RESULTS')) {
                    return [
                        [],
                        mockSetFrequentResult,
                        { clear: vi.fn(), refresh: vi.fn() },
                    ];
                } else {

                    capturedMergeFunction = mergeFunction;

                    return [
                        [],
                        mockSetRecentSearch,
                        { clear: vi.fn(), refresh: vi.fn() },
                    ];
                }
            });

            const wrapper = createWrapper();

            const { result } = renderHook(
                () => {
                    const context = useSearchContext();
                    context.dispatch = mockDispatch;
                    context.state.searchResults = mockSearchDetails;
                    context.state.selectedResultIndex = 0;
                    context.state.searchTerm = 'test search';

                    return useSearchActions();
                },
                { wrapper }
            );

            await act(async () => {
                result.current.runPrimaryAction({});
            });

            expect(capturedMergeFunction).toBeDefined();
            expect(typeof capturedMergeFunction).toBe('function');
            expect(mockSetRecentSearch).toHaveBeenCalledWith([mockSearchDetails[0]]);
        });

        it('should not store when no search term is present', async () => {
            const mockSetFrequentResult = vi.fn();
            const mockSetRecentSearch = vi.fn();

            const useLocalStorageMock = await import('../hooks/useLocalStorage');
            vi.mocked(useLocalStorageMock.default)
                .mockReturnValueOnce([[], mockSetFrequentResult, { clear: vi.fn(), refresh: vi.fn() }])
                .mockReturnValueOnce([[], mockSetRecentSearch, { clear: vi.fn(), refresh: vi.fn() }]);

            const wrapper = createWrapper();

            const { result } = renderHook(
                () => {
                    const context = useSearchContext();
                    context.dispatch = mockDispatch;
                    context.state.searchResults = mockSearchDetails;
                    context.state.selectedResultIndex = 0;
                    context.state.searchTerm = '';

                    return useSearchActions();
                },
                { wrapper }
            );

            await act(async () => {
                result.current.runPrimaryAction({});
            });

            expect(mockSetFrequentResult).not.toHaveBeenCalled();
            expect(mockSetRecentSearch).not.toHaveBeenCalled();
        });
    });
});