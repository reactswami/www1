import {
   Box,
   Flex,
   Heading,
   ListItem,
   Text,
   UnorderedList,
} from '@chakra-ui/react';

import { toTitleCase } from '~/utils/string';

interface Props {
   selectedEntities: string[];
   type: 'network' | 'organization';
}

export const AffectedEntityList = ({ selectedEntities, type }: Props) => {
   const MAX_COUNT = 30;
   const list = selectedEntities.sort().slice(0, MAX_COUNT);
   const isShowMessage = selectedEntities.length > 0;
   const isShowMoreMessage = selectedEntities.length > MAX_COUNT;
   const moreMessage = `And ${
      selectedEntities.length - MAX_COUNT
   } other ${type}${selectedEntities.length > MAX_COUNT + 1 && 's'}`;

   if (!isShowMessage) {
      return null;
   }

   return (
      <Flex flexDirection={'column'} paddingX={4}>
         <Heading size="sm" paddingBottom={4}>
            Affected {toTitleCase(type)}s
         </Heading>
         <Text>The following {type}s will be affected by this rule:</Text>
         <UnorderedList>
            {list.map((name, idx) => (
               <ListItem key={idx}>{name}</ListItem>
            ))}
            {isShowMoreMessage && <ListItem>{moreMessage}</ListItem>}
         </UnorderedList>
         {selectedEntities.length > 3 && (
            <>
               <Box height={3} />
               <Text>
                  You can use the {type} table to get more details about
                  networks assigned to this rule.
               </Text>
            </>
         )}
      </Flex>
   );
};
