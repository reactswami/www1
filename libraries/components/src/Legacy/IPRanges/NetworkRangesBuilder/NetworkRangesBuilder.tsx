import { Button, Flex, FormLabel, HStack, VStack, useDisclosure } from '@chakra-ui/react';
import { QuestionMarkCircledIcon } from '@radix-ui/react-icons';
import { type IpRange } from '@statseeker/api/internal_api/entities';
import { memo, useReducer, useEffect, useRef, useCallback, type MouseEvent } from 'react';
import { type FieldError } from 'react-hook-form';
import { ImportRangesFromFile } from '../ImportRangesFromFile';
import NetworkRangesHelpModal from './NetworkRangesHelpModal';
import NetworkRangesList from './NetworkRangesList';
import { rangeReducer } from './rangeReducer';

export type IpRangeRuleWithNulls = {
   include: (string | null)[];
   exclude: (string | null)[];
};
export type NetworkRangesBuilderProps = {
   /**
    * The includes and excludes lists to render
    */
   value: IpRangeRuleWithNulls;
   /**
    * The onChange callback for when the input values are modified
    * @param newValue The new lists of values
    */
   onChange: (newValue: IpRangeRuleWithNulls) => void;
   /**
    * The error provided from validation of this component's values
    */
   error?: FieldError;
   /**
    * If enabled the internal list manipulation state will be returned in the onChange listener.
    * This includes null values for any ranges in the original value that were removed.
    * Turning this on and then only filtering out nulls when sending to the server will provide
    * a performance benefit for large lists as the list indexes won't be changing.
    * @default false
    */
   exposeNulls?: boolean;
   /**
    * If set to false import,export an help buttons will be hidden
    */
   allowImportExport?: boolean;
};

/**
 * An input component for building a network range from lists of include and exclude IP Address Ranges
 */
export const NetworkRangesBuilder = memo(function NetworkRangesBuilder({
   value,
   onChange,
   error,
   exposeNulls = false,
   allowImportExport = true,
}: NetworkRangesBuilderProps) {
   const [internalValue, dispatch] = useReducer(rangeReducer, value);
   const exportRef = useRef<HTMLAnchorElement>(null);

   // If our props value changes and it isn't the same as our internal state
   // then update our internal state to match it.
   useEffect(() => {
      if (JSON.stringify(value) !== JSON.stringify(internalValue)) {
         dispatch({
            type: 'REPLACE',
            value,
         });
      }
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [value]);

   // When internal state changes update parent
   useEffect(() => {
      if (exposeNulls === false) {
         internalValue.include = internalValue.include.filter((r) => r !== null);
         internalValue.exclude = internalValue.exclude.filter((r) => r !== null);
      }
      onChange(internalValue);
   }, [onChange, internalValue, exposeNulls]);

   const helpModalDisclosure = useDisclosure();

   function onImport(importedRanges: IpRange) {
      dispatch({
         type: 'REPLACE',
         value: importedRanges,
      });
   }

   const errorTokens = error?.message?.match(/^{(include|exclude)\[([0-9]+)\]}(.*)/);
   const includeErrors: (string | undefined)[] = [];
   const excludeErrors: (string | undefined)[] = [];
   if (errorTokens && errorTokens.length === 4) {
      let errorsArray = includeErrors;
      if (errorTokens[1] === 'exclude') {
         errorsArray = excludeErrors;
      }
      let targetIndex = parseInt(errorTokens[2]);
      for (let i = 0; i <= targetIndex; i++) {
         if (i === targetIndex) {
            errorsArray.push(errorTokens[3]);
         }
         else {
            errorsArray.push(undefined);
         }
      }
      if (error && error.message?.startsWith('{exclude')) {
         errorsArray.push(error.message);
      }
   }
   else if (error?.message) {
      // TODO - Add logic for general builder-wide errors
   }

   const exportToFile = useCallback(function exportToFile(event: MouseEvent) {
      event.preventDefault();
      event.stopPropagation();
      if (exportRef.current) {
         let exportStr = '';
         let includes = internalValue.include.filter((r) => r !== null && r.trim() !== '');
         if (includes.length) {
            exportStr += 'include ' + includes.join('\ninclude ');
         }
         let excludes = internalValue.exclude.filter((r) => r !== null && r.trim() !== '');
         if (excludes.length) {
            if (includes.length) {
               exportStr += '\n';
            }
            exportStr += 'exclude ' + excludes.join('\nexclude ');
         }
         exportStr = 'data:text/plain;charset=utf-8,' + encodeURIComponent(exportStr);
         exportRef.current.href = exportStr;
         exportRef.current.click();
      }
   }, [internalValue.exclude, internalValue.include, exportRef]);

   return (
      <VStack alignItems="start" gap={4}>
         <FormLabel margin={0}>IP Address Ranges</FormLabel>
         {allowImportExport ? (
            <Flex direction={'row'} gap={2}>
               <ImportRangesFromFile onImport={onImport} />
               <a ref={exportRef} download={'ip_address_ranges.txt'}>
                  <Button variant={'outline'} onClick={exportToFile}>
                     Export Ranges To File
                  </Button>
               </a>
               <Button
                  borderRadius="md"
                  variant="ghost"
                  onClick={helpModalDisclosure.onOpen}
                  leftIcon={<QuestionMarkCircledIcon />}
               >
                  Help
               </Button>
            </Flex>
         ) : null}
         <HStack alignItems="start" gap={20}>
            <NetworkRangesList
               tabOrder={103}
               list="include"
               value={internalValue.include}
               dispatch={dispatch}
               errors={includeErrors}
               isRequired={true}
               key="include"
            />
            <NetworkRangesList
               tabOrder={3000}
               list="exclude"
               value={internalValue.exclude}
               dispatch={dispatch}
               key="exclude"
               errors={excludeErrors}
            />
         </HStack>
         <NetworkRangesHelpModal disclosure={helpModalDisclosure} />
      </VStack>
   );
});
