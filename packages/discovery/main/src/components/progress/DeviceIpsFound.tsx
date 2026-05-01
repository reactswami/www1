import { GridItem } from "@chakra-ui/react";
import { SummaryCard, type SummaryCardProps, type SummaryCardWrapperProps } from "./SummaryCard";

const DISPLAY_KEY = 'ip_found_count';
const STATES_KEY = 'Running Ping Discover';
const TITLE = 'Device IPs found';
const DESCRIPTION = 'The number of device IP Addresses that have responded to an ICMP ping request.';

export function DeviceIpsFound({
   details,
   discoverInProgress,
}: SummaryCardWrapperProps) {
   const keys = Object.keys(details);

   if (! keys.includes(DISPLAY_KEY)) {
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

