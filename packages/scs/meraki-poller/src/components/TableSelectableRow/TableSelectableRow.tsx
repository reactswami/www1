import { Td, Tr } from '@chakra-ui/react';
import { flexRender, type Row } from '@tanstack/react-table';
import { memo } from 'react';
import { type OrganizationRow } from '~/features/organizations/components';

interface Props<T> {
   row: Row<T>;
   isChecked: boolean;
   isLoading?: boolean;
   // isChecked is important for the memo to work properly
}

const typedMemo: <T>(c: T) => T = memo;

export const TableSelectableRow = typedMemo(
   <T,>({ row, isChecked, isLoading = false }: Props<T>) => {
      return (
         <Tr
            background={row.getIsSelected() ? 'blue.50' : undefined}
            cursor={'pointer'}
            transition={'100ms ease-in background'}
            _hover={{ background: 'blue.100' }}
            onClick={row.getToggleSelectedHandler()}
         >
            {row.getVisibleCells().map((cell, index) => (
               <Td key={cell.id} width={index === 0 ? '10px' : undefined}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
               </Td>
            ))}
         </Tr>
      );
   }
);

export const emptyRow: OrganizationRow = {
   id: '',
   name: '',
   network_count: 0,
   rate_limit: 0,
   api_enabled: 'enabled',
   poll_requests: 0,
   poll_sent: 0,
   poll_limit: 0
};
