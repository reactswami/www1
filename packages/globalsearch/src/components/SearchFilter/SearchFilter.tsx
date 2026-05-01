import { Box } from '@chakra-ui/react';
import { Button } from '@statseeker/components/Form/Button';
import React, { memo, useCallback } from 'react';
import useSearchActions from '../../hooks/useSearchActions';

type Props = {
   filter: string;
   label: string;
   count?: number;
   selected?: boolean;
   isHover: boolean;
   filterIndex: number;
};

function SearchFilter({ selected = false, isHover = false, label, filterIndex }: Props) {
   const { selectFilter } = useSearchActions();

   const handleFilterClick = useCallback(
      (e: React.MouseEvent) => {
         selectFilter(filterIndex);
         e.stopPropagation();
      },
      [selectFilter, filterIndex]
   );

   return (
      <Box flex="0 1 auto">
         <Button
            variant="tertiary"
            aria-label={label}
            onClick={handleFilterClick}
            bg={selected ? 'search.selectedBg' : 'transparent'}
            border={isHover ? 'dashed 1px' : 'none'}
            color={'search.body'}
            borderRadius={selected ? 'sm' : 'none'}
            _hover={{
               bg: selected ? 'search.hoverSelectedBg' : 'search.hoverbg',
               color: 'search.body',
            }}
            userSelect={'none'}
            textTransform={'capitalize'}
            textAlign={'left'}
         >
            {label}
         </Button>
      </Box>
   );
}

export default memo(SearchFilter);
