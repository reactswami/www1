import { GridItem } from "@chakra-ui/react";
import { SummaryCard, type SummaryCardProps, type SummaryCardWrapperProps } from "./SummaryCard";

const DISPLAY_KEY = 'ip_snmp_found_count';
const STATES_KEY = 'Testing devices for SNMP';
const TITLE = 'SNMP devices found';
const DESCRIPTION = 'The number of devices that successfully responded to one of the SNMP Credential tests performed in the previous discovery step.';
export function SNMPFound({
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

