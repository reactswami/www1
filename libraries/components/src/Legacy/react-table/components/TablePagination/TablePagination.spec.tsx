import { ChakraProvider } from '@chakra-ui/react';
import { createTable } from '@tanstack/react-table';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { vi } from 'vitest';
import { type Props, TablePagination } from './TablePagination';

describe('<TablePagination />', () => {
   // We need to wrap the component in a ChakraProvider as we are using Chakra UI components
   const testWrapper = ({ children }: { children: React.ReactNode }) => (
      <ChakraProvider>{children}</ChakraProvider>
   );
   // Fake data for the table
   const data = new Array(100).fill(0).map((_, i) => ({
      id: i,
      name: `Name ${i}`,
   }));
   // Fake table
   const mockTable = createTable({
      columns: [
         {
            header: 'Name',
         },
         {
            header: 'id',
         },
      ],
      data,
      state: {
         pagination: {
            pageIndex: 0,
            pageSize: 1,
         },
      },
      getCoreRowModel: vi.fn(),
      renderFallbackValue: vi.fn(),
      onStateChange: vi.fn(),
   });
   mockTable._getCoreRowModel = vi.fn().mockReturnValue({ rows: data });
   const defaultProps: Props = {
      table: mockTable,
      pageSizes: [1],
   };
   it('should render successfully', () => {
      expect(() => render(<TablePagination {...defaultProps} />)).not.toThrow();
   });

   it("should update the table's page index when the input value changes", async () => {
      // Arrange
      render(<TablePagination {...defaultProps} />, { wrapper: testWrapper });
      const input = screen.getByRole('textbox', { name: /go.to.page/i });
      const expectedPage = '2';
      const user = userEvent.setup();
      const spyOnSetPageIndex = vi.spyOn(mockTable, 'setPageIndex');

      // Act
      await user.type(input, `{backspace}2`);

      // Assert
      await waitFor(async () => {
         await expect(spyOnSetPageIndex).toHaveBeenCalled();
      });
      expect(spyOnSetPageIndex).toHaveBeenCalledWith(Number(expectedPage) - 1);
      expect(input).toHaveValue(expectedPage);
   });

   it('should update the input go to page when clicking on the button next page', async () => {
      // Arrange
      // Because it's complex to mock the table state, we are creating a new table with a different page index
      // But we will check that the next page button are calling the right method on the table
      const mockTable = createTable({
         columns: [
            {
               header: 'Name',
            },
            {
               header: 'id',
            },
         ],
         data,
         state: {
            pagination: {
               pageIndex: 2,
               pageSize: 1,
            },
         },
         getCoreRowModel: vi.fn(),
         renderFallbackValue: vi.fn(),
         onStateChange: vi.fn(),
      });
      mockTable._getCoreRowModel = vi.fn().mockReturnValue({ rows: data });
      const spyOnSetPageIndex = vi.spyOn(mockTable, 'setPageIndex');
      render(<TablePagination {...{ ...defaultProps, table: mockTable }} />, {
         wrapper: testWrapper,
      });
      const input = screen.getByRole('textbox', { name: /go.to.page/i });
      const expectedPage = 3;
      const user = await userEvent.setup();

      // Act
      await user.click(screen.getByRole('button', { name: /next.page/i }));
      await user.click(screen.getByRole('button', { name: /next.page/i }));

      // Assert
      await waitFor(async () => {
         await expect(spyOnSetPageIndex).toHaveBeenCalledTimes(2);
      });
      expect(input).toHaveValue(expectedPage.toString());
   });
});
