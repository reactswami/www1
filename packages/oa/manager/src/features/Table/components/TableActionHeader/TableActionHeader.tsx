import {
   Box,
   Flex,
   Skeleton,
} from '@chakra-ui/react';
import { type Group } from '@statseeker/api/internal_api/entities';
import { GlobalSearch } from '@statseeker/components/GlobalSearch';
import EntityTypeAhead from '@statseeker/components/Legacy/EntityTypeAhead/EntityTypeAhead';
import { useDimensions } from '@statseeker/hooks';
import { getDeviceGroups } from '@statseeker/utils/apiOptions';
import { useCallback, useEffect } from 'react';
import OaMenuActions from '~/components/OaMenuActions/OaMenuActions';
import { useOaTableContext, TableStatusFilter, useOaContext } from '~/features/Table';

export interface Props {
   setElementHeight: (value: number) => void;
}

export const TableActionHeader = ({
   setElementHeight: setHeaderActionHeight,
}: Props) => {
   const { ref, dimensions } = useDimensions<HTMLDivElement>();
   useEffect(() => {
      if (!dimensions) {
         return;
      }
      setHeaderActionHeight(dimensions.height);
   }, [dimensions, setHeaderActionHeight]);

   const { isLoading, table, globalFilter, setGlobalFilter } = useOaTableContext();
   const { setGroupId } = useOaContext();
   const selected = table.getSelectedRowModel();
   const isSelected = (selected?.rows?.length ?? 0) > 0;

   const handleGroupSelectionChange = useCallback(
      (e: Group | null) => {
         setGroupId(e?.id);
      },
      [setGroupId]
   );

   // Group filter is currently disabled, 
   // but can be uncommented to use it straight 
   // as all the query changes have been completed 
   // and hooked to the dropdown.
   const enableGroupFilter = false;

   return (
      <Flex
         position="sticky"
         top="0"
         ref={ref}
         backgroundColor={'page.500'}
         alignSelf={'stretch'}
         zIndex="2"
         alignItems="center"
         paddingTop={'4'}
         paddingBottom={'8'}
      >
         <Flex justifyContent="space-between" width="100%">
            <Flex width="100%" gap={2}>
               <GlobalSearch
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  defaultValue={globalFilter}
                  placeholder='Search Observability Appliances'
                  label='Search Observability Appliances'
               />
               {enableGroupFilter &&
                  <Box width={'200px'} alignSelf={'end'}>
                     <EntityTypeAhead<Group, undefined> placeholder={'Select Group'} entityQueryOption={getDeviceGroups} onChange={handleGroupSelectionChange} />
                  </Box>
               }
            </Flex>
            <Flex gap="xl" alignItems={'flex-end'}>
               <Flex gap="md" alignItems={'flex-end'}>
                  <TableStatusFilter />
                  < Skeleton isLoaded={!isLoading}>
                     <OaMenuActions oa={selected?.rows?.[0]?.original} shouldDisable={!isSelected} />
                  </Skeleton>
               </Flex>
            </Flex>
         </Flex>
      </Flex >
   );
};
