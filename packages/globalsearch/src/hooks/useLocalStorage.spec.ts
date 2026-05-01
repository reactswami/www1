import { renderHook, act } from '@testing-library/react';
import { JSDOM } from 'jsdom';
import { describe, it, expect, beforeEach, beforeAll, afterAll, vi } from 'vitest';
import useLocalStorage from './useLocalStorage';

// Setup JSDOM environment
export const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
    url: 'http://localhost:3000',
});

globalThis.window = dom.window as any;
globalThis.document = dom.window.document;
globalThis.navigator = dom.window.navigator;


// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};

    return {
        getItem: vi.fn((key: string) => store[key] || null),
        setItem: vi.fn((key: string, value: string) => {
            store[key] = value;
        }),
        removeItem: vi.fn((key: string) => {
            delete store[key];
        }),
        clear: vi.fn(() => {
            store = {};
        }),
        key: vi.fn((index: number) => Object.keys(store)[index] || null),
        get length() {
            return Object.keys(store).length;
        },
    };
})();

Object.defineProperty(globalThis.window, 'localStorage', {
    value: localStorageMock,
    writable: true,
});

// Also define on globalThis for direct access
Object.defineProperty(globalThis, 'localStorage', {
    value: localStorageMock,
    writable: true,
});

// Mock console.warn to avoid noise in tests
const originalWarn = console.warn;
beforeAll(() => {
    console.warn = vi.fn();
});

afterAll(() => {
    console.warn = originalWarn;
});

