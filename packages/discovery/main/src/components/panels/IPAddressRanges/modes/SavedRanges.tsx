import {
   Text,
   Button,
   Flex,
   Input,
   Modal,
   ModalBody,
   ModalCloseButton,
   ModalContent,
   ModalHeader,
   ModalOverlay,
   useDisclosure,
} from '@chakra-ui/react';
import {
   type IpRangeConfigFilters,
   type IpRangeConfig,
   type IpRangeListEntry,
} from '@statseeker/api/internal_api/entities';
import { RangesForm } from '@statseeker/components';
import {
   type ColumnDef,
   SSDataTable,
   type SortEventPayload,
} from '@statseeker/components/Legacy/SSDataTable';
import { useDebounce, useToast } from '@statseeker/hooks';
import { useQuery } from '@tanstack/react-query';
import { type SelectionEventSourceType } from 'ag-grid-community';
import {
   type ChangeEvent,
   type Dispatch,
   type SetStateAction,
   useCallback,
   useEffect,
   useState,
} from 'react';
import { ipRangeConfigKeys, queryClient } from '~/lib';
import { ipRangeConfigQueryOptions } from '~/lib/ReactQuery/queryOptions/ipRangeConfigQueries';
import { type IPRangeOptions } from '~/types';
import { getErrorMessage } from '~/utils';

function formatRangeSummary(item: { value: { include?: string[]; exclude?: string[] } }): string {
   const includesCount = item.value?.include?.length || 0;
   const excludesCount = item.value?.exclude?.length || 0;

   const includesList =
      includesCount > 0
         ? item.value.include?.map((include: string) => `includes ${include} `).join(' ')
         : '';
   const excludesList =
      excludesCount > 0
         ? item.value.exclude?.map((exclude: string) => `excludes ${exclude} `).join(' ')
         : '';

   const summary = `includes ${includesCount}, excludes ${excludesCount}`;
   const details = `${includesList}${excludesList}`;

   return `${summary}${details ? ` - ${details}` : ''}`;
}

const columns: ColumnDef[] = [
   { field: 'name', headerName: 'name', showTooltip: true },
   { field: 'enabledString', headerName: 'status' },
   {
      field: 'ip_range',
      headerName: 'summary',
      valueFormatter: (item) => formatRangeSummary(item),
      showTooltip: true,
      tooltipValueGetter: (p) => p.valueFormatted ?? '',
      canSort: false,
   },
];

export function SavedRanges(props: {
   onChange: (data: IpRangeConfig[] | undefined) => void;
   setSubTitle: Dispatch<SetStateAction<string>>;
   defaultValues: IPRangeOptions | undefined;
}) {
   const [filters, setFilters] = useState<IpRangeConfigFilters>({
      dir: 'asc',
      sort: 'name',
   });
   const [text_filter, setTextFilter] = useState('');
   const { data: ipRangeConfigs, isSuccess } = useQuery(
      ipRangeConfigQueryOptions.getIpRangeConfigList({ ...filters, text_filter })
   );
   const getSelectedRanges = useCallback(() => (props.defaultValues && props.defaultValues.mode === 'iprange' ?
      props.defaultValues.iprangeList : undefined), [props]);
   const [selectedIds, setSelectedIds] = useState<number[] | undefined>(getSelectedRanges());

   const handleSearchChange = useDebounce((event: ChangeEvent<HTMLInputElement>) => {
      setTextFilter(event.target.value);
   }, 500);

   const handleOnSortChange = useCallback(
      (data: SortEventPayload) => {
         const newFilters: IpRangeConfigFilters = {
            ...filters,
            sort: data.column,
            dir: data.order,
         };
         setFilters(newFilters);
      },
      [filters]
   );

   const { isOpen, onOpen, onClose } = useDisclosure();

   const handleOnChange = useCallback(
      (data: IpRangeConfig[] | undefined, e: SelectionEventSourceType) => {
         const ids = data?.map((range) => range.id);
         if (e !== 'rowDataChanged') {
            setSelectedIds(ids);
            props.onChange(data);
         }
         props.setSubTitle(
            `Saved Ranges - ${ids?.length ?? 0} of ${ipRangeConfigs?.data_total ?? 0} selected`
         );
      },
      [ipRangeConfigs?.data_total, props]
   );

   useEffect(() => {
      props.setSubTitle(
         `Saved Ranges - ${selectedIds?.length ?? 0} of ${ipRangeConfigs?.data_total ?? 0} selected`
      );
   }, [ipRangeConfigs?.data_total, props, selectedIds?.length]);

   return (
      <>
         <Text>
            Select one or more IP Address Ranges. All of the selected ranges will be used during the
            Network Discovery process.
         </Text>
         <Flex gap={2} justifyContent={'space-between'}>
            <Input
               placeholder="Search IP Address Ranges"
               backgroundColor={'white.500'}
               onChange={handleSearchChange}
               width={'30%'}
            />
            <Button paddingX={6} onClick={onOpen} variant="outline">
               Add a new range
            </Button>
         </Flex>
         <SSDataTable<IpRangeListEntry>
            height="200px"
            rowSelectMode="checkbox"
            columns={columns}
            rowData={ipRangeConfigs?.data}
            selectedRows={
               selectedIds ??
               ipRangeConfigs?.data
                  .filter((range) => range.enabled === 1)
                  .map((iprange) => iprange.id)
            }
            onSort={handleOnSortChange}
            onChange={handleOnChange}
            emptyMessage={
               isSuccess
                  ? ipRangeConfigs?.data.length === 0
                     ? 'No IP Ranges found'
                     : undefined
                  : 'An unknown error occurred'
            }
            sortCol={filters.sort}
            sortDir={filters.dir}
            rowIdKey="id"
         />
         <AddIpRangeConfigModal isOpen={isOpen} onClose={onClose} />
      </>
   );
}

function AddIpRangeConfigModal({
   isOpen = false,
   onClose,
}: {
   isOpen: boolean;
   onClose: () => void;
}) {
   const toast = useToast();

   return (
      <Modal isOpen={isOpen} onClose={onClose}>
         <ModalOverlay />
         <ModalContent maxWidth={'100vw'} width={'xxl'}>
            <ModalHeader>Add IP Ranges Form</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
               <RangesForm
                  props={{
                     mode: 'add',
                     onSuccess: () => {
                        queryClient.invalidateQueries();
                        onClose();
                     },
                     onError: (message) => {
                        queryClient.invalidateQueries({ queryKey: ipRangeConfigKeys.get() });
                        toast({
                           title: 'Action failed:',
                           description: getErrorMessage(message),
                           status: 'error',
                        });
                     },
                  }}
               ></RangesForm>
            </ModalBody>
         </ModalContent>
      </Modal>
   );
}
