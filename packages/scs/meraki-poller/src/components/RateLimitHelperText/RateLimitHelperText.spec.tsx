import { render } from '@testing-library/react';
import { RateLimitHelperText } from './RateLimitHelperText';

describe('RateLimitHelperText', () => {
   it('should render', () => {
      expect(() => render(<RateLimitHelperText />)).not.toThrow();
   });
   it('should have the same content', () => {
      expect(<RateLimitHelperText />).toMatchSnapshot();
   });
});
