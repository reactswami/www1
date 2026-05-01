import {
   Box,
   type ChakraProps,
   Flex,
   FormControl,
   FormLabel,
   Input,
   InputGroup,
   List,
   ListItem,
   Spinner,
   Text,
   FormErrorMessage,
} from '@chakra-ui/react';
import { ChevronDownIcon, Cross2Icon, ExclamationTriangleIcon, InfoCircledIcon } from '@radix-ui/react-icons';
import { useEffect, useRef, useState } from 'react';

type Option = {
   value: string;
   name: string;
};

export interface Props {
   onChange: (arg: string) => void;
   isRequired?: boolean;
   isLoading: boolean;
   isSuccess: boolean;
   isError: boolean;
   options: Option[];
   placeholder?: string;
   label?: string;
   defaultValue?: Option;
   defaultIsName?: boolean;
   inputName?: string;
   emptyMessage?: string;
   error?: string;
   width?: string;
   disabled?: boolean;
}

export const TypeAheadSelectInput = ({
   onChange,
   placeholder = 'Select ...',
   isLoading,
   isSuccess,
   isError,
   options,
   label,
   defaultValue,
   defaultIsName = false,
   inputName,
   emptyMessage,
   error,
   isRequired,
   width = '100%',
   disabled = false,
}: Props) => {
   const ref = useRef<HTMLDivElement>(null);
   const inputRef = useRef<HTMLInputElement>(null);
   const [isShowResults, setIsShowResults] = useState(false);
   const [search, setSearch] = useState<string>('');
   const [value, setValue] = useState<Option['value']>('');

   // If there is a default value, use it!
   useEffect(() => {
      if (!defaultValue) {
         return;
      }

      // Useful when there is a disconnect between filter and data state
      if (defaultIsName) {
         setValue(defaultValue.name);
      } else {
         // by default follow the default
         setValue(defaultValue.value);
      }
   }, [defaultValue, defaultIsName]);

   useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
         if (ref.current && !ref.current.contains(e.target as HTMLElement)) {
            setIsShowResults(false);
            setSearch('');
         }
      };

      const handleKeyDown = (e: KeyboardEvent) => {
         if (e.key === 'Escape') {
            setIsShowResults(false);
         }
      };
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);

      return () => {
         document.removeEventListener('mousedown', handleClickOutside);
         document.removeEventListener('keydown', handleKeyDown);
      };
   }, []);

   const styleListItem: ChakraProps = {
      zIndex: 9,
      position: 'relative',
      paddingY: 1,
      paddingX: 4,
      cursor: 'pointer',
      transition: 'ease-in 100ms background',
      gap: 'sm',
      alignItems: 'center',
      _focus: {
         background: 'blue.50',
      },
      _hover: {
         background: 'blue.50',
      },
      display: 'flex',
   };

   return (
      <Box position={'relative'} ref={ref} width={width}>
         {isRequired ? (
            <FormControl isRequired isInvalid={!!error}>
               {label ? <FormLabel>{label}</FormLabel> : null}
               <InputGroup position="relative">
                  <Input
                     isRequired
                     paddingRight={16}
                     placeholder={value.length > 0 ? value : placeholder}
                     _placeholder={{ color: value ? 'gray.900' : 'gray.500' }}
                     value={search}
                     onChange={(e) => {
                        setSearch(e.target.value);
                     }}
                     onClick={() => setIsShowResults(true)}
                     onFocus={() => setIsShowResults(true)}
                     ref={inputRef}
                     name={inputName ?? label}
                     _focusVisible={{ borderColor: 'primary.500' }}
                     disabled={disabled}
                  />
                  <Flex
                     gap="sm"
                     right={0}
                     position="absolute"
                     alignItems={'center'}
                     height={'100%'}
                     padding={2}
                     onClick={() => {
                        setValue('');
                        setSearch('');
                        onChange('');
                     }}
                  >
                     {value.length > 0 && !search && (
                        <Box _hover={{ color: 'primary.400' }}>
                           <Cross2Icon
                              cursor="pointer"
                              onClick={() => {
                                 setValue('');
                                 setSearch('');
                                 onChange('');
                              }}
                           />
                        </Box>
                     )}
                     <Text color="gray.200">|</Text>
                     <ChevronDownIcon onClick={() => inputRef.current?.focus()} />
                  </Flex>
               </InputGroup>
               {error && <FormErrorMessage>{error}</FormErrorMessage>}
            </FormControl>
         ) : (
            <FormControl isInvalid={!!error}>
               {label ? <FormLabel>{label}</FormLabel> : null}
               <InputGroup position="relative">
                  <Input
                     paddingRight={16}
                     placeholder={value.length > 0 ? value : placeholder}
                     _placeholder={{ color: value ? 'gray.900' : 'gray.500' }}
                     value={search}
                     onChange={(e) => {
                        setSearch(e.target.value);
                     }}
                     onClick={() => setIsShowResults(true)}
                     onFocus={() => setIsShowResults(true)}
                     ref={inputRef}
                     name={inputName ?? label}
                     _focusVisible={{ borderColor: 'primary.500' }}
                     disabled={disabled}
                  />
                  <Flex
                     gap="sm"
                     right={0}
                     position="absolute"
                     alignItems={'center'}
                     height={'100%'}
                     padding={2}
                     onClick={() => inputRef.current?.focus()}
                  >
                     {value.length > 0 && !search && (
                        <Box _hover={{ color: 'primary.400' }}>
                           <Cross2Icon
                              cursor="pointer"
                              onClick={() => {
                                 setValue('');
                                 setSearch('');
                                 onChange('');
                              }}
                           />
                        </Box>
                     )}
                     <Text color="gray.200">|</Text>
                     <ChevronDownIcon />
                  </Flex>
               </InputGroup>
               {error && <FormErrorMessage>{error}</FormErrorMessage>}
            </FormControl>
         )}

         {isShowResults && (
            <List
               position={'absolute'}
               top={'100%'}
               width={'100%'}
               zIndex={9}
               background={'white'}
               shadow="lg"
               borderRadius={'md'}
               overflowY="auto"
               maxHeight={'50vh'}
               marginTop={1}
               paddingY={1}
               border={'1px'}
               borderColor={'gray.200'}
            >
               {isLoading && (
                  <ListItem {...styleListItem}>
                     <Spinner size="sm" />
                     <Text fontSize={'sm'}>Loading...</Text>
                  </ListItem>
               )}
               {isError && (
                  <ListItem {...styleListItem} color="red.700">
                     <ExclamationTriangleIcon />
                     <Text fontSize={'sm'}>
                        Error retrieving the items. This filter can't be used.
                     </Text>
                  </ListItem>
               )}
               {isSuccess && options.length === 0 && (
                  <ListItem {...styleListItem} color="orange.700">
                     <InfoCircledIcon />
                     <Text fontSize={'sm'}>{emptyMessage ?? 'No items found'}</Text>
                  </ListItem>
               )}
               {isSuccess && options.length > 0 &&
                  options
                     .filter(({ name }) => regexpSearch(search, name))
                     .map((option, key) => (
                        <ListItem
                           key={key}
                           {...styleListItem}
                           tabIndex={isShowResults ? 0 : -1}
                           _focus={{ background: 'primary.500', color: 'white', outline: 'none' }}
                           _hover={{ background: 'primary.500', color: 'white' }}
                           background={option.name === value ? 'primary.500' : 'white'}
                           color={option.name === value ? 'white' : 'gray.900'}
                           onMouseDown={(e) => {
                              e.preventDefault();
                              onChange(option.value);
                              setValue(option.name);
                              setSearch('');
                              setIsShowResults(false);
                           }}
                           onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                 onChange(option.value);
                                 setValue(option.name);
                                 setSearch('');
                                 setIsShowResults(false);
                              }
                           }}
                        >
                           <Text fontSize="sm">{option.name}</Text>
                        </ListItem>
                     ))}
            </List>
         )}
      </Box>
   );
};

const regexpSearch = (searchValue: string, stringToSearch: string) => {
   try {
      const regexp = new RegExp(searchValue, 'ig');
      return regexp.test(stringToSearch);
   } catch (e) {
      return stringToSearch.toLowerCase().includes(searchValue.toLowerCase());
   }
};
