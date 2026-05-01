import { render,  } from '@testing-library/react';
import { vi } from 'vitest';
import {TableViewSettings} from './TableViewSettings';

describe('<TableViewSettings />', () => {
   it('should render successfully', () => {
      expect(() => render(<TableViewSettings viewMode="md" setViewMode={vi.fn()}  />)).not.toThrow();
   });

   it.todo('should have more tests');
});
