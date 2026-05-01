import { Td, Tr } from '@chakra-ui/react';
import { type Row, flexRender } from '@tanstack/react-table';
import { memo } from 'react';

export interface Props<T> {
   row: Row<T>;
}

const typedMemo: <T>(c: T) => T = memo;

export const TableRow = typedMemo(<T,>({ row }: Props<T>) => {
   return (
      <Tr
         transition={'100ms ease-in background'}
         _hover={{ background: 'primary.500', color: 'white' }}
         onClick={row.getToggleSelectedHandler()}
      >
         {row.getVisibleCells().map((cell) => (
            <Td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</Td>
         ))}
      </Tr>
   );
});
