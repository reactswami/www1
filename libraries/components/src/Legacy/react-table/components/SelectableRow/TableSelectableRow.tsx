import { Skeleton, Td, Tr } from '@chakra-ui/react';
import { type Row, flexRender } from '@tanstack/react-table';

import { memo } from 'react';

interface Props<T> {
   row: Row<T>;
   isChecked: boolean;
   // isChecked is important for the memo to work properly
   isLoading?: boolean;
}

const typedMemo: <T>(c: T) => T = memo;

/*
 * Selectable row
 */
export const TableSelectableRow = typedMemo(
   <T,>({ row, isLoading }: Props<T>) => {
      return (
         <Tr
            cursor={'pointer'}
            transition={'100ms ease-in background'}
            _hover={{ background: 'blue.50' }}
            onClick={row.getToggleSelectedHandler()}
         >
            {row.getVisibleCells().map((cell, index) => (
               <Td key={cell.id} width={index === 0 ? '10px' : undefined}>
                  {isLoading ? (
                     <Skeleton>x</Skeleton> // We use one character just to geth right height and not impact the width
                  ) : (
                     flexRender(cell.column.columnDef.cell, cell.getContext())
                  )}
               </Td>
            ))}
         </Tr>
      );
   }
);
