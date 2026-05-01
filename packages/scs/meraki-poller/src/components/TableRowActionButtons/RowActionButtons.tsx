import { Flex } from '@chakra-ui/react';
import { type Cell } from '@tanstack/react-table';
import {
   AddRuleButton,
   EditRuleButton,
   UnassignRuleButton,
   AssignToRuleButton,
} from '~/components';

interface Props<
   T extends {
      id: string;
      rule_id?: string;
   }
> {
   cell: Cell<T, any>;
   type: 'networks' | 'organizations';
}

export const RowActionButtons = <T extends { id: string; rule_id?: string }>({
   cell,
   type,
}: Props<T>) => {
   const ruleId = cell.row.original?.rule_id;

   return (
      <Flex
         gap={5}
         justifyContent="flex-end"
         width={'min-content'}
         flexGrow={0}
      >
         {ruleId ? (
            <>
               <EditRuleButton ruleId={ruleId} type={type} />
               <UnassignRuleButton<T> cell={cell} type={type} />
            </>
         ) : (
            <>
               <AddRuleButton cell={cell} type={type} />
               <AssignToRuleButton cell={cell} type={type} />
            </>
         )}
      </Flex>
   );
};
