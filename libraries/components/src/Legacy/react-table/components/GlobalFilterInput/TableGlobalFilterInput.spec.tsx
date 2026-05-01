
import { createTable } from '@tanstack/react-table';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { vi } from 'vitest';
import { GlobalFilterInput, type MinContext, type Props } from './GlobalFilterInput';

describe('<GlobalFilterInput />', () => {
   const setGlobalFilterSpy = vi.fn();
   const initialContext: MinContext<string> = {
      table: createTable({
         data: ['hello', 'world'],
         columns: [],
         state: {},
         onStateChange: vi.fn(),
         getCoreRowModel: vi.fn(),
         renderFallbackValue: vi.fn(),
      }),
      isLoading: false,
      isSuccess: false,
      isError: false,
      globalFilter: '',
      setGlobalFilter: setGlobalFilterSpy,
      viewMode: 'md',
      setViewMode: vi.fn(),
   };
   const props: Props<string> = {
      context: initialContext,
   };

   afterEach(() => {
      setGlobalFilterSpy.mockReset();
   });
   it('should render successfully', () => {
      expect(() =>
         render(<GlobalFilterInput<string> {...props} />)
      ).not.toThrow();
   });

   it('should update the global filter', async () => {
      const user = userEvent.setup();
      const SEARCH_QUERY = 'a';

      render(<GlobalFilterInput {...props} />);

      await user.type(
         screen.getByRole('textbox', { name: /search/i }),
         SEARCH_QUERY
      );

      expect(setGlobalFilterSpy).toHaveBeenCalledWith(SEARCH_QUERY);
   });

   it('should have a button to reset the current filter', async () => {
      const user = userEvent.setup();

      const TestWrapper = () => {
         // Simply creating a quick parent component to test the the input value is reset
         const [globalFilter, setGlobalFilter] = useState('hello');
         return (
            <div>
               <GlobalFilterInput
                  {...{
                     context: {
                        ...props.context,
                        globalFilter,
                        setGlobalFilter,
                     },
                  }}
               />
            </div>
         );
      };

      render(<TestWrapper />);

      await user.click(screen.getByRole('button', { name: /reset/i }));

      await waitFor(() =>
         expect(screen.getByRole('textbox', { name: /search/i })).toHaveValue(
            ''
         )
      );
   });
});
