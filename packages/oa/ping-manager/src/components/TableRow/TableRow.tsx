import { Td, Tr } from '@chakra-ui/react';
import { type Row, flexRender } from '@tanstack/react-table';
import { memo } from 'react';
import { type PingTableDeviceRow } from '..';

interface Props {
   row: Row<PingTableDeviceRow>;
   isChecked: boolean; // Note that the isChecked here is very important for memoization
}

export const PingTableRow = memo(({ row, isChecked }: Props) => {
   return (
      <Tr
         key={row.id}
         cursor={'pointer'}
         transition={'100ms ease-in background'}
         _hover={{ background: 'blue.50' }}
         onClick={row.getToggleSelectedHandler()}
      >
         {row.getVisibleCells().map((cell) => {
            return (
               <Td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
               </Td>
            );
         })}
      </Tr>
   );
});
