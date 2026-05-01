// ============================================================================
// useAssignPoller.test.ts - Unit tests for useAssignPoller hook
// ============================================================================
import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAssignPoller } from './useAssignPoller';
import * as apiOptions from '@statseeker/utils/apiOptions';
import { type ReactNode } from 'react';

// ============================================================================
// Mock Dependencies
// ============================================================================

// Mock toast
const mockToast = vi.fn();
vi.mock('@statseeker/hooks', () => ({
    useToast: () => mockToast,
}));

// Mock router
const mockNavigate = vi.fn();
const mockSearch = {
    selectedIds: [1, 2, 3],
    text_filter: '',
    sort: 'name',
    dir: 'asc' as const,
    offset: 0,
    limit: 50,
};

vi.mock('@tanstack/react-router', () => ({
    useNavigate: () => mockNavigate,
    useSearch: () => mockSearch,
}));

// Mock API functions
vi.mock('~/api/device', () => ({
    updateDevices: vi.fn(),
}));

vi.mock('~/api/oa_component_service', () => ({
    updatePingPoller: vi.fn(),
}));

// Mock query client
vi.mock('~/lib', () => ({
    queryClient: {
        invalidateQueries: vi.fn(),
    },
}));

// ============================================================================
// Test Data
// ============================================================================

const mockPollers = [
    {
        id: 1,
        name: 'statseekerserver',
        deviceid: 1,
        type: 'snmp',
    },
    {
        id: 2,
        name: 'poller1',
        deviceid: 2,
        type: 'snmp',
    },
    {
        id: 3,
        name: 'poller2',
        deviceid: 3,
        type: 'ping',
    },
];

const mockDevice = {
    id: 1,
    name: 'Test Device',
    snmp_poller: 'poller1',
    default_poller: 'poller2',
    pollers: 'poller2,poller3',
};

// ============================================================================
// Test Utilities
// ============================================================================

function createWrapper() {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
            mutations: {
                retry: false,
            },
        },
    });

    return ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={queryClient} >
            {children}
        </QueryClientProvider>
    );
}

// ============================================================================
// Tests
// ============================================================================

describe('useAssignPoller', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        // Mock getAllPollers to return mock data
        vi.spyOn(apiOptions, 'getAllPollers').mockReturnValue({
            queryKey: ['pollers'],
            queryFn: async () => mockPollers,
        });

        // Mock filter function
        vi.spyOn(apiOptions, 'filterStatseekerServer').mockImplementation(
            (poller) => poller.name === 'statseekerserver'
        );

        // Mock comparison functions
        vi.spyOn(apiOptions, 'arePollerValuesEqual').mockImplementation(
            (a, b) => {
                if (a === null && b === null) return true;
                if (a === null || b === null) return false;
                return a.id === b.id;
            }
        );

        vi.spyOn(apiOptions, 'arePollerArraysEqual').mockImplementation(
            (a, b) => {
                if (a === null && b === null) return true;
                if (a === null || b === null) return false;
                if (a.length !== b.length) return false;
                const aIds = a.map(p => p.id).sort();
                const bIds = b.map(p => p.id).sort();
                return aIds.every((id, index) => id === bIds[index]);
            }
        );
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('Initialization', () => {
        it('should initialize with correct default values', () => {
            const { result } = renderHook(
                () => useAssignPoller({
                    isOpen: true,
                    onClose: vi.fn(),
                    selectedCount: 2,
                }),
                { wrapper: createWrapper() }
            );

            expect(result.current.isAdvanced).toBe(false);
        });

    });
});