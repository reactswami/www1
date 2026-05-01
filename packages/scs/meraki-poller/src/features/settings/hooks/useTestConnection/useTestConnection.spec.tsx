import { renderHook } from '@testing-library/react';
import { useTestConnection } from './useTestConnection';
import { testWrapper } from '~/test/utils';

describe('use test connection', () => {
   it('should render', () => {
      expect(() =>
         renderHook(() => useTestConnection, testWrapper)
      ).not.toThrow();
   });
});
