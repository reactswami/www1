import { render,  } from '@testing-library/react';
import { vi } from 'vitest';
import { TableColumnFilters } from './TableColumnFilters';
import { testWrapper } from '~/test/utils';

describe('<TableColumnFilters />', () => {
   it('should render successfully', () => {
      expect(() =>
         render(
            <TableColumnFilters
               columnFilters={[]}
               setColumnFilters={vi.fn()}
               filters={[]}
            />,
            testWrapper
         )
      ).not.toThrow();
   });

   it.todo('should have more tests');
});
