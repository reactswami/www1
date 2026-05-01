import { render } from '@testing-library/react';

import { TableBulkActions } from './TableBulkActions';

describe('<TableBulkActions />', () => {
   it('should render successfully', () => {
      expect(() => render(<TableBulkActions selectedRowsCount={2} actions={[

]      }/>)).not.toThrow();
   });

   it.todo('should have more tests');
});
