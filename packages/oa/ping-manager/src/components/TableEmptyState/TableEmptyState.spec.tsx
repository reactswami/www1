import { render } from '@testing-library/react';
import { PingTableEmptyState } from './TableEmptyState';

describe('<PingTableEmptyState />', () => {
   it('should render successfully', () => {
      expect(() => render(<PingTableEmptyState />)).not.toThrow();
   });

   it.todo('should have more tests');
});
