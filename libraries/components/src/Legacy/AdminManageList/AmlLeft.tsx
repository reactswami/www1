import { CheckIcon, SearchIcon } from '@chakra-ui/icons';
import { Text, Button, Flex, Input, InputGroup, InputLeftElement, Menu, MenuButton, MenuList, MenuItem, Tag, propNames } from '@chakra-ui/react';
import { SSDataTable, ROWS_PER_PAGE, type SortEventPayload } from '@statseeker/components/Legacy/SSDataTable';
import { useDebounce } from '@statseeker/hooks';
import { FilterIcon } from '@statseeker/ui/icons';
import { memoTyped } from '@statseeker/utils/misc';
import { Link, useLocation, useNavigate, useSearch } from '@tanstack/react-router';
import { memo } from 'react';
import { type AdminManageListPageProps , type AdminManageListButtonDef } from './types';


export const AmlLeft = memoTyped(function AmlLeft<DatatableType>(props: AdminManageListPageProps<DatatableType>) {
   return (
      <Flex flexDir={'column'} padding={2} gap={4}>
         <AmlButtons
            buttonDefs={props.buttonDefs}
         />

         <Flex flexDir={'column'} flexGrow={1} minHeight={0} gap={2}>
            <AmlFilters
               filterActions={props.filterActions}
               activeFilter={props.activeFilter}
               routeId={props.routeId}
               /* Assume text search is supported unless explicitly set otherwise */
               textSearchSupported={props.textSearchSupported ?? true }
            />
            <Flex flexGrow={1} flexDir={'column'} minHeight={0} width={props.listWidth || 400}>
               <AmlList
                  dataLabel={props.dataLabel}
                  routeId={props.routeId}
                  toRoute={props.toRoute}
                  data={props.data}
                  dataTotal={props.dataTotal}
                  success={props.success}
                  datatableProps={props.datatableProps}
                  noSelectedIdsPaths={props.noSelectedIdsPaths}
                  isLoading={props.isLoading}
               />
               <AmlListFooter
                  dataLength={props.data.length}
                  dataTotal={props.dataTotal}
                  routeId={props.routeId}
               />
            </Flex>
         </Flex>
      </Flex>
   );
});


const AmlButtons = memo(function AmlButtons({ buttonDefs }: { buttonDefs: AdminManageListButtonDef[] }) {
   const buttons = buttonDefs.map((buttonDef, index) => (
      <Link
         {...buttonDef?.linkProps}
         key={`k${index}`}
      >
         <Button
            className={buttonDef.text.replace(' ', '')}
            variant="outline"
            {...buttonDef?.buttonProps}
         >
            {buttonDef.text}
         </Button>
      </Link>
   ));

   return (
      <Flex justifyContent={'center'} gap="2">
         {buttons}
      </Flex>
   );
});


const AmlFilters = memo(function AmlFilters({ filterActions, activeFilter, routeId, textSearchSupported }: { filterActions?: { [index: string]: () => void }; activeFilter?: string; routeId: string; textSearchSupported?: boolean }) {
   // @ts-ignore - needed for build type error
   const { text_filter } = useSearch({ from: routeId });
   const navigate = useNavigate();

   function onSearch(textValue: string | undefined) {
      navigate({
         search: (prev: any): any => ({
            ...prev,
            text_filter: textValue && textValue.length > 0 ? textValue : undefined,
         }),
         replace: true
      });
   }

   const debounceSearch = useDebounce((e: any) => {
      onSearch(e.target.value);
   }, 300);

   let filters = null;
   if (filterActions) {
      filters = (
         <>
            <Menu>
            <MenuButton as={Button} variant="outline" leftIcon={<FilterIcon />} flexShrink={0}>
               <Flex alignItems={'center'} gap="sm">
                  Filters
                  {activeFilter && (
                     <Tag
                        size="sm"
                        fontSize={'xs'}
                        colorScheme="orange"
                        variant="subtle"
                        borderRadius={'full'}
                     >
                        1
                     </Tag>
                  )}
               </Flex>
            </MenuButton>
            <MenuList minWidth='max-content' zIndex={200}>
               {Object.keys(filterActions).map((key) =>
                  <MenuItem
                     key={key}
                     onClick={filterActions[key]}
                     _hover={{ background: 'blue.50' }}
                     _focus={{ background: 'blue.50' }}
                     fontSize="sm"
                     icon={activeFilter === key ? <CheckIcon /> : undefined}
                  >
                     {key}
                  </MenuItem>
               )}
            </MenuList>
            </Menu>
         </>
      );
   }

   return (
      <Flex className="flex" gap={2}>
         {textSearchSupported && (
            <InputGroup>
               <InputLeftElement pointerEvents="none">
                  <SearchIcon color="gray.300" />
               </InputLeftElement>
               <Input
                  defaultValue={text_filter}
                  name="search"
                  type="text"
                  placeholder="Search"
                  onChange={debounceSearch}
               />
            </InputGroup>
         )}
         {filters}
      </Flex>
   );
});


