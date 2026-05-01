import { render } from '@testing-library/react';
import { PingTableActionsHeader } from './TableActionsHeader';
import { PingTableProvider } from '~/contexts';
import { testWrapper } from '~/test/utils';

describe('<PingTableActionsHeader />', () => {
   it('should render successfully', () => {
      expect(() =>
         render(
            <PingTableProvider>
               <PingTableActionsHeader />
            </PingTableProvider>,
            testWrapper
         )
      ).not.toThrow();
   });

   it.todo('should have more tests');
});
