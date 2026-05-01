import { IconButton, Tooltip } from '@chakra-ui/react';
import { Cross2Icon } from '@radix-ui/react-icons';
import { type Cell } from '@tanstack/react-table';
import { type MouseEventHandler } from 'react';
import { useUnassignRule } from '~/hooks';

interface Props<T extends { id: string }> {
   cell: Cell<T, any>;
   type: 'networks' | 'organizations';
}
export const UnassignRuleButton = <T extends { id: string }>({
   cell,
   type,
}: Props<T>) => {
   const { mutate, isPending } = useUnassignRule();

   const handleClick: MouseEventHandler = async (e) => {
      e.stopPropagation();
      const id = cell.row.original.id;
      mutate({ [type]: { [id]: { rule: null } } });
   };

   return (
      <Tooltip label="Unassign rule">
         <IconButton
            size="xs"
            aria-label="unassign rule"
            variant={'ghost'}
            icon={<Cross2Icon />}
            onClick={handleClick}
            isLoading={isPending}
         >
            Unassign
         </IconButton>
      </Tooltip>
   );
};
