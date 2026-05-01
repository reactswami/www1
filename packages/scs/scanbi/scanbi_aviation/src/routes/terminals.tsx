import { createFileRoute } from '@tanstack/react-router';
import { TableRoute } from '~/components';
import { TerminalColumns } from '~/features';
import { ENTITY_TYPE } from '~/utils';

export const Route = createFileRoute('/terminals')({
   component: TerminalRoute,
});

export function TerminalRoute() {
   return (
      <TableRoute
         layoutTitle={'Terminals'}
         modalTitle={'Create Terminal'}
         columns={TerminalColumns}
         tableProps={{
            entity: ENTITY_TYPE.TERMINAL,
            errorTitle: 'Error: Unable to retrieve the list of terminals',
            errorDescription: 'If the problem persists, please contact the support team.',
            noDataError: 'No Terminals available',
            noFilteredDataError: 'No terminal found for your search query',
            emptyStateAction: 'Add a terminal',
         }}
      />
   );
}
