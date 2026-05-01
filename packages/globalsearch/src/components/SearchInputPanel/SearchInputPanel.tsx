import { Flex, Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { SearchIcon } from '@statseeker/components/Media/Icon/SearchIcon';
import { useDebounce } from '@statseeker/hooks/useDebounce';
import { type ChangeEvent, useCallback, useEffect, useRef, memo, useMemo } from 'react';
import useSearchActions from '../../hooks/useSearchActions';
import { GLOBAL_SEARCH_INPUT_ID } from '../../utils';
import { useSearchContext } from '../SearchContext/SearchContext';

const elementStyle = {
   '.chakra-input:focus': {
      outline: 'none',
   },
};

type SearchInputPanelProps = {
   isOpen: boolean;
   onOpen: () => void;
   onClose: () => void;
};

const SearchInputPanel = ({ isOpen, onOpen }: SearchInputPanelProps) => {
   const {
      state: { searchTerm },
   } = useSearchContext();
   const { setSearch } = useSearchActions();
   const inputRef = useRef<HTMLInputElement>(null);

   const debouncedSearch = useDebounce(
      useCallback(
         (value: string) => {
            if (!isOpen) {
               onOpen();
            }
            setSearch(value);
         },
         [isOpen, onOpen, setSearch]
      ),
      500
   );

   const onTextSearchChange = useCallback(
      (event: ChangeEvent<HTMLInputElement>) => {
         debouncedSearch(event.target.value);
      },
      [debouncedSearch]
   );

   // sync input value with search term
   useEffect(() => {
      const input = inputRef.current;
      if (!input) return;

      const currentValue = input.value;
      const expectedValue = searchTerm || '';

      if (currentValue !== expectedValue) {
         input.value = expectedValue;
      }
   }, [searchTerm]);

   // handle input focus and blur based on open state
   useEffect(() => {
      const input = inputRef.current;
      if (!input) return;

      if (isOpen) {
         // focus input when opened
         setTimeout(() => {
            input.focus();
         }, 0);

      } else {
         // clear and blur input when closed
         input.value = '';
         setTimeout(() => {
            input.blur();
         }, 0);

      }
   }, [isOpen]);

   const placeholder = useMemo(() => {
      return isOpen ? 'Search Statseeker' : 'Search';
   }, [isOpen]);


   const SearchInputPanel = useMemo(
      () => (
         <InputGroup w={'100%'}>
            <InputLeftElement pointerEvents="none">
               <Flex color={'black'}>
                  <SearchIcon size="sm" />
               </Flex>
            </InputLeftElement>
            <Input
               id={GLOBAL_SEARCH_INPUT_ID[0]}
               ref={inputRef}
               bg={'#fff'}
               color={'search.body'}
               borderRadius={'5px'}
               placeholder={placeholder}
               sx={elementStyle}
               maxW={'100%'}
               onChange={onTextSearchChange}
               _placeholder={{ color: 'none' }}
            />
         </InputGroup>
      ),
      [onTextSearchChange, placeholder]
   );

   return (
      <>
         {SearchInputPanel}
      </>
   );
};

// Memoize the component with custom comparison
export default memo(SearchInputPanel, (prevProps, nextProps) => {
   // Only re-render if isOpen prop changes or onOpen reference changes
   return (
      prevProps.isOpen === nextProps.isOpen &&
      prevProps.onOpen === nextProps.onOpen &&
      prevProps.onClose === nextProps.onClose
   );
});
