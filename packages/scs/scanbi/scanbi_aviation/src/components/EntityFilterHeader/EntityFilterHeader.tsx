import { Box, Skeleton } from '@chakra-ui/react';
import { type EntityTypAheadProps, EntityTypeAhead } from '~/components/EntityTypehead';
import { useEntityFilter } from '~/hooks/useEntityState';
import { type EntityType, ORDERED_ENTITIES, type RowData } from '~/types/models';

interface Props {
   entityType: EntityType;
   isLoading: boolean;
}

export const EntityFilterHeader = ({ entityType, isLoading }: Props) => {
   const { registerFilterEntity } = useEntityFilter();
   return (
      <>
         {ORDERED_ENTITIES.slice(
            0,
            ORDERED_ENTITIES.findIndex((en) => en.type == entityType)
         ).map((e) => (
            <Box marginBottom={'-3px'} key={e.type}>
               <Skeleton isLoaded={!isLoading}>
                  <EntityTypeAhead {...registerFilterEntity(e.type, e.title)} />
               </Skeleton>
            </Box>
         ))}
      </>
   );
};

export const EntityFilterForm = ({
   entityType,
   registerEntity,
}: {
   entityType: EntityType;
   registerEntity: (entity: EntityType) => EntityTypAheadProps<RowData>;
}) => {
   return (
      <>
         {ORDERED_ENTITIES.slice(
            0,
            ORDERED_ENTITIES.findIndex((en) => en.type == entityType)
         ).map((e) => (
            <Box maxWidth={'40ch'} marginTop={'10px'} key={e.type}>
               <EntityTypeAhead {...registerEntity(e.type)} />
            </Box>
         ))}
      </>
   );
};
