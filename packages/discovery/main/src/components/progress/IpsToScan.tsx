import { GridItem } from '@chakra-ui/react';
import { SummaryCard, type SummaryCardProps, type SummaryCardWrapperProps } from './SummaryCard';

const DISPLAY_KEY = 'ip_scan_range_count';
const TITLE = 'IP Addresses to scan';
const DESCRIPTION =
   'The number of IP Addresses that need to be scanned via ICMP ping.<br/>Depending on the configuration of the discovery this number could have come from a number of IP Address Ranges, the Hosts File, or the list of existing or manually defined Devices.';

export function IpsToScan({ details, discoverInProgress }: SummaryCardWrapperProps) {
   const keys = Object.keys(details);

   if (!keys.includes(DISPLAY_KEY)) {
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
