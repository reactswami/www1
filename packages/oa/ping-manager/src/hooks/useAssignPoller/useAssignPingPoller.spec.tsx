import { renderHook } from '@testing-library/react';
import { useAssignPingPoller } from './useAssignPingPoller';
import { testWrapper } from '~/test/utils';

describe('<UseAssignPingPoller />', () => {
   it('should render successfully', () => {
      expect(() =>
         renderHook(
            () =>
               useAssignPingPoller({
                  isOpen: true,
                  onClose: () => {},
                  deviceSelectedCount: 2,
                  isAllSelected: false,
               }),
            testWrapper
         )
      ).not.toThrow();
   });

   it.todo('should have more tests');
});
