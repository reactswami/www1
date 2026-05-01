import { Flex } from '@chakra-ui/react';
import React, { memo } from 'react';
import { type SearchAction } from '../../types/type';
import SearchActionUI from '../SearchAction/SearchAction';
import { useSearchContext } from '../SearchContext/SearchContext';

interface Props {
   actions: SearchAction[];
   selected: boolean;
   resultIndex: number;
}
function SearchActionsPanel({ actions, selected, resultIndex }: Props) {
   const {
      state: { hoverActionIndex, selectedResultIndex },
   } = useSearchContext();
   return (
      <Flex direction={'row'} w="100%" justify={'flex-start'} wrap={'wrap'} gap={3}>
         {actions?.map((action: SearchAction, index) => (
            <React.Fragment key={index}>
               <SearchActionUI
                  {...(index === 0 && { selected: selected })}
                  key={action.action}
                  {...action}
                  isHover={index === hoverActionIndex && selectedResultIndex === resultIndex}
                  resultIndex={resultIndex}
                  actionIndex={index}
               />
            </React.Fragment>
         ))}
      </Flex>
   );
}

export default memo(SearchActionsPanel, (prevProps, nextProps) => {
   // Custom comparison to handle object/array props properly
   return (
      prevProps.selected === nextProps.selected &&
      prevProps.resultIndex === nextProps.resultIndex &&
      JSON.stringify(prevProps.actions) === JSON.stringify(nextProps.actions)
   );
});
