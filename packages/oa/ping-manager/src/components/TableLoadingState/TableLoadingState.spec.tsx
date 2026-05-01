import { render } from '@testing-library/react';
import { PingTableLoadingState } from './TableLoadingState';

describe('<PingTableLoadingState />', () => {
   it('should render successfully', () => {
      expect(() => render(<PingTableLoadingState />)).not.toThrow();
   });

});
