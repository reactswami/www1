import { IconButton, HStack, VStack, Button, FormLabel, FormControl } from '@chakra-ui/react';
import { Cross1Icon } from '@radix-ui/react-icons';
import { Input } from '@statseeker/components';
import { type ReactNode } from '@tanstack/react-router';
import { type Dispatch, memo, useCallback, useState } from 'react';
import { type RangeReducerAction } from './rangeReducer';


export type NetworkRangesListProps = {
   /**
    * The header for the IpRanges, example: Excludes or Includes
    */
   list: 'include' | 'exclude';
   /**
    * Is this list a required field?
    * @default false
    */
   isRequired?: boolean;
   /**
    * Beginning of the tab order
    */
   tabOrder: number;
   /**
    * The list of input values to render
    */
   value: (string|null)[];
   /**
    * The dispatch function for the main data reducer
    */
   dispatch: Dispatch<RangeReducerAction>;
   /**
    * The list of errors to show against the input values.
    * The index of the error message in this list is compared against the
    * index of the input values. `undefined` should be set for values without
    * errors.
    * @default undefined
    */
   errors?: (string | undefined)[];
};


/**
 * An input component for adding and removing a list of IP Address Ranges
 */
const NetworkRangesList = memo(function NetworkRangesList({
   isRequired = false,
   list,
   tabOrder,
   value: internalValue,
   dispatch,
   errors,
}: NetworkRangesListProps) {

   const handleInputChanged = useCallback(function handleInputChanged(index: number, newValue: string) {
      dispatch({
         type: 'UPDATE',
         list,
         index,
         value: newValue
      });
   }, [dispatch, list]);

   const handleInputRemoved = useCallback(function handleInputRemoved(index: number) {
      dispatch({
         type: 'REMOVE',
         list,
         index,
      });
   }, [dispatch, list]);

   const handleInputAdded = useCallback(() => {
      setShouldFocus(true);
      dispatch({
         type: 'ADD',
         list,
      });
   }, [dispatch, list]);

   const [ shouldFocus, setShouldFocus ] = useState(false);
   const lastIndex = internalValue?.lastIndexOf('') || 0;

   const rangeList: ReactNode[] = [];
   let length = internalValue.length || 1;
   for (let i = 0; i < length; i++) {
      // Ensure we always have at least one input
      const range = internalValue.length ? internalValue[i] : '';
      // Nulls are not rendered
      if (range === null) {
         continue;
      }
      const error = errors?.[i];
      rangeList.push(
         <NetworkRange
            key={`k${i}-h${list}`}
            index={i}
            value={range}
            error={error}
            autoFocus={shouldFocus && i === lastIndex}
            onChange={handleInputChanged}
            onRemove={handleInputRemoved}
            tabOrder={tabOrder}
         />
      );
   }

   const listHeader = list === 'include' ? 'INCLUDES' : 'EXCLUDES';

   return (
      <VStack alignItems="start">
         <FormControl isRequired={isRequired}>
            <FormLabel margin="0">{listHeader}</FormLabel>
         </FormControl>
         {rangeList}
         <Button
            tabIndex={tabOrder + 2 * internalValue.length}
            type="button"
            variant={'outline'}
            onClick={() => handleInputAdded()}
         >
            Add
         </Button>
      </VStack>
   );
});


type NetworkRangeProps = {
   index: number;
   value: string;
   error: string | undefined;
   onChange: (index: number, newInputValue: string) => void;
   onRemove: (index: number) => void;
   autoFocus: boolean;
} & Pick<NetworkRangesListProps, 'tabOrder'>;


const NetworkRange = memo(function NetworkRange({ index, value, error, onChange, onRemove, autoFocus, tabOrder }: NetworkRangeProps) {
   return (
      <HStack alignItems="start">
         <Input
            tabIndex={tabOrder + index}
            value={value}
            autoFocus={autoFocus}
            onChange={(e) => onChange(index, e.target.value)}
            error={error}
         />
         <IconButton
            colorScheme={'red'}
            tabIndex={tabOrder + index + 1}
            title="Remove IP Range"
            aria-label="Remove IP Range"
            variant={'outline'}
            icon={<Cross1Icon />}
            onClick={() => onRemove(index)}
         />
      </HStack>
   );
});


export default NetworkRangesList;
