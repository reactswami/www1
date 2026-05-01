import { GridItem } from "@chakra-ui/react";
import { SummaryCard, type SummaryCardProps, type SummaryCardWrapperProps } from "./SummaryCard";

const DISPLAY_KEY = 'devices_error_count';
// const STATES_KEY = '';
const TITLE = 'Device errors';
const DESCRIPTION_PRE = 'The number of devices that had some form of error which prevented them from completing the entire discovery process. <br/>';
const DESCRIPTION_EMPTY = 'Common reasons for device errors include: <ul style="margin: .5rem .5rem .5rem 1.5rem;"> <li>Missing SNMP Walk data</li> <li>Incomplete SNMP Walk data</li> </ul>';
const DESCRIPTION_POST = '<br />The Detailed log can be checked for more information about which devices have errors and for what reasons.';

export function DevicesErrors({
   details,
   discoverInProgress,
}: SummaryCardWrapperProps) {
   const keys = Object.keys(details);

   if (! keys.includes(DISPLAY_KEY)) {
      return null;
   }

   let value = details[DISPLAY_KEY];

   let status: SummaryCardProps['status'] = 'todo';
   if (value !== -1) {
      if (!discoverInProgress) {
         if (value === 0) {
            status = 'done';
         } else {
            status = 'warning';
         }
      } else {
         status = 'warning';
         // status = 'progress';
      }
   }

   let deviceKeys = Object.keys(details?.devices_with_errors || {});

   let description = DESCRIPTION_PRE;
   if (deviceKeys.length === 0) {
      description += DESCRIPTION_EMPTY;
   } else {
      description += 'The following devices could not be processed due to the specified errors: <br />';
      for (let key of deviceKeys) {
         description += `<b style="padding-left:1rem;">${key}</b>`;
         description += '<pre style="width:max-content;margin-top:.5rem;padding-left:2rem;padding-right:1rem;max-height:150px;overflow-y:auto;">';
         description += details?.devices_with_errors?.[key]?.join('\n');
         description += '</pre> <br />';
      }
   }
   description += DESCRIPTION_POST;

   return (
      <GridItem key={DISPLAY_KEY}>
         <SummaryCard
            title={TITLE}
            status={status}
            description={description}
            text={value === -1 ? '-' : `${value}`}
         />
      </GridItem>
   );
}

