import { render } from '@testing-library/react';
import { PingTablePaginationFooter } from './TablePaginationFooter';
import { PingTableProvider } from '~/contexts/context';
import { testWrapper } from '~/test/utils';

describe('<PingTablePaginationFooter />', () => {
   it('should render successfully', () => {
      expect(() =>
         render(
            <PingTableProvider>
               <PingTablePaginationFooter />
            </PingTableProvider>,
            testWrapper
         )
      ).not.toThrow();
   });
});
