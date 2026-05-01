import { renderHook } from '@testing-library/react';
import { vi } from 'vitest';
import { useUpdateOa } from './useUpdateOa';
import { testWrapper } from '~/test/utils';

describe('<UseUpdateOa />', () => {
   it('should render successfully', () => {
      expect(() =>
         renderHook(() => useUpdateOa({ onClose: vi.fn() }), testWrapper)
      ).not.toThrow();
   });

   it.todo('should have more tests');
});
