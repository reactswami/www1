import { Table } from '@chakra-ui/react';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { render } from '@testing-library/react';
import { columns } from '../Table/columnsDef';
import { TableHeader } from './TableHeader';
import { silenceConsole } from '~/test/utils';

describe('<OaTableHeader />', () => {
   const TableWrapper = () => {
      const table = useReactTable({
         data: [],
         columns,
         getCoreRowModel: getCoreRowModel(),
      });
      return (
         <Table>
            <TableHeader table={table} />
         </Table>
      );
   };
   it('should render successfully', () => {
      silenceConsole();
      expect(() => render(<TableWrapper />)).not.toThrow();
   });
});
