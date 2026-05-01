import { TableSelectableHeaderRow } from '@statseeker/components/Legacy/react-table';
import { type Table } from '@tanstack/react-table';
import { type TableRowData } from '~/hooks/useFetchOaTableData';

interface Props {
   table: Table<TableRowData>;
}

export const TableHeader = ({ table }: Props) => (
   <>
      {table.getHeaderGroups().map((headerGroup) => (
         <TableSelectableHeaderRow
            key={headerGroup.id}
            headers={headerGroup.headers}
         />
      ))}
   </>
);
