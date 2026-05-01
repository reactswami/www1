
import { Cross2Icon, Link2Icon, PlusCircledIcon } from '@radix-ui/react-icons';
import { useNavigate } from 'react-router-dom';
import { DEFAULT_REFRESH_DATA_TABLE_VIEW_IN_MS } from '~/config/defaults';
import { type NetworkRow } from '~/features/networks/components/NetworkTable/columnDef';
import { useFetchGlobalConfig } from '~/hooks/useFetchGlobalConfig';
import { useUnassignRule } from '~/hooks/useUnassignRule';
import { type SelectedEntityRouterState } from '~/types/app';
import { Routes } from '~/types/routes';

interface Props {
   selectedRows: NetworkRow[];
   onOpen: () => void;
}

export const NetworkTableBulkActions = ({ selectedRows, onOpen }: Props) => {
   const navigate = useNavigate();
   const { data: state } = useFetchGlobalConfig({
      options: { refetchInterval: DEFAULT_REFRESH_DATA_TABLE_VIEW_IN_MS },
   }); // 30 second refresh

   const { mutate, isPending } = useUnassignRule();

   return [
      {
         isPending,
         icon: <PlusCircledIcon />,
         onClick: () => {
            navigate(Routes.addNetworkCustomRule, {
               state: Object.entries(state?.data.networks || {})
                  .filter(([id, _]) => selectedRows.map(({ id }) => id).includes(id))
                  .map(([id, values]) => ({
                     id,
                     name: values.name,
                     type: 'networks',
                  })) as SelectedEntityRouterState,
            });
         },
         label: 'Create new rule',
      },
      {
         isShow: () => selectedRows.some(({ rule_name }) => rule_name), // Only show if one of the selected item has a rule
         icon: <Cross2Icon />,
         onClick: async () => {
            const networks = selectedRows
               .map(({ id }) => ({
                  [id]: { rule: null },
               }))
               .reduce(
                  (previous, current) => ({
                     ...previous,
                     ...current,
                  }),
                  {}
               );

            await mutate({ networks });
         },
         label: 'Unassign rule',
      },
      {
         icon: <Link2Icon />,
         onClick: onOpen,
         label: 'Assign to existing rule',
      },
   ];
};
