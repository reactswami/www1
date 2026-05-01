import { render } from '@testing-library/react';
import { PingManageDeviceRoute } from './TableRoute';
import { testWrapper } from '~/test/utils';

describe('<PingManageDeviceRoute />', () => {
   it('should render successfully', () => {
      expect(() =>
         render(<PingManageDeviceRoute />, testWrapper)
      ).not.toThrow();
   });

   it.todo('should have more tests');
});
