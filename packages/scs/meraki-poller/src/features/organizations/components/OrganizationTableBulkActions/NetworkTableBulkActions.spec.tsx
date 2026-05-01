import { renderHook } from '@testing-library/react';
import { vi } from 'vitest';
import { useGetOrganizationsTableBulkActions } from './OrganizationTableBulkActions';
import { testWrapper } from '~/test/utils';

describe('<NetworkTableBulkActions />', () => {
   it('should render successfully', () => {
      expect(() =>
         renderHook(
            () =>
               useGetOrganizationsTableBulkActions({
                  onOpen: vi.fn(),
                  selectedRows: [],
               }),
            testWrapper
         )
      ).not.toThrow();
   });

   it.todo('should have more tests');
});
