import { createFileRoute } from '@tanstack/react-router';
import { TableRoute } from '~/components';
import { laneColumns } from '~/features/lanes';
import { ENTITY_TYPE } from '~/utils';

export const Route = createFileRoute('/lanes')({
   component: LanesRoutes,
});

export function LanesRoutes() {
   return (
      <TableRoute
         layoutTitle={'Lanes'}
         modalTitle={'Create Lanes'}
         columns={laneColumns}
         tableProps={{
            entity: ENTITY_TYPE.LANE,
            errorTitle: 'Error: Unable to retrieve the list of lanes',
            errorDescription: 'If the problem persists, please contact the support team.',
            noDataError: 'No Lanes available',
            noFilteredDataError: 'No Lanes found for your search query',
            emptyStateAction: 'Add a lane',
         }}
      />
   );
}
