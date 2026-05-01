import {
   Collapse,
   HStack,
   Tag,
   Tooltip,
   useDisclosure,
   VStack,
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import { memo } from 'react';
import { PingTablePingTag } from '~/components';
import { PING_TABLE_MAX_POLLERS_TO_SHOW } from '~/config/defaults';

interface Props {
   pingPollerList: string; // A comma separated list of ping pollers
   enabledList: string;
}

export const PingTablePingTags = memo(({ pingPollerList, enabledList }: Props) => {
   const { isOpen, onToggle } = useDisclosure();
   if (!pingPollerList || pingPollerList === 'null') {
      return <></>;
   }

   // Combine and filter input data
   const enabledPollers = enabledList
      .split(',')
      .filter((value) => Boolean(value) && value !== 'null');
   const pingPollers = pingPollerList
      .split(',')
      .filter((value) => Boolean(value) && value !== 'null')
      .map((pollerName, index) => {
         return {
            name: pollerName,
            enabled: enabledPollers[index]
         };
      })
      .filter((poller) => poller.enabled !== 'off'); // Filter out disabled pollers

   if (!pingPollers.length) {
      return <></>;
   }

   // Sort exceeded to the front
   const defaultCompare = (a: string, b: string) => (a < b) ? -1 : (a > b) ? 1 : 0;
   pingPollers.sort((a, b) => {
      if (a.enabled === 'exceeded' && b.enabled !== 'exceeded') {
         return -1;
      }
      else if (a.enabled !== 'exceeded' && b.enabled === 'exceeded') {
         return 1;
      }
      return defaultCompare(a.name, b.name);
   });

   const shouldShowMoreTags =
      pingPollers.length > PING_TABLE_MAX_POLLERS_TO_SHOW;

   return (
      <VStack alignItems="flex-start">
         <HStack gap="xxs">
            {pingPollers
               .splice(0, PING_TABLE_MAX_POLLERS_TO_SHOW)
               .map((poller, idx) => (
                  <PingTablePingTag key={idx} name={poller.name} enabledStatus={poller.enabled} />
               ))}
            {shouldShowMoreTags && (
               <Tooltip label="click to see more" openDelay={300}>
                  <Tag
                     margin={0}
                     size="sm"
                     onClick={(e) => {
                        e.stopPropagation(); // Stop propagation so it doesn't select/unselect row
                        onToggle();
                     }}
                  >
                     {`+ ${
                        pingPollers.length -
                        (PING_TABLE_MAX_POLLERS_TO_SHOW - 1)
                     } more`}
                     {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
                  </Tag>
               </Tooltip>
            )}
         </HStack>

         <HStack gap="xxs" marginTop={isOpen ? 4 : 0}>
            <Collapse in={isOpen} animateOpacity>
               <>
                  {pingPollers
                     .splice(0, PING_TABLE_MAX_POLLERS_TO_SHOW)
                     .map((poller, idx) => (
                        <PingTablePingTag key={idx} name={poller.name} enabledStatus={poller.enabled} />
                     ))}
               </>
            </Collapse>
         </HStack>
      </VStack>
   );
});
