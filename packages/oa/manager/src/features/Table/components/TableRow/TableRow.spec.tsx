import { Table } from '@chakra-ui/react';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { render } from '@testing-library/react';
import { columns } from '../Table/columnsDef';
import { TableRow } from './TableRow';

describe('<OaTableRow />', () => {
   const TableWrapper = () => {
      const table = useReactTable({
         data: [],
         columns,
         getCoreRowModel: getCoreRowModel(),
      });
      return (
         <Table>
            {table.getRowModel().rows.map((row) => (
               <TableRow key={row.id} row={row} />
            ))}
         </Table>
      );
   };
   it('should render successfully', () => {
      expect(() => render(<TableWrapper />)).not.toThrow();
   });
});
