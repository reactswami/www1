import { render } from '@testing-library/react';
import { PingTablePingTag } from './TableTag';

describe('<PingTablePingTag />', () => {
   it('should render successfully', () => {
      expect(() =>
         render(<PingTablePingTag name="test" enabledStatus="one" />)
      ).not.toThrow();
   });

   it.todo('should have more tests');
});
