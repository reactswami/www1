import { Flex, Tag, TagLabel } from '@chakra-ui/react';

import { getDisplayNameForDatatype } from '~/components';
import { type ApiDatatype } from '~/types/api';

interface Props {
   cellValue: string[];
}

export const DisableDatatypeCell = ({ cellValue }: Props) => {
   if (!cellValue) {
      return null;
   }
   const values = cellValue.filter((value: string) => value !== '');
   return (
      <Flex gap="sm" flexWrap="wrap">
         {values.map((label: string, idx: number) => (
            <Tag
               colorScheme={'gray'}
               variant="subtle"
               key={idx}
               borderRadius="base"
               size="sm"
            >
               <TagLabel>
                  {getDisplayNameForDatatype(label as ApiDatatype)}
               </TagLabel>
            </Tag>
         ))}
      </Flex>
   );
};
