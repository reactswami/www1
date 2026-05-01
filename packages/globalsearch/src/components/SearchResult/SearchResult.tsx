import { Box, Flex } from '@chakra-ui/react';
import { Tag } from '@statseeker/components/Data/Tag';
import OnlineIcon from '@statseeker/components/Legacy/OnlineIcon/OnlineIcon';
import { Tooltip } from '@statseeker/components/Overlay/Tooltip';
import { Text } from '@statseeker/components/Typography/Text';
import React, { memo, useCallback, useMemo } from 'react';
import useSearchActions from '../../hooks/useSearchActions';
import { type TResultStatus, type SearchDetails } from '../../types/type';
import { highlightText, pillColors, ReportStatusColor } from '../../utils';
import SearchActionsPanel from '../SearchActionsPanel/SearchActionsPanel';
import { useSearchContext } from '../SearchContext/SearchContext';

// Define the prop type
interface SearchResultProps extends SearchDetails {
   resultIndex: number;
   selected: boolean;
}

const SearchResult = ({
   name,
   description,
   selected,
   actions,
   category,
   status,
   resultIndex,
}: SearchResultProps) => {
   const {
      state: { searchTerm },
   } = useSearchContext();
   const { runPrimaryAction } = useSearchActions();

   const descriptionCount = useMemo(
      () =>
         description && typeof description === 'object' ? Object.entries(description)?.length : 0,
      [description]
   );

   const hasDescription = description && typeof description === 'string';

   const handlePrimaryAction = useCallback(
      (e: React.MouseEvent) => {
         runPrimaryAction({ resultIndex });
         e.stopPropagation();
      },
      [runPrimaryAction, resultIndex]
   );

   return (
      <Box
         transition={'background-color 0.3s ease-in-out'}
         bg={selected ? 'search.selectedBg' : 'transparent'}
         _hover={{
            bg: selected ? 'search.hoverSelectedBg' : 'search.hoverbg',
            color: 'search.body',
         }}
         borderBottom={'1px solid #d4d4d8'}
         height={'inherit'}
         p={4}
      >
         <Flex
            w={'100%'}
            direction={'row'}
            wrap={'nowrap'}
            cursor={'pointer'}
            alignItems={'flex-start'}
            onClick={handlePrimaryAction}
         >
            <Flex direction="column" width="100%" align={'start'} wrap={'wrap'} gap={2}>
               <Flex w={'100%'} gap={2}>
                  <Text fontSize="sm" fontWeight={'bold'} color={'search.body'}>
                     {highlightText(name, searchTerm)}
                  </Text>
                  {status && (
                     <Tooltip label={status} textTransform={'capitalize'} borderRadius={'md'}>
                        <Box
                           display={'flex'}
                           alignItems={'center'}
                           color={
                              ReportStatusColor[status as TResultStatus] ??
                              ReportStatusColor._default
                           }
                           height={'1vw'}
                           w={'1vw'}
                        >
                           <OnlineIcon />
                        </Box>
                     </Tooltip>
                  )}
               </Flex>
               {descriptionCount > 0 && description && (
                  <Flex direction={'row'} alignItems={'center'} gap={1} wrap={'wrap'}>
                     {Object.entries(description).map(([key, value], index) => {
                        return value === null ? (
                           <React.Fragment key={index}></React.Fragment>
                        ) : (
                           <React.Fragment key={index}>
                              <Tooltip label={key}>
                                 <Text
                                    fontSize={'sm'}
                                    maxWidth={'70ch'}
                                    overflow={'hidden'}
                                    textOverflow={'ellipsis'}
                                    color={'search.subText'}
                                    textTransform={'capitalize'}
                                 >
                                    {highlightText(value, searchTerm)}
                                 </Text>
                              </Tooltip>
                              {index < descriptionCount - 1 && (
                                 <Box
                                    display={'flex'}
                                    alignItems={'center'}
                                    color={ReportStatusColor['disabled']}
                                    height={'8px'}
                                    w={'8px'}
                                 >
                                    <OnlineIcon />
                                 </Box>
                              )}
                           </React.Fragment>
                        );
                     })}
                  </Flex>
               )}

               {hasDescription && (
                  <Text
                     fontSize={'sm'}
                     maxWidth={'70ch'}
                     overflow={'hidden'}
                     textOverflow={'ellipsis'}
                     color={'search.subText'}
                     textTransform={'capitalize'}
                  >
                     {highlightText(description, searchTerm)}
                  </Text>
               )}

               <SearchActionsPanel
                  actions={actions}
                  selected={selected}
                  resultIndex={resultIndex}
               />
            </Flex>
            <Box>
               <Tag
                  size={'md'}
                  textTransform={'capitalize'}
                  fontSize={'smaller'}
                  variant={pillColors[category]}
                  userSelect={'none'}
               >
                  {category}
               </Tag>
            </Box>
         </Flex>
      </Box>
   );
};

// Memoize the component with custom comparison function for better optimization
export default memo(SearchResult, (prevProps, nextProps) => {
   // Custom comparison to handle object/array props properly
   return (
      prevProps.name === nextProps.name &&
      prevProps.selected === nextProps.selected &&
      prevProps.category === nextProps.category &&
      prevProps.status === nextProps.status &&
      prevProps.resultIndex === nextProps.resultIndex &&
      JSON.stringify(prevProps.description) === JSON.stringify(nextProps.description) &&
      JSON.stringify(prevProps.actions) === JSON.stringify(nextProps.actions)
   );
});
