import { GridItem } from '@chakra-ui/react';
import { SummaryCard, type SummaryCardProps, type SummaryCardWrapperProps } from './SummaryCard';

const DISPLAY_KEY = 'devices_processed_count';
const STATES_KEY = 'Processing Devices';
const FINISHED_KEY = 'Building configurations';
const TITLE = 'Processing Devices';
const DESCRIPTION =
   'The number of devices found during this discovery process that have been processed. <br/>This step compares the information collected from the device SNMP Walks against the devices and configuration that already exist to determine what actions need to be taken for the device.';
export function ProcessingDevices({ details, discoverInProgress }: SummaryCardWrapperProps) {
   const keys = Object.keys(details);

   if (!keys.includes(DISPLAY_KEY)) {
      return null;
   }

   let value = details[DISPLAY_KEY];

   let isStepCompleted = false;
   let statesIndex = details?.states?.indexOf(STATES_KEY);
   let finalIndex = details?.states?.indexOf(FINISHED_KEY);
   if (
      statesIndex !== undefined &&
      statesIndex !== -1 &&
      finalIndex !== undefined &&
      finalIndex !== -1 &&
      finalIndex > statesIndex &&
      finalIndex + 1 !== details?.states?.length
   ) {
      isStepCompleted = true;
   }

   let status: SummaryCardProps['status'] = 'todo';
   if (value !== -1) {
      if (isStepCompleted || !discoverInProgress) {
         if (value === 0) {
            status = 'error';
         } else {
            status = 'done';
         }
      } else {
         status = 'progress';
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
