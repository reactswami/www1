import { GridItem } from '@chakra-ui/react';
import { SummaryCard, type SummaryCardProps, type SummaryCardWrapperProps } from './SummaryCard';

const DISPLAY_KEY = 'devices_count';
const TITLE = 'Devices to rewalk';
const DESCRIPTION = 'The number of devices that are planned to be rewalked.';

export function RewalkDevices({ details, discoverInProgress, mode }: SummaryCardWrapperProps) {
   const keys = Object.keys(details);

   if (mode !== 'Rewalk' || !keys.includes(DISPLAY_KEY)) {
      return null;
   }

   let value = details[DISPLAY_KEY];

   let status: SummaryCardProps['status'] = discoverInProgress ? 'progress' : 'todo';
   if (value !== -1) {
      if (value === 0) {
         status = 'error';
      } else {
         status = 'done';
      }
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
