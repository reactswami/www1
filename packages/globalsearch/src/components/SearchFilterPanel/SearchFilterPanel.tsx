import { Center, Divider, Flex } from '@chakra-ui/react';
import { memo } from 'react';
import { useSearchContext } from '../SearchContext/SearchContext';
import SearchFilterUI from '../SearchFilter/SearchFilter';
import { type SearchFilter, type SearchDetails } from '~/types/type';

function SearchFilterPanel({ searchResults }: { searchResults: SearchDetails[] }) {
   const {
      state: { searchFilters, isAllSelected, hasNewData, hoverFilterIndex },
   } = useSearchContext();
   const updatedFilters = searchFilters.map((filter) => ({
      ...filter,
      count: searchResults.filter((result) => result.category === filter.filter).length,
   }));

   return (
      <Flex
         w={'100%'}
         direction={'row'}
         wrap={'nowrap'}
         gap={2}
         py={4}
         px={2}
         textAlign={'left'}
         maxH={'20vh'}
         overflowY={'visible'}
         overflowX={'auto'}
      >
         <SearchFilterUI
            filter="All"
            selected={isAllSelected}
            label="All"
            isHover={hoverFilterIndex === 0}
            filterIndex={0}
         />

         <Center height="35px">
            <Divider orientation="vertical" />
         </Center>

         {updatedFilters.map((filter: SearchFilter, index) => {
            return (
               <SearchFilterUI
                  {...filter}
                  key={filter.filter}
                  selected={!isAllSelected && !hasNewData && filter.selected}
                  isHover={hoverFilterIndex === index + 1}
                  filterIndex={index + 1}
               />
            );
         })}
      </Flex>
   );
}

export default memo(SearchFilterPanel);
