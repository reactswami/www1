import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { useAssignOaServices } from './useAssignOaServices';
import { testWrapper } from '~/test/utils';

describe('<UseAssignOaServices />', () => {
   it('should render successfully', () => {
      expect(() =>
         renderHook(
            () => useAssignOaServices({ id: '99', onClose: vi.fn() }),
            testWrapper
         )
      ).not.toThrow();
   });

   it('should (re)set the values when a call is successful', async () => {
      const { result } = renderHook(
         () => useAssignOaServices({ id: '99', onClose: vi.fn() }),
         testWrapper
      );
      // We know the expected behavior by looking at the mockComponentsResponse
      const expected = { 6: false, 9: true };
      // We need to wait for the query to finish
      await waitFor(() => {
         expect(result.current.isLoading).toBe(false);
      });
      // Assert
      await waitFor(() => {
         expect(result.current.methods.getValues()).toEqual(expected);
      });
   });
});
