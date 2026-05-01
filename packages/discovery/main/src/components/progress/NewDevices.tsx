import { GridItem } from '@chakra-ui/react';
import { SummaryCard, type SummaryCardProps, type SummaryCardWrapperProps } from './SummaryCard';

const DISPLAY_KEY = 'new_devices_added';
const TITLE = 'New Devices added';
const DESCRIPTION =
   'The number of new devices found and added as part of this discovery. <br/>The Detailed log can be checked to see the names of the newly added devices.';
export function NewDevices({ details, discoverInProgress }: SummaryCardWrapperProps) {
   const keys = Object.keys(details);

   if (!keys.includes(DISPLAY_KEY)) {
      return null;
   }

   let value = details[DISPLAY_KEY];

   let status: SummaryCardProps['status'] = 'todo';
   if (!discoverInProgress && value !== -1) {
      status = 'done';
   } else {
      value = -1;
   }

   return (
      <GridItem key={DISPLAY_KEY}>
         <SummaryCard
            title={TITLE}
            status={status}
            description={DESCRIPTION}
            text={value === -1 ? '-' : `${value}`}
         />
      </GridItem>
   );
}
