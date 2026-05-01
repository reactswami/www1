import { GridItem } from "@chakra-ui/react";
import { SummaryCard, type SummaryCardProps, type SummaryCardWrapperProps } from "./SummaryCard";

const DISPLAY_KEY = 'devices_filter_out_count';
const TITLE = 'Devices filtered out';
const DESCRIPTION_PRE = 'The number of devices that were excluded from further processing in this discovery process. <br/>';
const DESCRIPTION_EMPTY = 'Common reasons for excluding devices include: <ul style="margin: .5rem .5rem .5rem 1.5rem;"> <li>The device did not respond to any SNMP requests</li> <li>The device\'s sysDescr value does not match any include rules</li> <li>The device\'s sysDescr value matches an exclude rule</li> <li>The device\'s IP Address is already used by an existing device</li> <li>The device\'s snmpEngineId is already used by an existing device</li> </ul>';
const DESCRIPTION_POST = '<br />The Detailed log can be checked for more information about which devices have been excluded and for what reasons.';

export function FilteredOut({
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
      }
   }

   let deviceKeys = Object.keys(details?.devices_filtered_out || {});

   let description = DESCRIPTION_PRE;
   if (deviceKeys.length === 0) {
      description += DESCRIPTION_EMPTY;
   } else {
      description += 'The following devices were filtered out for the specified reasons: <br />';
      for (let key of deviceKeys) {
         description += `<b style="padding-left:1rem;">${key}</b>`;
         description += '<pre style="width:max-content;margin-top:.5rem;padding-left:2rem;padding-right:1rem;max-height:150px;overflow-y:auto;">';
         description += details?.devices_filtered_out?.[key]?.join('\n');
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

