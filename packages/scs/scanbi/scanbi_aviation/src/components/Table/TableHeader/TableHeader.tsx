import { TableSelectableHeaderRow } from '@statseeker/components/Legacy/react-table';
import { type Table } from '@tanstack/react-table';
import { type RowData } from '~/types/models';

interface Props {
   table: Table<RowData>;
}

export const TableHeader = ({ table }: Props) => (
   <>
      {table.getHeaderGroups().map((headerGroup) => (
         <TableSelectableHeaderRow key={headerGroup.id} headers={headerGroup.headers} />
      ))}
   </>
);
