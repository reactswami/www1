import { regexpFilterFn } from '@statseeker/components/Legacy/react-table';
import { useDebounceValue } from '@statseeker/hooks';
import { getCoreRowModel, getFilteredRowModel, useReactTable, type Table } from '@tanstack/react-table';
import { createContext, useContext, useEffect, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react';
import { type FetchDevicePingPollersPayload, type FetchDevicePingPollersResponse } from '~/api';
import { columns, type PingTableDeviceRow } from '~/components';
import {
   PING_TABLE_DEBOUNCE_TIME_GLOBAL_SEARCH_IN_MS,
   PING_TABLE_PAGE_SIZES,
} from '~/config/defaults';
import { UsePagination, useFetchPingTableData } from '~/hooks';

type ViewMode = 'sm' | 'md';
type SortBy = [string, 'asc' | 'desc'];

export interface ContextProps {
   table: Table<PingTableDeviceRow>;
   data: { rows: PingTableDeviceRow[]; total: number };
   isLoading: boolean;
   isError: boolean;
   isSuccess: boolean;
   isRefetching: boolean;
   isInitialLoading: boolean;
   globalFilter: string;
   setGlobalFilter: Dispatch<SetStateAction<string>>;
   groupFilter: number | undefined;
   setGroupFilter: Dispatch<SetStateAction<number | undefined>>;
   pollerFilter: string[];
   setPollerFilter: Dispatch<SetStateAction<string[]>>;
   exceededFilter: boolean;
   setExceededFilter: Dispatch<SetStateAction<boolean>>;
   viewMode: ViewMode;
   setViewMode: Dispatch<SetStateAction<ViewMode>>;
   sortBy: SortBy;
   setSortBy: Dispatch<SetStateAction<SortBy>>;
   pagination: ReturnType<typeof UsePagination>;
}

interface ProviderProps {
   children: ReactNode;
}

const emptyRow: PingTableDeviceRow = {
   device: '',
   deviceid: '',
   ipaddress: '',
   default_poller: '',
   pollersName: '',
   enabledStatus: '',
   hasExceeded: 0,
};

const PingTableContext = createContext<ContextProps | null>(null);

const usePingTableContext = (): ContextProps => {
   const context = useContext(PingTableContext);
   if (context === undefined) {
      throw new Error('usePingTableContext must be used within a PingTableProvider');
   }
   if (context === null) {
      throw new Error('pingTableContext context has not been initialized');
   }
   return context;
};

// There is quite a lot going on here as we're doing server-side rendering of the table.
const PingTableProvider = ({ children }: ProviderProps) => {
   const [globalFilter, setGlobalFilter] = useState('');
   const [groupFilter, setGroupFilter] = useState<number | undefined>();
   const [pollerFilter, setPollerFilter] = useState<string[]>([]);
   const [exceededFilter, setExceededFilter] = useState<boolean>(false);
   const [sortBy, setSortBy] = useState<SortBy>(['', 'asc']);
   const [viewMode, setViewMode] = useState<ViewMode>('md');
   const pagination = UsePagination(); // Manual pagination (server-side)

   // Setting the query parameters. Note that this udpate every time any of the state above updates
   const queryParams: FetchDevicePingPollersPayload = {
      offset: pagination.offset,
      limit: pagination.limit,
      search: globalFilter,
      sortBy,
      groupFilter,
      pollerFilter,
      exceededFilter,
   };

   // There is a bunch of things we need to do on the pagination when new data is fetched.
   // This could eventually be abstracted
   const onSuccess = (data: FetchDevicePingPollersResponse) => {
      const { total } = data;

      // Updating the pagination
      const pageCount = Math.ceil(total / PING_TABLE_PAGE_SIZES[0]);
      pagination.setPageCount(pageCount);
      const currentPage = pagination.offset / PING_TABLE_PAGE_SIZES[0];
      table.setPageIndex(currentPage);

      // Handling the 'isAllRowSelected' cases
      if (table.getIsAllRowsSelected()) {
         table.toggleAllRowsSelected(true);
      }
   };

   const { refetch, isLoading, isSuccess, isError, isRefetching, data, isInitialLoading } =
      useFetchPingTableData(queryParams, onSuccess);

   const debouncedSearchTerm = useDebounceValue<string>(
      globalFilter,
      PING_TABLE_DEBOUNCE_TIME_GLOBAL_SEARCH_IN_MS
   );

   // Refetch the data when pagination changes
   useEffect(() => {
      refetch();
   }, [pagination.offset]);

   // Refetch the data any search params changes
   useEffect(() => {
      refetch();
      pagination.goToFirstPage();
   }, [debouncedSearchTerm, groupFilter, pollerFilter, exceededFilter, sortBy]);

   const rows = isLoading
      ? new Array(20).fill(emptyRow)
      : (data ?? { data: [] }).data.filter(({ ipaddress }) => ipaddress); // Filtering null ip address, in case discovery has not been run.

   const table = useReactTable({
      columns,
      data: rows,
      manualPagination: true,
      pageCount: pagination.pageCount,
      enableRowSelection: true,
      enableMultiSort: false,
      globalFilterFn: regexpFilterFn,
      getCoreRowModel: getCoreRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      getRowId: (row) => row.deviceid,
      state: {
         sorting: [{ id: sortBy[0], desc: sortBy[1] === 'asc' }],
      },
   });

   return (
      <PingTableContext.Provider
         value={{
            table,
            data: { rows, total: data?.total ?? 0 },
            isLoading,
            isError,
            isSuccess,
            isRefetching,
            isInitialLoading,
            globalFilter,
            setGlobalFilter,
            pollerFilter,
            setPollerFilter,
            exceededFilter,
            setExceededFilter,
            groupFilter,
            setGroupFilter,
            viewMode,
            setViewMode,
            sortBy,
            setSortBy,
            pagination,
         }}
      >
         {children}
      </PingTableContext.Provider>
   );
};

export { PingTableProvider, usePingTableContext };
