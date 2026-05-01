import { GridItem } from '@chakra-ui/react';
import { SummaryCard, type SummaryCardProps, type SummaryCardWrapperProps } from './SummaryCard';

const DISPLAY_KEY = 'new_interfaces_updated';
// const STATES_KEY = '';
const TITLE = 'New Interfaces added';
const DESCRIPTION =
   'The number of new network interfaces found and added as part of this discovery across both new and existing devices.';
export function NewInterfaces({ details }: SummaryCardWrapperProps) {
   const keys = Object.keys(details);

   if (!keys.includes(DISPLAY_KEY)) {
      return null;
   }

   let value = details[DISPLAY_KEY];

   let status: SummaryCardProps['status'] = 'todo';
   if (value !== -1) {
      status = 'done';
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
