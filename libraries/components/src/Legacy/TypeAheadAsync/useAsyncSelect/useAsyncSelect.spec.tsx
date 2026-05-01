import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { type ReactNode } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAsyncSelect } from './useAsyncSelect';

// Mock data types
interface User {
  id: number;
  name: string;
  email: string;
}

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useAsyncSelect', () => {
  const mockUsers: User[] = [
    { id: 1, name: 'matty', email: 'alice@example.com' },
    { id: 2, name: 'bobby', email: 'bob@example.com' },
    { id: 3, name: 'sunny', email: 'sunny@example.com' },
  ];

  const mapToOption = (user: User) => ({
    value: user.id,
    label: user.name,
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('defaultOptions', () => {
    it('should load and map default options on mount', async () => {
      const queryFn = vi.fn().mockResolvedValue(mockUsers);
      const queryOptions = () => ({
        queryKey: ['users'],
        queryFn,
      });

      const { result } = renderHook(() => useAsyncSelect(mapToOption, queryOptions), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.defaultOptions).toBeDefined();
      });

      expect(result.current.defaultOptions).toEqual([
        { value: 1, label: 'matty' },
        { value: 2, label: 'bobby' },
        { value: 3, label: 'sunny' },
      ]);
      expect(queryFn).toHaveBeenCalledTimes(1);
    });

    it('should return undefined when default query is loading', () => {
      const queryFn = vi.fn().mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve(mockUsers), 1000))
      );
      const queryOptions = () => ({
        queryKey: ['users'],
        queryFn,
      });

      const { result } = renderHook(() => useAsyncSelect(mapToOption, queryOptions), {
        wrapper: createWrapper(),
      });

      expect(result.current.defaultOptions).toBeUndefined();
    });

    it('should handle empty default data', async () => {
      const queryFn = vi.fn().mockResolvedValue([]);
      const queryOptions = () => ({
        queryKey: ['users'],
        queryFn,
      });

      const { result } = renderHook(() => useAsyncSelect(mapToOption, queryOptions), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.defaultOptions).toEqual([]);
      });
    });
  });

  describe('loadOptions', () => {
    it('should return mapped default options when inputValue is empty', async () => {
      const queryFn = vi.fn().mockResolvedValue(mockUsers);
      const queryOptions = () => ({
        queryKey: ['users'],
        queryFn,
      });

      const { result } = renderHook(() => useAsyncSelect(mapToOption, queryOptions), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.defaultOptions).toBeDefined();
      });

      const options = await result.current.loadOptions('');

      expect(options).toEqual([
        { value: 1, label: 'matty' },
        { value: 2, label: 'bobby' },
        { value: 3, label: 'sunny' },
      ]);
    });

    it('should fetch and map filtered options when inputValue is provided', async () => {
      const filteredUsers = [mockUsers[0]];
      const queryFn = vi.fn()
        .mockResolvedValueOnce(mockUsers)
        .mockResolvedValueOnce(filteredUsers);

      const queryOptions = (inputValue?: string) => ({
        queryKey: inputValue ? ['users', 'search', inputValue] : ['users'],
        queryFn,
      });

      const { result } = renderHook(() => useAsyncSelect(mapToOption, queryOptions), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.defaultOptions).toBeDefined();
      });

      const options = await result.current.loadOptions('matty');

      expect(options).toEqual([{ value: 1, label: 'matty' }]);
      expect(queryFn).toHaveBeenCalledTimes(2);
    });

    it('should return empty array when defaultOptions is undefined and inputValue is empty', async () => {
      const queryFn = vi.fn().mockResolvedValue(mockUsers);
      const queryOptions = () => ({
        queryKey: ['users'],
        queryFn,
        enabled: false,
      });

      const { result } = renderHook(() => useAsyncSelect(mapToOption, queryOptions), {
        wrapper: createWrapper(),
      });

      const options = await result.current.loadOptions('');

      expect(options).toEqual([]);
    });

    it('should return empty array when fetch returns null/undefined', async () => {
      const queryFn = vi.fn()
        .mockResolvedValueOnce(mockUsers)
        .mockResolvedValueOnce(null);

      const queryOptions = (inputValue?: string) => ({
        queryKey: inputValue ? ['users', 'search', inputValue] : ['users'],
        queryFn,
      });

      const { result } = renderHook(() => useAsyncSelect(mapToOption, queryOptions), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.defaultOptions).toBeDefined();
      });

      const options = await result.current.loadOptions('test');

      expect(options).toEqual([]);
    });

    it('should use query cache for subsequent identical searches', async () => {
      const queryFn = vi.fn().mockResolvedValue(mockUsers);
      const queryOptions = (inputValue?: string) => ({
        queryKey: inputValue ? ['users', 'search', inputValue] : ['users'],
        queryFn,
        staleTime: Infinity
      });

      const { result } = renderHook(() => useAsyncSelect(mapToOption, queryOptions), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.defaultOptions).toBeDefined();
      });

      // First search - should fetch
      await result.current.loadOptions('test');
      expect(queryFn).toHaveBeenCalledTimes(2); // 1 default + 1 search

      // Second identical search - should use cache
      await result.current.loadOptions('test');
      expect(queryFn).toHaveBeenCalledTimes(3); // No additional call
    });
  });

  describe('queryParams', () => {
    it('should pass queryParams to default options query', async () => {
      const queryFn = vi.fn().mockResolvedValue(mockUsers);
      const queryParams = { departmentId: 5, status: 'active' };

      const queryOptions = (inputValue?: string, params?: Record<string, any>) => ({
        queryKey: ['users', inputValue, params],
        queryFn: () => {
          // Verify params are received
          expect(params).toEqual(queryParams);
          return queryFn();
        },
      });

      const { result } = renderHook(
        () => useAsyncSelect(mapToOption, queryOptions, queryParams),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.defaultOptions).toBeDefined();
      });

      expect(queryFn).toHaveBeenCalledTimes(1);
    });

    it('should pass queryParams to search queries', async () => {
      const queryFn = vi.fn()
        .mockResolvedValueOnce(mockUsers)
        .mockResolvedValueOnce([mockUsers[0]]);

      const queryParams = { departmentId: 5, status: 'active' };
      let callCount = 0;

      const queryOptions = (inputValue?: string, params?: Record<string, any>) => ({
        queryKey: ['users', inputValue, params],
        queryFn: () => {
          // Verify params are received on both calls
          expect(params).toEqual(queryParams);
          callCount++;
          return queryFn();
        },
      });

      const { result } = renderHook(
        () => useAsyncSelect(mapToOption, queryOptions, queryParams),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.defaultOptions).toBeDefined();
      });

      await result.current.loadOptions('matty');

      expect(callCount).toBe(2); // Default load + search
      expect(queryFn).toHaveBeenCalledTimes(2);
    });

    it('should work without queryParams', async () => {
      const queryFn = vi.fn().mockResolvedValue(mockUsers);

      const queryOptions = (inputValue?: string, params?: Record<string, any>) => ({
        queryKey: ['users', inputValue, params],
        queryFn: () => {
          // Verify params is undefined when not provided
          expect(params).toBeUndefined();
          return queryFn();
        },
      });

      const { result } = renderHook(
        () => useAsyncSelect(mapToOption, queryOptions),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.defaultOptions).toBeDefined();
      });

      expect(queryFn).toHaveBeenCalledTimes(1);
    });

    it('should include queryParams in query key for proper caching', async () => {
      const queryFn = vi.fn().mockResolvedValue(mockUsers);
      const queryParams = { departmentId: 5 };

      const queryOptions = (inputValue?: string, params?: Record<string, any>) => ({
        queryKey: ['users', inputValue, params],
        queryFn,
        staleTime: Infinity,
      });

      const { result, rerender } = renderHook(
        ({ params }) => useAsyncSelect(mapToOption, queryOptions, params),
        {
          wrapper: createWrapper(),
          initialProps: { params: queryParams }
        }
      );

      await waitFor(() => {
        expect(result.current.defaultOptions).toBeDefined();
      });

      expect(queryFn).toHaveBeenCalledTimes(1);

      // Re-render with same params - should use cache
      rerender({ params: queryParams });
      expect(queryFn).toHaveBeenCalledTimes(1);

      // Re-render with different params - should fetch again
      rerender({ params: { departmentId: 10 } });
      await waitFor(() => {
        expect(queryFn).toHaveBeenCalledTimes(2);
      });
    });

    it('should handle complex queryParams objects', async () => {
      const queryFn = vi.fn().mockResolvedValue(mockUsers);
      const complexParams = {
        departmentId: 5,
        status: 'active',
        roles: ['admin', 'user'],
        filters: {
          minAge: 18,
          maxAge: 65,
        },
      };

      const queryOptions = (inputValue?: string, params?: Record<string, any>) => ({
        queryKey: ['users', inputValue, params],
        queryFn: () => {
          expect(params).toEqual(complexParams);
          return queryFn();
        },
      });

      const { result } = renderHook(
        () => useAsyncSelect(mapToOption, queryOptions, complexParams),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.defaultOptions).toBeDefined();
      });

      await result.current.loadOptions('test');
      expect(queryFn).toHaveBeenCalledTimes(2);
    });

    it('should combine inputValue and queryParams in search queries', async () => {
      const queryFn = vi.fn()
        .mockResolvedValueOnce(mockUsers)
        .mockResolvedValueOnce([mockUsers[0]]);

      const queryParams = { departmentId: 5 };

      const queryOptions = (inputValue?: string, params?: Record<string, any>) => ({
        queryKey: ['users', inputValue, params],
        queryFn: () => {
          // Both inputValue and params should be available for the API call
          if (inputValue) {
            expect(inputValue).toBe('matty');
            expect(params).toEqual(queryParams);
          }
          return queryFn();
        },
      });

      const { result } = renderHook(
        () => useAsyncSelect(mapToOption, queryOptions, queryParams),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.defaultOptions).toBeDefined();
      });

      await result.current.loadOptions('matty');
      expect(queryFn).toHaveBeenCalledTimes(2);
    });
  });

  describe('debouncing', () => {
    it('should debounce rapid successive calls', async () => {
      const queryFn = vi.fn()
        .mockResolvedValueOnce(mockUsers)
        .mockResolvedValueOnce([mockUsers[0]]);

      const queryOptions = (inputValue?: string) => ({
        queryKey: ['users', inputValue],
        queryFn,
      });

      const { result } = renderHook(
        () => useAsyncSelect(mapToOption, queryOptions, undefined, 100),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.defaultOptions).toBeDefined();
      });

      // Make multiple rapid calls
      const promise1 = result.current.loadOptions('a');
      const promise2 = result.current.loadOptions('ab');
      const promise3 = result.current.loadOptions('abc');

      // All promises should resolve with the same data from the last call
      const [result1, result2, result3] = await Promise.all([promise1, promise2, promise3]);

      expect(result1).toEqual(result2);
      expect(result2).toEqual(result3);
      // Only 2 calls: 1 for default options, 1 for the debounced search
      expect(queryFn).toHaveBeenCalledTimes(2);
    });

    it('should use custom debounce delay', async () => {
      const queryFn = vi.fn()
        .mockResolvedValueOnce(mockUsers)
        .mockResolvedValueOnce([mockUsers[0]]);

      const queryOptions = (inputValue?: string) => ({
        queryKey: ['users', inputValue],
        queryFn,
      });

      const { result } = renderHook(
        () => useAsyncSelect(mapToOption, queryOptions, undefined, 50),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.defaultOptions).toBeDefined();
      });

      const initialCallCount = queryFn.mock.calls.length;

      result.current.loadOptions('test');

      // Should not have called immediately
      expect(queryFn).toHaveBeenCalledTimes(initialCallCount);

      // Wait for debounce to complete
      await waitFor(() => {
        expect(queryFn).toHaveBeenCalledTimes(initialCallCount + 1);
      }, { timeout: 200 });
    });

    it('should not debounce empty input', async () => {
      const queryFn = vi.fn().mockResolvedValue(mockUsers);

      const queryOptions = (inputValue?: string) => ({
        queryKey: ['users', inputValue],
        queryFn,
      });

      const { result } = renderHook(
        () => useAsyncSelect(mapToOption, queryOptions, undefined, 300),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.defaultOptions).toBeDefined();
      });

      // Empty input should return immediately without debounce
      const options = await result.current.loadOptions('');

      expect(options).toEqual([
        { value: 1, label: 'matty' },
        { value: 2, label: 'bobby' },
        { value: 3, label: 'sunny' },
      ]);
      // No additional query should have been made
      expect(queryFn).toHaveBeenCalledTimes(1);
    });

    it('should cancel previous debounce when new input arrives', async () => {
      const queryFn = vi.fn()
        .mockResolvedValueOnce(mockUsers)
        .mockResolvedValueOnce([mockUsers[0]])
        .mockResolvedValueOnce([mockUsers[1]]);

      const queryOptions = (inputValue?: string) => ({
        queryKey: ['users', inputValue],
        queryFn,
      });

      const { result } = renderHook(
        () => useAsyncSelect(mapToOption, queryOptions, undefined, 100),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.defaultOptions).toBeDefined();
      });

      // First call - will be cancelled
      result.current.loadOptions('a');

      // Wait a bit but not enough for debounce
      await new Promise(resolve => setTimeout(resolve, 50));

      // Second call - will also be cancelled
      result.current.loadOptions('ab');

      // Wait a bit but not enough for debounce
      await new Promise(resolve => setTimeout(resolve, 50));

      // Third call - will complete
      const finalPromise = result.current.loadOptions('abc');

      await finalPromise;

      // Should only have made 2 calls total: 1 for default, 1 for final debounced search
      expect(queryFn).toHaveBeenCalledTimes(2);
    });
  });

  describe('mapToOption', () => {
    it('should handle different data structures', async () => {
      interface Product {
        sku: string;
        productName: string;
        price: number;
      }

      const mockProducts: Product[] = [
        { sku: 'ABC123', productName: 'Widget', price: 19.99 },
        { sku: 'DEF456', productName: 'Gadget', price: 29.99 },
      ];

      const productMapper = (product: Product) => ({
        value: product.sku,
        label: `${product.productName} - $${product.price}`,
      });

      const queryFn = vi.fn().mockResolvedValue(mockProducts);
      const queryOptions = () => ({
        queryKey: ['products'],
        queryFn,
      });

      const { result } = renderHook(
        () => useAsyncSelect(productMapper, queryOptions),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.defaultOptions).toBeDefined();
      });

      expect(result.current.defaultOptions).toEqual([
        { value: 'ABC123', label: 'Widget - $19.99' },
        { value: 'DEF456', label: 'Gadget - $29.99' },
      ]);
    });

    it('should support numeric values', async () => {
      const numericMapper = (user: User) => ({
        value: user.id,
        label: user.email,
      });

      const queryFn = vi.fn().mockResolvedValue(mockUsers);
      const queryOptions = () => ({
        queryKey: ['users'],
        queryFn,
      });

      const { result } = renderHook(
        () => useAsyncSelect(numericMapper, queryOptions),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.defaultOptions).toBeDefined();
      });

      const firstOption = result.current.defaultOptions![0];
      expect(typeof firstOption.value).toBe('number');
      expect(firstOption.value).toBe(1);
    });
  });

  describe('error handling', () => {
    it('should handle query errors gracefully', async () => {
      const queryFn = vi.fn().mockRejectedValue(new Error('Network error'));
      const queryOptions = () => ({
        queryKey: ['users'],
        queryFn,
      });

      const { result } = renderHook(() => useAsyncSelect(mapToOption, queryOptions), {
        wrapper: createWrapper(),
      });

      // defaultOptions should remain undefined on error
      await waitFor(() => {
        expect(result.current.defaultOptions).toBeUndefined();
      });
    });

    it('should handle loadOptions errors', async () => {
      const queryFn = vi.fn()
        .mockResolvedValueOnce(mockUsers)
        .mockRejectedValueOnce(new Error('Search failed'));

      const queryOptions = (inputValue?: string) => ({
        queryKey: inputValue ? ['users', 'search', inputValue] : ['users'],
        queryFn,
      });

      const { result } = renderHook(() => useAsyncSelect(mapToOption, queryOptions), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.defaultOptions).toBeDefined();
      });

      await expect(result.current.loadOptions('test')).rejects.toThrow('Search failed');
    });

    it('should reject all pending promises on error during debounce', async () => {
      const queryFn = vi.fn()
        .mockResolvedValueOnce(mockUsers)
        .mockRejectedValueOnce(new Error('API Error'));

      const queryOptions = (inputValue?: string) => ({
        queryKey: ['users', inputValue],
        queryFn,
      });

      const { result } = renderHook(
        () => useAsyncSelect(mapToOption, queryOptions, undefined, 50),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.defaultOptions).toBeDefined();
      });

      // Make multiple rapid calls
      const promise1 = result.current.loadOptions('a');
      const promise2 = result.current.loadOptions('ab');
      const promise3 = result.current.loadOptions('abc');

      // All promises should reject with the same error
      await expect(promise1).rejects.toThrow('API Error');
      await expect(promise2).rejects.toThrow('API Error');
      await expect(promise3).rejects.toThrow('API Error');
    });
  });
});