import { Td, Tr } from '@chakra-ui/react';
import { type Row, flexRender } from '@tanstack/react-table';


export interface Props<T> {
   row: Row<T>;
   index: number;
}

export const TableRow = <T,>({ row, index }: Props<T>) => {
   return (
      <Tr
         transition={'100ms ease-in background'}
         sx={{
            backgroundColor: row.getIsSelected()
               ? 'tableRow.selected'
               : 'transparent',
            '&:hover': {
               backgroundColor: row.getIsSelected()
                  ? 'tableRow.selectedHover'
                  : 'tableRow.hover'
            },

            borderLeft: row.getIsSelected() ? '1px solid' : 'none',
            borderRight: row.getIsSelected() ? '1px solid' : 'none',
            borderColor: row.getIsSelected() ? '#2196f3' : 'transparent',
            boxShadow: row.getIsSelected() ? (index === 0 ? '0 1px 0 0 #2196f3'
               : '0 -1px 0 0 var(--chakra-colors-blue-500), 0 1px 0 0 #2196f3')
               : 'none',
         }}
         onClick={row.getToggleSelectedHandler()}
      >
         {row.getVisibleCells().map((cell) => (
            <Td key={cell.id}>
               {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </Td>
         ))}
      </Tr>
   );
};