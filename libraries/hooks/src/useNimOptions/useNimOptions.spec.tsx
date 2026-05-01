import { type NimOption } from '@statseeker/api/internal_api/entities';
import * as api from '@statseeker/api/internal_api/entities';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { type ReactNode } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useNimOptions } from './useNimOptions';

// Mock the API module
vi.mock('@statseeker/api/internal_api/entities', () => ({
    getNimOptions: vi.fn(),
}));

const mockNimOptions: NimOption[] = [
    { id: 'feature1', value: 'on' },
    { id: 'feature2', value: 'off' },
    { id: 'feature3', value: 'custom-value' },
];

describe('useNimOptions', () => {
    let queryClient: QueryClient;

    const wrapper = ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={queryClient} > {children} </QueryClientProvider>
    );

    beforeEach(() => {
        queryClient = new QueryClient({
            defaultOptions: {
                queries: {
                    retry: false,
                },
            },
        });
        vi.clearAllMocks();
    });

    it('should fetch nim options successfully', async () => {
        vi.mocked(api.getNimOptions).mockResolvedValue({
            data: mockNimOptions,
        } as any);

        const { result } = renderHook(() => useNimOptions(), { wrapper });

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(api.getNimOptions).toHaveBeenCalledWith({
            request: {
                fields: ['id', 'value'],
            },
        });
    });

    describe('getAll', () => {
        it('should return all nim options', async () => {
            vi.mocked(api.getNimOptions).mockResolvedValue({
                data: mockNimOptions,
            } as any);

            const { result } = renderHook(() => useNimOptions(), { wrapper });

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });

            expect(result.current.getAll()).toEqual(mockNimOptions);
        });

        it('should return undefined when data is not loaded', () => {
            vi.mocked(api.getNimOptions).mockImplementation(
                () => new Promise(() => { })
            );

            const { result } = renderHook(() => useNimOptions(), { wrapper });

            expect(result.current.getAll()).toBeUndefined();
        });
    });

    describe('getValueByKey', () => {
        beforeEach(async () => {
            vi.mocked(api.getNimOptions).mockResolvedValue({
                data: mockNimOptions,
            } as any);
        });

        it('should return true for "on" value', async () => {
            const { result } = renderHook(() => useNimOptions(), { wrapper });

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });

            expect(result.current.getValueByKey('feature1')).toBe(true);
        });

        it('should return false for "off" value', async () => {
            const { result } = renderHook(() => useNimOptions(), { wrapper });

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });

            expect(result.current.getValueByKey('feature2')).toBe(false);
        });

        it('should return true for custom values (not "off")', async () => {
            const { result } = renderHook(() => useNimOptions(), { wrapper });

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });

            expect(result.current.getValueByKey('feature3')).toBe(true);
        });

        it('should return undefined for non-existent key', async () => {
            const { result } = renderHook(() => useNimOptions(), { wrapper });

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });

            expect(result.current.getValueByKey('non-existent')).toBeUndefined();
        });

        it('should return undefined when data is not loaded', () => {
            vi.mocked(api.getNimOptions).mockImplementation(
                () => new Promise(() => { })
            );

            const { result } = renderHook(() => useNimOptions(), { wrapper });

            expect(result.current.getValueByKey('feature1')).toBeUndefined();
        });
    });

    describe('getRawValueByKey', () => {
        it('should return raw value for existing key', () => {
            const { result } = renderHook(() => useNimOptions(), { wrapper });

            const rawValue = result.current.getRawValueByKey(mockNimOptions, 'feature1');
            expect(rawValue).toBe('on');
        });

        it('should return raw value "off" without conversion', () => {
            const { result } = renderHook(() => useNimOptions(), { wrapper });

            const rawValue = result.current.getRawValueByKey(mockNimOptions, 'feature2');
            expect(rawValue).toBe('off');
        });

        it('should return custom value as-is', () => {
            const { result } = renderHook(() => useNimOptions(), { wrapper });

            const rawValue = result.current.getRawValueByKey(mockNimOptions, 'feature3');
            expect(rawValue).toBe('custom-value');
        });

        it('should return undefined for non-existent key', () => {
            const { result } = renderHook(() => useNimOptions(), { wrapper });

            const rawValue = result.current.getRawValueByKey(mockNimOptions, 'non-existent');
            expect(rawValue).toBeUndefined();
        });

        it('should return undefined when data is undefined', () => {
            const { result } = renderHook(() => useNimOptions(), { wrapper });

            const rawValue = result.current.getRawValueByKey(undefined, 'feature1');
            expect(rawValue).toBeUndefined();
        });

        it('should return undefined when data is empty array', () => {
            const { result } = renderHook(() => useNimOptions(), { wrapper });

            const rawValue = result.current.getRawValueByKey([], 'feature1');
            expect(rawValue).toBeUndefined();
        });
    });

    describe('isSuccess', () => {
        it('should be false initially', () => {
            vi.mocked(api.getNimOptions).mockImplementation(
                () => new Promise(() => { })
            );

            const { result } = renderHook(() => useNimOptions(), { wrapper });

            expect(result.current.isSuccess).toBe(false);
        });

        it('should be true after successful fetch', async () => {
            vi.mocked(api.getNimOptions).mockResolvedValue({
                data: mockNimOptions,
            } as any);

            const { result } = renderHook(() => useNimOptions(), { wrapper });

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });
        });

        it('should remain false after failed fetch', async () => {
            vi.mocked(api.getNimOptions).mockRejectedValue(new Error('API Error'));

            const { result } = renderHook(() => useNimOptions(), { wrapper });

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(false);
            });
        });
    });

    describe('edge cases', () => {
        it('should handle empty data array', async () => {
            vi.mocked(api.getNimOptions).mockResolvedValue({
                data: [],
            } as any);

            const { result } = renderHook(() => useNimOptions(), { wrapper });

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });

            expect(result.current.getAll()).toEqual([]);
            expect(result.current.getValueByKey('any-key')).toBeUndefined();
        });

        it('should handle multiple options with same id (takes first)', async () => {
            const duplicateOptions: NimOption[] = [
                { id: 'duplicate', value: 'first' },
                { id: 'duplicate', value: 'second' },
            ];

            vi.mocked(api.getNimOptions).mockResolvedValue({
                data: duplicateOptions,
            } as any);

            const { result } = renderHook(() => useNimOptions(), { wrapper });

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });

            expect(result.current.getRawValueByKey(duplicateOptions, 'duplicate')).toBe('first');
        });
    });
});