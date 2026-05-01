import { render } from '@testing-library/react';
import { LayoutGeneralStatusAlert } from './LayoutGeneralStatusAlert';
import { testWrapper } from '~/test/utils';

describe('<LayoutGeneralStatusAlert />', () => {
   it('should render successfully', () => {
      expect(() =>
         render(<LayoutGeneralStatusAlert />, testWrapper)
      ).not.toThrow();
   });
});
