import { GridItem } from "@chakra-ui/react";
import { SummaryCard, type SummaryCardProps, type SummaryCardWrapperProps } from "./SummaryCard";

const DISPLAY_KEY = 'devices_reachable_count';
const STATES_KEY = 'Retrieving IP Address Origin Details';
const TITLE = 'Reachable Devices';
const DESCRIPTION = 'The number of devices that are planned to be rewalked and are currently reachable via ICMP request.';

export function RewalkDevicesReachable({
   details,
   discoverInProgress,
   mode
}: SummaryCardWrapperProps) {
   const keys = Object.keys(details);

   if (mode !== 'Rewalk' || !keys.includes(DISPLAY_KEY)) {
      return null;
   }

   let value = details[DISPLAY_KEY];

   let isStepCompleted = false;
   let statesIndex = details?.states?.indexOf(STATES_KEY);
   if (statesIndex !== undefined && statesIndex !== -1 && statesIndex + 1 !== details?.states?.length) {
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

