import { renderHook } from '@testing-library/react';
import { useFetchGlobalConfig } from './useFetchGlobalConfig';
import { testWrapper } from '~/test/utils';

describe('useFetchOrganisation', () => {
   it('should render', () => {
      expect(() =>
         renderHook(() => useFetchGlobalConfig(), testWrapper)
      ).not.toThrow();
   });
});
