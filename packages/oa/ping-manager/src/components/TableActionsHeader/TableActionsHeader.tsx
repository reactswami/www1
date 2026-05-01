import { Box, Button, Flex, Skeleton, Text, Tooltip } from '@chakra-ui/react';
import { GlobalFilterInput } from '@statseeker/components/Legacy/react-table';
import { useAssignPollersModal } from '@statseeker/hooks/useAssignPollersModal';
import { type ForwardedRef, forwardRef } from 'react';
import {
   TableColumnFilters,
   TableViewSettings,
   TypeheadGroupSelectInput,
} from '~/components';
import { usePingTableContext } from '~/contexts';
import { queryKeys } from '~/lib/ReactQuery';

export const PingTableActionsHeader = forwardRef(
   (_, ref: ForwardedRef<HTMLDivElement>) => {
      const {
         setGroupFilter,
         groupFilter,
         globalFilter,
         table,
         data: { total },
         isLoading,
         exceededFilter,
         pollerFilter
      } = usePingTableContext();
      const { Modal, disclosure } = useAssignPollersModal({
         groupFilter,
         globalFilter,
         isAllSelected: table.getIsAllRowsSelected(),
         selectedDevices: table
            .getSelectedRowModel()
            .rows.map(({ id }) => Number(id)),
         queryKey: [...queryKeys.oa, ...queryKeys.device],
         exceedFilter: exceededFilter,
         pollerFilter
      });
      const { onOpen } = disclosure;
      const deviceSelectedCount = table.getIsAllRowsSelected()
         ? total
         : table.getSelectedRowModel().rows.length;

      return (
         <Box
            position="sticky"
            top={0}
            background={'page.500'}
            ref={ref}
            zIndex={2}
            paddingY={4}
         >
            <Modal />
            <Flex
               justifyContent={'space-between'}
               paddingY="sm"
               alignItems={'flex-end'}
            >
               <Flex gap={'md'} alignItems="center">
                  <GlobalFilterInput context={usePingTableContext()} />
                  <Box marginBottom={'-3px'}>
                     <TypeheadGroupSelectInput
                        setGroupFilter={setGroupFilter}
                     />
                  </Box>
               </Flex>
               <Flex
                  flexWrap={'wrap'}
                  flexGrow={1}
                  gap="sm"
                  alignItems={'flex-end'}
                  justifyContent={'flex-end'}
               >
                  <TableColumnFilters />
                  <TableViewSettings />
                  <Flex gap="sm" alignItems="center">
                     <Skeleton isLoaded={!isLoading}>
                        <Text>{deviceSelectedCount} devices selected</Text>
                     </Skeleton>
                     <Skeleton isLoaded={!isLoading}>
                        <Tooltip
                           label={
                              deviceSelectedCount === 0 &&
                              'Select devices to assign pollers'
                           }
                        >
                           <Button
                              onClick={onOpen}
                              isDisabled={deviceSelectedCount === 0}
                           >
                              Assign pollers
                           </Button>
                        </Tooltip>
                     </Skeleton>
                  </Flex>
               </Flex>
            </Flex>
         </Box>
      );
   }
);
