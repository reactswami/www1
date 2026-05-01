import { GridItem } from "@chakra-ui/react";
import { SummaryCard, type SummaryCardProps, type SummaryCardWrapperProps } from "./SummaryCard";

const DISPLAY_KEY = 'ip_snmp_test_count';
const STATES_KEY = 'Testing devices for SNMP';
const TITLE = 'SNMP Credential tests';
const DESCRIPTION = 'The number of SNMP Credential tests that have been performed against Device IPs found in the previous discovery step. <br/>Note that because some of the SNMP Credential tests are performed in parallel and there may be multiple tests required per device, this number will be higher than the total number of devices.';
export function SNMPTests({
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
   let isCurrentState = false;
   if (statesIndex !== undefined && statesIndex !== -1 && statesIndex + 1 !== details?.states?.length) {
      isStepCompleted = true;
   }
   else if (statesIndex !== undefined && statesIndex + 1 === details?.states?.length){
      isCurrentState = true;
   }

   let status: SummaryCardProps['status'] = isCurrentState ? 'progress' : discoverInProgress ?  'todo' : 'done';
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
   } else if (!discoverInProgress) {
      status = 'todo';
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

