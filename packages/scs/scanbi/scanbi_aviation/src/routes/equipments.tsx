import { createFileRoute } from '@tanstack/react-router';
import { TableRoute } from '~/components';
import { equipmentColumns } from '~/features';
import { ENTITY_TYPE } from '~/utils';

export const Route = createFileRoute('/equipments')({
   component: EquipmentRoute,
});

function EquipmentRoute() {
   return (
      <TableRoute
         layoutTitle={'Equipment'}
         modalTitle={'Create Equipment'}
         columns={equipmentColumns}
         tableProps={{
            entity: ENTITY_TYPE.DEVICE_EQUIPMENT,
            errorTitle: 'Error: Unable to retrieve the list of equipment',
            errorDescription: 'If the problem persists, please contact the support team.',
            noDataError: 'No Equipment available',
            noFilteredDataError: 'No Equipment found for your search query',
            emptyStateAction: 'Add an equipment',
         }}
      />
   );
}
