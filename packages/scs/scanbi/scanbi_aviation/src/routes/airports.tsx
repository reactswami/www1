import { createFileRoute } from '@tanstack/react-router';
import { TableRoute } from '~/components';
import { columns } from '~/features/airport';
import { ENTITY_TYPE } from '~/utils';

export const Route = createFileRoute('/airports')({
   component: AirportsRoute,
});

function AirportsRoute() {
   return (
      <TableRoute
         layoutTitle={'Airports'}
         modalTitle={'Create Airport'}
         columns={columns}
         tableProps={{
            entity: ENTITY_TYPE.AIRPORT,
            errorTitle: 'Error: Unable to retrieve the list of airports',
            errorDescription: 'If the problem persists, please contact the support team.',
            noDataError: 'No Airports available',
            noFilteredDataError: 'No Airport found for your search query',
            emptyStateAction: 'Add an airport',
         }}
      />
   );
}
