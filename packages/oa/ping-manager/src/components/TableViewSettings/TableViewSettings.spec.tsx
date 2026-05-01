import { render } from '@testing-library/react';
import { TableViewSettings } from './TableViewSettings';
import { testWrapper } from '~/test/utils';

describe('<TableViewSettings />', () => {
   it('should render successfully', () => {
      expect(() => render(<TableViewSettings />, testWrapper)).not.toThrow();
   });

   it.todo('should have more tests');
});
