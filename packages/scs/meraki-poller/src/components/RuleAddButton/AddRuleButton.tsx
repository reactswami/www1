import { IconButton, Tooltip } from '@chakra-ui/react';
import { PlusIcon } from '@radix-ui/react-icons';
import { type Cell } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';
import { type SelectedEntityRouterState, Routes } from '~/types';

interface Props {
   cell: Cell<any, any>;
   type: 'networks' | 'organizations';
}

export const AddRuleButton = ({ cell, type }: Props) => {
   const navigate = useNavigate();

   const entityId = cell.row.original.id;
   const entityName = cell.row.original.name;
   const addRuleRoute = {
      route:
         type === 'networks'
            ? Routes.addNetworkCustomRule
            : Routes.addOrganizationCustomRule,
      state: [
         { id: entityId, name: entityName, type },
      ] as SelectedEntityRouterState,
   };

   return (
      <Tooltip label="Create a new rule">
         <IconButton
            icon={<PlusIcon />}
            variant={'ghost'}
            aria-label="new rule"
            size="xs"
            onClick={(e) => {
               e.stopPropagation(); // Prevent the row from being selected
               navigate(addRuleRoute.route, { state: addRuleRoute.state });
            }}
         >
            New
         </IconButton>
      </Tooltip>
   );
};
