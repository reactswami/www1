import { type UseDisclosureReturn } from '@chakra-ui/react';
import { regexpFilterFn } from '@statseeker/components/Legacy/react-table';
import {
   type ColumnDef,
   type OnChangeFn,
   type PaginationState,
   getCoreRowModel,
   getFilteredRowModel,
   getPaginationRowModel,
   getSortedRowModel,
   useReactTable,
   type Table
} from '@tanstack/react-table';
import { type ReactNode, createContext, useContext , useState } from 'react';
import { DEFAULT_TABLE_PAGE_SIZE } from '~/config/defaults';
import { type RowData } from '~/types/models';

type ViewMode = 'sm' | 'md';
export interface ContextProps {
   table: Table<RowData>;
   isLoading: boolean;
   isSuccess: boolean;
   isError: boolean;
   globalFilter: string;
   setGlobalFilter: (arg: string) => void;
   viewMode: ViewMode;
   setViewMode: (arg: ViewMode) => void;
   addDisclosure: UseDisclosureReturn;
}

interface ProviderProps {
   children: ReactNode;
   isLoading: ContextProps['isLoading'];
   isError: ContextProps['isError'];
   isSuccess: ContextProps['isSuccess'];
   data?: RowData[];
   addDisclosure: UseDisclosureReturn;
   paginationState: PaginationState;
   setPaginationState: OnChangeFn<PaginationState>;
   columns: ColumnDef<RowData, any>[];
}

const emptyRow = {
   id: '',
   title: '',
};

const TableContext = createContext<ContextProps | null>(null);

const useTableContext = () => {
   const context = useContext(TableContext);
   if (context === undefined) {
      throw new Error('useAirportTableContext must be used within a AirportTableProvider');
   }

   if (context === null) {
      throw new Error('Airport Table context has not been initialized');
   }

   return context;
};

const TableProvider = ({
   children,
   isLoading,
   isError,
   isSuccess,
   data,
   addDisclosure,
   paginationState,
   setPaginationState,
   columns,
}: ProviderProps) => {
   const [globalFilter, setGlobalFilter] = useState('');
   const [viewMode, setViewMode] = useState<'sm' | 'md'>('md');
   const table = useReactTable({
      data: isLoading ? Array(DEFAULT_TABLE_PAGE_SIZE).fill(emptyRow) : data ?? [],
      columns,
      globalFilterFn: regexpFilterFn,
      getSortedRowModel: getSortedRowModel(),
      getCoreRowModel: getCoreRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      onGlobalFilterChange: setGlobalFilter,
      onPaginationChange: setPaginationState,
      state: {
         globalFilter,
         pagination: paginationState,
      },
      initialState: {
         pagination: paginationState,
      },
      defaultColumn: {
         filterFn: 'equalsString',
      },
   });

   return (
      <TableContext.Provider
         value={{
            table,
            isLoading,
            isError,
            isSuccess,
            globalFilter,
            setGlobalFilter,
            viewMode,
            setViewMode,
            addDisclosure,
         }}
      >
         {children}
      </TableContext.Provider>
   );
};

export { useTableContext, TableProvider };
