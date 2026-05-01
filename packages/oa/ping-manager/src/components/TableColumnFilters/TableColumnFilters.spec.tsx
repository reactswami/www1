import { render } from '@testing-library/react';
import { TableColumnFilters } from './TableColumnFilters';
import { PingTableProvider } from '~/contexts';
import { testWrapper } from '~/test/utils';

describe('<PingTableColumnFilters />', () => {
   it('should render successfully', () => {
      expect(() =>
         render(
            <PingTableProvider>
               <TableColumnFilters />
            </PingTableProvider>,
            testWrapper
         )
      ).not.toThrow();
   });

   it.todo('should have more tests');
});
