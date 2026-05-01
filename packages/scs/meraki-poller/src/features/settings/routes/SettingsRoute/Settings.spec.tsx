import { render } from '@testing-library/react';
import { Settings } from './Settings';
import { testWrapper } from '~/test/utils';

describe('Settings', () => {
   it('should render successfully', () => {
      expect(() =>
         render(<Settings />, testWrapper)
      ).not.toThrow();
   });
});
