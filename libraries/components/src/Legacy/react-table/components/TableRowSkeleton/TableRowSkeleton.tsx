import { Skeleton, Td, Tr } from '@chakra-ui/react';

import { type Row } from '@tanstack/react-table';
import { memo } from 'react';

interface Props<T> {
   row: Row<T>;
}

const typedMemo: <T>(c: T) => T = memo;

/*
 * Skeleton Row (loading state with gray square to mock the data)
 */
export const TableRowSkeleton = typedMemo(<T,>({ row }: Props<T>) => {
   return (
      <Tr
         transition={'100ms ease-in background'}
         _hover={{ background: 'blue.50' }}
      >
         {row.getVisibleCells().map((cell) => (
            <Td key={cell.id}>
               <Skeleton>x</Skeleton>
            </Td>
         ))}
      </Tr>
   );
});
