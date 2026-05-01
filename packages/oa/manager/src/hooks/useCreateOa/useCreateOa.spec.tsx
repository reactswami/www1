import { renderHook } from '@testing-library/react';
import { vi } from 'vitest';
import { useCreateOa } from './useCreateOa';
import { testWrapper } from '~/test/utils';

describe('<UseCreateOa />', () => {
   it('should render successfully', () => {
      expect(() =>
         renderHook(
            () => useCreateOa({ onCloseFormModal: vi.fn() }),
            testWrapper
         )
      ).not.toThrow();
   });

   it.todo('should have more tests');
});
