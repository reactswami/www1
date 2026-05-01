import { Table } from '@chakra-ui/react';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { render } from '@testing-library/react';
import { columns } from '..';
import { PingTableRow } from './TableRow';

describe('<PingTableRow />', () => {
   const Test = () => {
      const table = useReactTable({
         columns: columns,
         getCoreRowModel: getCoreRowModel(),
         data: [],
      });

      return (
         <Table>
            {table.getRowModel().rows.map((row, idx) => (
               <PingTableRow isChecked={false} row={row} />
            ))}
         </Table>
      );
   };
   it('should render successfully', () => {
      expect(() => render(<Test />)).not.toThrow();
   });

   it.todo('should have more tests');
});