type AmlListProps<DatatableType> = Pick<AdminManageListPageProps<DatatableType>,
   'dataLabel' | 'routeId' | 'toRoute' | 'data' | 'dataTotal' | 'success' | 'datatableProps' | 'noSelectedIdsPaths' | 'isLoading'
>;


const AmlList = memoTyped(function AmlList<DatatableType>({ dataLabel, routeId, toRoute, data, dataTotal, success, datatableProps, noSelectedIdsPaths, isLoading }: AmlListProps<DatatableType>) {
   // @ts-ignore - needed for build type error
   const { selectedIds, sort, dir } = useSearch({ from: routeId });
   const navigate = useNavigate();
   const pathname = useLocation({
      select: (location) => location.pathname,
   });

   const emptyMessage = success
         ? dataTotal === 0
            ? `No ${dataLabel} found`
            : undefined
         : 'An unknown error occurred';

   function onSort({ column, order }: SortEventPayload) {
      navigate({
         search: (prev: any) => ({
            ...prev,
            sort: column,
            dir: order,
         }),
      });
   }

   function navigateToIndex(selectedIds?: number[]) {
      navigate({
         // @ts-ignore - needed for build type error
         from: routeId,
         // @ts-ignore - needed for build type error
         to: toRoute ?? '/',
         search: (prev: any) => ({
            ...prev,
            selectedIds,
         }),
      });
   }

   function navigateToEdit(id: number) {
      navigate({
         // @ts-ignore - needed for build type error
         from: routeId,
         // @ts-ignore - needed for build type error
         to: (toRoute ?? '/') + 'edit/$id',
         params: {
            // @ts-ignore
            id: id,
         },
         search: (prev: any) => ({
            ...prev,
            selectedIds: [id],
         }),
      });
   }

   function onListSelectionChanged<DatatableType>(selected: DatatableType[] | undefined) {
      if (selected && selected.length === 1) {
         // @ts-ignore - Our generic needs id but there's a lot of places we would need to add that
         navigateToEdit(selected[0].id);
         return;
      }
      // @ts-ignore - Our generic needs id but there's a lot of places we would need to add that
      const selectedIds = selected?.map((data: DatatableType) => data.id);
      // Copy and Add are the non-index routes without selectedIds
      const paths = noSelectedIdsPaths ? noSelectedIdsPaths : ['/copy', '/add'];
      if (selectedIds?.length === 0) {
         for (let path of paths) {
            if (pathname.includes(path)) {
               return;
            }
         }
      }
      navigateToIndex(selectedIds);
   }

   return (
      <SSDataTable<DatatableType>
         height={'100%'}
         zIndex={100}
         rowData={data}
         rowSelectMode='checkbox'
         selectedRows={selectedIds}
         emptyMessage={emptyMessage}
         // @ts-ignore
         rowIdKey="id"
         sortCol={sort}
         sortDir={dir}
         onSort={onSort}
         onChange={onListSelectionChanged<DatatableType>}
         isLoading={isLoading}
         {...datatableProps}
      />
   );
});


const AmlListFooter = memo(function AmlListFooter({ dataLength, dataTotal, routeId }: { dataLength: number; dataTotal: number; routeId: string }) {
   // @ts-ignore - needed for build type error
   const { selectedIds } = useSearch({ from: routeId });
   const selectedLength: number = selectedIds?.length || 0;

   let footerMessage = '';
   if (dataTotal === 0) {
      footerMessage = '0 of 0 displayed';
   }
   else {
      footerMessage = `${dataLength} of ${dataTotal} displayed`;
      if (selectedLength) {
         footerMessage += `, ${selectedLength} selected`;
      }
   }

   return (
      <Flex padding={3} fontSize={'xs'} borderTop={'2px'} borderColor={'gray.500'} justifyContent={'space-between'}>
         <Text marginRight={1} whiteSpace={'nowrap'}>
            {footerMessage}
         </Text>

         {dataLength < dataTotal ? (
            <Flex flexDir={'row'}>
               <Link
                  className="showMore"
                  color="#2251dd"
                  search={(prev: any): any => ({
                     ...prev,
                     limit: (prev.limit ? prev.limit : dataLength) + ROWS_PER_PAGE,
                  })}
                  replace
               >
                  Show more...
               </Link>
            </Flex>
         ) : null}
      </Flex>
   );
});
