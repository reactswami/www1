import { render } from '@testing-library/react';
import { PingTablePingTags } from './TableTags';

describe('<PingTablePingTags />', () => {
   it('should render successfully', () => {
      expect(() =>
         render(
            <PingTablePingTags
               pingPollerList={'poller1, poller2'}
               enabledList={'poller1, poller2'}
            />
         )
      ).not.toThrow();
   });

   it.todo('should have more tests');
});
