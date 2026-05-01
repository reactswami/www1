import { renderHook } from '@testing-library/react';
import { vi  } from 'vitest';
import { useDisableOa } from './useDisableOa';
import { testWrapper } from '~/test/utils';

describe('<UseDisableOa />', () => {
   it('should render successfully', () => {
      expect(() =>
         renderHook(
            () => useDisableOa({ name: 'oa', onClose: vi.fn() }),
            testWrapper
         )
      ).not.toThrow();
   });

   it.todo('should have more tests');
});
