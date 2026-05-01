// Imports
import { Flex, Box, HStack, Tooltip } from '@chakra-ui/react';
import { TriangleDownIcon, TriangleUpIcon } from '@radix-ui/react-icons';
import { type CustomHeaderProps } from 'ag-grid-react'; // AG Grid Component
import React from 'react';
import { type ColumnDef, type SortEventPayload } from './types';

export type DefaultColumnHeaderProps = CustomHeaderProps & {
   onSort?: (data: SortEventPayload) => void;
   sortCol: string | null;
   sortDir: 'asc' | 'desc' | null;
   columnDefs: ColumnDef[] | string[];
};

export const DefaultColumnHeader = ({
   column,
   displayName,
   onSort,
   sortCol,
   sortDir,
   columnDefs,
}: DefaultColumnHeaderProps) => {
   const columnDef = columnDefs.find(
      (cD) => typeof cD === 'object' && cD.field === column.getColId()
   ) as ColumnDef | undefined;

   const canSort = column.getColDef().field && columnDef?.canSort !== false;
   const description = columnDef?.headerDescription ?? displayName;

   // Wrap event to modify params
   const onSortRequested = (order: 'asc' | 'desc' | undefined) => {
      return onSort && onSort({ column: column.getColId(), order });
   };

   // If sorting is enabled set up new sort event listener
   let onClickHandler: React.MouseEventHandler<HTMLDivElement> = () => {};
   let mySortDir = null;
   if (column.getColId() === sortCol) {
      mySortDir = sortDir;
   }
   if (canSort) {
      let newDirection: undefined | 'asc' | 'desc' = undefined;
      if (mySortDir === null) {
         newDirection = 'asc';
      } else if (mySortDir === 'asc') {
         newDirection = 'desc';
      } else if (mySortDir === 'desc') {
         newDirection = 'asc';
      }
      onClickHandler = () => onSortRequested(newDirection);
   }

   return (
      <HStack onClick={onClickHandler} className={canSort ? 'sortable' : ''}>
         <Tooltip placement="bottom-start" label={description}>
            <div className="customHeaderLabel">
               {displayName}
            </div>
         </Tooltip>
         {canSort && (
            <Flex direction={'column'}>
               <Flex alignItems={'center'} gap="sm">
                  <Flex direction="column" justifyContent={'center'}>
                     <Box
                        marginBottom={'-4px'}
                        color={
                           !mySortDir ? 'gray.200' : mySortDir === 'asc' ? 'primary.500' : 'gray.200'
                        }
                     >
                        <TriangleUpIcon aria-label="sorted ascending" />
                     </Box>
                     <Box
                        marginTop={'-4px'}
                        color={
                           !mySortDir ? 'gray.200' : mySortDir === 'desc' ? 'primary.500' : 'gray.200'
                        }
                     >
                        <TriangleDownIcon aria-label="sorted descending" />
                     </Box>
                  </Flex>
               </Flex>
            </Flex>
         )}
      </HStack>
   );
};
