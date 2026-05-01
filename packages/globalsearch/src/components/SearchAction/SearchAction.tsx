import { Box, Link, Text } from '@chakra-ui/react';
import { Tooltip } from '@statseeker/components/Overlay/Tooltip';
import React, { memo, useCallback } from 'react';
import useSearchActions from '../../hooks/useSearchActions';

interface Props {
   title: string;
   isHover: boolean;
   resultIndex: number;
   actionIndex: number;
}

function SearchAction({ title, resultIndex, actionIndex, isHover = false }: Props) {
   const { runSecondaryAction } = useSearchActions();
   const handleSecondaryAction = useCallback(
      (e: React.MouseEvent) => {
         runSecondaryAction({ resultIndex, actionIndex });
         e.stopPropagation();
      },
      [runSecondaryAction, resultIndex, actionIndex]
   );

   const actionItem = (
      <Link
         color={'search.actionColor'}
         _hover={{ textDecoration: 'underline' }}
         onClick={handleSecondaryAction}
      >
         <Text
            userSelect={'none'}
            maxWidth={'20ch'}
            whiteSpace={'nowrap'}
            overflow={'hidden'}
            textOverflow={'ellipsis'}
            fontSize={'sm'}
         >
            {title}
         </Text>
      </Link>
   );
   return (
      <Box
         _hover={{ opacity: 0.8, fontWeight: 500 }}
         fontSize={14}
         textTransform={'capitalize'}
         border={isHover ? 'dashed 1px' : 'none'}
         padding={'1px'}
      >
         {title.length > 20 && (
            <Tooltip
               label={actionItem}
               fontSize="sm"
               bg={'search.selectedBg'}
               color={'search.body'}
               fontWeight={'500'}
            >
               {actionItem}
            </Tooltip>
         )}
         {title.length <= 20 && actionItem}
      </Box>
   );
}

export default memo(SearchAction, (prevProps, nextProps) => {
   // Custom comparison to handle object/array props properly
   return (
      prevProps.title === nextProps.title &&
      prevProps.actionIndex === nextProps.actionIndex &&
      prevProps.resultIndex === nextProps.resultIndex &&
      prevProps.isHover === nextProps.isHover
   );
});
