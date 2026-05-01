import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { vi } from 'vitest';
import { GlobalFilter } from './GlobalFilter';

describe('GlobalFilter', () => {
   it('should render', () => {
      expect(() =>
         render(<GlobalFilter globalFilter={''} setGlobalFilter={vi.fn()} />)
      ).not.toThrow();
   });

   /*
    * Note: the actual testing of the filtering will be done in the parent (the table)
    */
   it('should display the right value, and update it when the user type a search', async () => {
      const user = userEvent.setup();
      const spy = vi.fn();

      const TestBed = () => {
         const [globalFilter, setGlobalFilter] = useState('Hello world!');
         return (
            <GlobalFilter
               globalFilter={globalFilter}
               setGlobalFilter={(arg) => {
                  setGlobalFilter(arg);
                  spy(arg);
               }}
            />
         );
      };
      render(<TestBed />);

      expect(screen.getByRole('textbox')).toHaveValue('Hello world!');
      await user.clear(screen.getByRole('textbox'));
      await user.type(screen.getByRole('textbox'), 'Batman!');

      await waitFor(() => {
         expect(spy).toHaveBeenCalledWith('Batman!');
      });
   });
});
