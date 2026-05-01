import { createFileRoute } from '@tanstack/react-router';
import { TableRoute } from '~/components';
import { screeningPointcolumns } from '~/features/screeningpoint';
import { ENTITY_TYPE } from '~/utils';

export const Route = createFileRoute('/screeningPoints')({
   component: ScreeningPointsRoute,
});

export function ScreeningPointsRoute() {
   return (
      <TableRoute
         layoutTitle={'Screening Points'}
         modalTitle={'Create Screening Point'}
         columns={screeningPointcolumns}
         tableProps={{
            entity: ENTITY_TYPE.SCREENING_POINT,
            errorTitle: 'Error: Unable to retrieve the list of screening points',
            errorDescription: 'If the problem persists, please contact the support team.',
            noDataError: 'No Screening Points available',
            noFilteredDataError: 'No Screening Points found for your search query',
            emptyStateAction: 'Add a screening point',
         }}
      />
   );
}
