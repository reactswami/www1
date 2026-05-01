import { Box, Button, Flex, Skeleton } from '@chakra-ui/react';
import { GlobalFilterInput } from '@statseeker/components/Legacy/react-table';
import { useDimensions } from '@statseeker/hooks';
import { PlusIcon } from '@statseeker/ui/icons';
import { useEffect } from 'react';
import { EntityFilterHeader } from '~/components/EntityFilterHeader';
import { useTableContext } from '~/components/Table';
import { type EntityType } from '~/types/models';

export interface Props {
   setElementHeight: (value: number) => void;
   entityType: EntityType;
}

export const TableActionHeader = ({
   setElementHeight: setHeaderActionHeight,
   entityType,
}: Props) => {
   const { ref, dimensions } = useDimensions<HTMLDivElement>();
   useEffect(() => {
      if (!dimensions) {
         return;
      }
      setHeaderActionHeight(dimensions.height);
   }, [dimensions, setHeaderActionHeight]);

   const { isLoading, addDisclosure } = useTableContext();

   return (
      <Flex
         position="sticky"
         top="0"
         ref={ref}
         paddingY={4}
         backgroundColor={'white'}
         alignSelf={'stretch'}
         zIndex="2"
         alignItems="center"
      >
         <Flex paddingY="sm" justifyContent="space-between" width="100%">
            <Box marginBottom={'-3px'} maxWidth={'10ch'}>
               <GlobalFilterInput context={useTableContext()} width={'30ch'} />
            </Box>
            <Flex gap="xl" alignItems={'flex-end'}>
               <Flex gap="md" alignItems={'flex-end'}>
                  <EntityFilterHeader isLoading={isLoading} entityType={entityType} />
                  <Skeleton isLoaded={!isLoading}>
                     <Button
                        onClick={addDisclosure.onOpen}
                        alignSelf="flex-end"
                        leftIcon={<PlusIcon />}
                     >
                        Create
                     </Button>
                  </Skeleton>
               </Flex>
            </Flex>
         </Flex>
      </Flex>
   );
};
