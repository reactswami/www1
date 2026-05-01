import { Table } from '@chakra-ui/react';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { render } from '@testing-library/react';
import { columns } from '../Table/columnsDef';
import { type Props, TableHeaderCell } from './TableHeaderCell';

describe('<TableHeaderCell />', () => {
   const Test = ({
      sortBy,
      setSortBy,
      isCheckboxCell,
   }: {
      setSortBy: (arg: [string, 'asc' | 'desc']) => void;
      sortBy: [string, 'asc' | 'desc'];
      isCheckboxCell: boolean;
   }) => {
      const table = useReactTable({
         columns,
         data: [],
         getCoreRowModel: getCoreRowModel(),
      });

      return (
         <Table>
            {table.getHeaderGroups().map((headerGroup) => (
               <div key={headerGroup.id}>
                  {headerGroup.headers.map((header, idx) => {
                     return (
                        <TableHeaderCell
                           key={header.id}
                           header={header as unknown as Props['header']}
                           isCheckboxCell={isCheckboxCell}
                           sortBy={sortBy}
                           setSortBy={setSortBy}
                        />
                     );
                  })}
               </div>
            ))}
         </Table>
      );
   };
   it('should render successfully', () => {
      expect(() =>
         render(
            <Test
               setSortBy={(arg) => {}}
               sortBy={['', 'asc']}
               isCheckboxCell={false}
            />
         )
      ).not.toThrow();
   });

   it.todo('should have more tests');
});
