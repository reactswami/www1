import { render } from '@testing-library/react';
import { TableErrorState } from './TableErrorState';

describe('<TableErrorState />', () => {
   it('should render successfully', () => {
      expect(() => render(<TableErrorState />)).not.toThrow();
   });

   it.todo('should have more tests');
});