describe('useLocalStorage', () => {
    beforeEach(() => {
        localStorageMock.clear();
        vi.clearAllMocks();
    });

    describe('Basic functionality', () => {
        it('should return initial value when localStorage is empty', () => {
            const initialValue = [{ id: 1, name: 'test' }];
            const { result } = renderHook(() =>
                useLocalStorage('test-key', initialValue)
            );

            expect(result.current[0]).toEqual(initialValue);
        });

        it('should read existing value from localStorage', () => {
            const existingValue = [{ id: 2, name: 'existing' }];
            localStorageMock.setItem('test-key', JSON.stringify(existingValue));

            const { result } = renderHook(() =>
                useLocalStorage('test-key', [])
            );

            expect(result.current[0]).toEqual(existingValue);
        });

        it('should update localStorage when setValue is called', () => {
            const { result } = renderHook(() =>
                useLocalStorage('test-key', [] as Array<{ id: number; name: string }>)
            );

            const newValue = [{ id: 1, name: 'new' }];

            act(() => {
                result.current[1](newValue);
            });

            expect(result.current[0]).toEqual(newValue);
            expect(localStorageMock.setItem).toHaveBeenCalledWith(
                'test-key',
                JSON.stringify(newValue)
            );
        });

        it('should handle function updates', () => {
            const initialValue = [{ id: 1, name: 'initial' }];
            const { result } = renderHook(() =>
                useLocalStorage('test-key', initialValue)
            );

            act(() => {
                result.current[1](prev => [...prev, { id: 2, name: 'added' }]);
            });

            expect(result.current[0]).toEqual([
                { id: 1, name: 'initial' },
                { id: 2, name: 'added' }
            ]);
        });
    });

    describe('Actions', () => {
        it('should clear localStorage when clear is called', () => {
            const initialValue = [{ id: 1, name: 'test' }];
            const { result } = renderHook(() =>
                useLocalStorage('test-key', initialValue)
            );

            act(() => {
                result.current[2].clear();
            });

            expect(localStorageMock.setItem).toHaveBeenCalledWith(
                'test-key',
                JSON.stringify([])
            );
        });

        it('should refresh from localStorage when refresh is called', () => {
            const { result } = renderHook(() =>
                useLocalStorage('test-key', [] as Array<{ id: number; name: string }>)
            );

            // Manually set localStorage to simulate external change
            const externalValue = [{ id: 3, name: 'external' }];
            localStorageMock.setItem('test-key', JSON.stringify(externalValue));

            act(() => {
                result.current[2].refresh();
            });

            expect(result.current[0]).toEqual(externalValue);
        });
    });

    describe('Custom serializer', () => {
        it('should use custom serializer when provided', () => {
            const customSerializer = {
                stringify: vi.fn((value: any[]) => `custom:${JSON.stringify(value)}`),
                parse: vi.fn((value: string) => JSON.parse(value.replace('custom:', ''))),
            };

            const { result } = renderHook(() =>
                useLocalStorage('test-key', [], undefined, { serializer: customSerializer })
            );

            const newValue = [{ id: 1, name: 'test' }];

            act(() => {
                result.current[1](newValue);
            });

            expect(customSerializer.stringify).toHaveBeenCalledWith(newValue);
            expect(localStorageMock.setItem).toHaveBeenCalledWith(
                'test-key',
                'custom:[{"id":1,"name":"test"}]'
            );
        });

        it('should use custom serializer for reading', () => {
            const customSerializer = {
                stringify: (value: any[]) => `custom:${JSON.stringify(value)}`,
                parse: vi.fn((value: string) => JSON.parse(value.replace('custom:', ''))),
            };

            localStorageMock.setItem('test-key', 'custom:[{"id":2,"name":"parsed"}]');

            const { result } = renderHook(() =>
                useLocalStorage('test-key', [], undefined, { serializer: customSerializer })
            );

            expect(customSerializer.parse).toHaveBeenCalled();
            expect(result.current[0]).toEqual([{ id: 2, name: 'parsed' }]);
        });
    });

    describe('Merge function', () => {
        it('should use merge function when provided and data has changed', () => {
            const mergeFunction = vi.fn((existing: any[], newData: any[]) => ({
                result: [...existing, ...newData],
                hasChanged: true,
            }));

            // Set initial localStorage value
            const existingValue = [{ id: 1, name: 'existing' }];
            localStorageMock.setItem('test-key', JSON.stringify(existingValue));

            const { result } = renderHook(() =>
                useLocalStorage('test-key', [], mergeFunction)
            );

            const newValue = [{ id: 2, name: 'new' }];

            act(() => {
                result.current[1](newValue);
            });

            expect(mergeFunction).toHaveBeenCalledWith(existingValue, newValue);
            expect(result.current[0]).toEqual([
                { id: 1, name: 'existing' },
                { id: 2, name: 'new' }
            ]);
        });

        it('should not update when merge function returns hasChanged: false', () => {
            const mergeFunction = vi.fn((existing: any[], newData: any[]) => ({
                result: existing,
                hasChanged: false,
            }));

            const initialValue = [{ id: 1, name: 'initial' }];
            const { result } = renderHook(() =>
                useLocalStorage('test-key', initialValue, mergeFunction)
            );

            const previousValue = result.current[0];

            act(() => {
                result.current[1]([{ id: 2, name: 'new' }]);
            });

            expect(result.current[0]).toBe(previousValue); // Same reference
        });

        it('should not use merge function on initial load', () => {
            const mergeFunction = vi.fn();
            const existingValue = [{ id: 1, name: 'existing' }];
            localStorageMock.setItem('test-key', JSON.stringify(existingValue));

            renderHook(() =>
                useLocalStorage('test-key', [], mergeFunction)
            );

            expect(mergeFunction).not.toHaveBeenCalled();
        });
    });

    describe('Error handling', () => {
        it('should handle localStorage read errors', () => {
            const onError = vi.fn();
            localStorageMock.getItem.mockImplementationOnce(() => {
                throw new Error('Read error');
            });

            const initialValue = [{ id: 1, name: 'fallback' }];
            const { result } = renderHook(() =>
                useLocalStorage('test-key', initialValue, undefined, { onError })
            );

            expect(result.current[0]).toEqual(initialValue);
            expect(onError).toHaveBeenCalledWith(expect.any(Error), 'read');
        });

        it('should handle localStorage write errors', () => {
            const onError = vi.fn();
            localStorageMock.setItem.mockImplementationOnce(() => {
                throw new Error('Write error');
            });

            const { result } = renderHook(() =>
                useLocalStorage('test-key', [], undefined, { onError })
            );

            act(() => {
                result.current[1]([{ id: 1, name: 'test' }]);
            });

            expect(onError).toHaveBeenCalledWith(expect.any(Error), 'write');
        });

        it('should handle JSON parse errors', () => {
            const onError = vi.fn();
            localStorageMock.setItem('test-key', 'invalid-json');

            const initialValue = [{ id: 1, name: 'fallback' }];
            const { result } = renderHook(() =>
                useLocalStorage('test-key', initialValue, undefined, { onError })
            );

            expect(result.current[0]).toEqual(initialValue);
            expect(onError).toHaveBeenCalledWith(expect.any(Error), 'read');
        });

        it('should use default error handler when none provided', () => {
            localStorageMock.getItem.mockImplementationOnce(() => {
                throw new Error('Test error');
            });

            const { result } = renderHook(() =>
                useLocalStorage('test-key', [])
            );

            expect(console.warn).toHaveBeenCalledWith(
                expect.stringContaining('useLocalStorage read error'),
                expect.any(Error)
            );
            expect(result.current[0]).toEqual([]);
        });

        it('should handle non-array values gracefully', () => {
            const { result } = renderHook(() =>
                useLocalStorage('test-key', [] as any[])
            );

            act(() => {
                // @ts-ignore - Testing runtime behavior
                result.current[1]('not-an-array');
            });

            expect(console.warn).toHaveBeenCalledWith(
                expect.stringContaining('setValue expected an array')
            );
            expect(result.current[0]).toEqual([]);
        });
    });

    describe('Cross-tab synchronization', () => {
        it('should sync across tabs when syncAcrossTabs is true', () => {
            const { result } = renderHook(() =>
                useLocalStorage('test-key', [], undefined, { syncAcrossTabs: true })
            );

            const newValue = [{ id: 1, name: 'synced' }];

            // Simulate storage event from another tab
            act(() => {
                const event = new dom.window.StorageEvent('storage', {
                    key: 'test-key',
                    newValue: JSON.stringify(newValue),
                });
                globalThis.window.dispatchEvent(event);
            });

            expect(result.current[0]).toEqual(newValue);
        });

        it('should not sync when syncAcrossTabs is false', () => {
            const { result } = renderHook(() =>
                useLocalStorage('test-key', [], undefined, { syncAcrossTabs: false })
            );

            const initialValue = result.current[0];

            // Simulate storage event from another tab
            act(() => {
                const event = new dom.window.StorageEvent('storage', {
                    key: 'test-key',
                    newValue: JSON.stringify([{ id: 1, name: 'should-not-sync' }]),
                });
                globalThis.window.dispatchEvent(event);
            });

            expect(result.current[0]).toBe(initialValue);
        });

        it('should handle storage event parse errors', () => {
            const onError = vi.fn();
            renderHook(() =>
                useLocalStorage('test-key', [], undefined, {
                    syncAcrossTabs: true,
                    onError
                })
            );

            // Simulate storage event with invalid JSON
            act(() => {
                const event = new dom.window.StorageEvent('storage', {
                    key: 'test-key',
                    newValue: 'invalid-json',
                });
                globalThis.window.dispatchEvent(event);
            });

            expect(onError).toHaveBeenCalledWith(expect.any(Error), 'read');
        });

        it('should ignore storage events for different keys', () => {
            const { result } = renderHook(() =>
                useLocalStorage('test-key', [], undefined, { syncAcrossTabs: true })
            );

            const initialValue = result.current[0];

            act(() => {
                const event = new dom.window.StorageEvent('storage', {
                    key: 'other-key',
                    newValue: JSON.stringify([{ id: 1, name: 'other' }]),
                });
                globalThis.window.dispatchEvent(event);
            });

            expect(result.current[0]).toBe(initialValue);
        });
    });

    describe('SSR compatibility', () => {
        it('should handle undefined window gracefully', () => {
            // Spy on the hook's internal check by mocking the readFromStorage behavior
            const originalGetItem = localStorageMock.getItem;

            // Mock localStorage.getItem to simulate server environment
            localStorageMock.getItem.mockImplementation(() => {
                // Simulate the hook's check: if (typeof window === 'undefined')
                throw new ReferenceError('window is not defined');
            });

            const initialValue = [{ id: 1, name: 'ssr' }];

            // The hook should catch the error and return initialValue
            const { result } = renderHook(() =>
                useLocalStorage('test-key', initialValue)
            );

            expect(result.current[0]).toEqual(initialValue);

            // Restore original implementation
            localStorageMock.getItem.mockImplementation(originalGetItem);
        });
    });

    describe('Memory management', () => {
        it('should clean up storage event listener on unmount', () => {
            const removeEventListenerSpy = vi.spyOn(globalThis.window, 'removeEventListener');

            const { unmount } = renderHook(() =>
                useLocalStorage('test-key', [], undefined, { syncAcrossTabs: true })
            );

            unmount();

            expect(removeEventListenerSpy).toHaveBeenCalledWith(
                'storage',
                expect.any(Function)
            );

            removeEventListenerSpy.mockRestore();
        });
    });
});