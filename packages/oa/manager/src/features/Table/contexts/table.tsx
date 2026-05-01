import { type UseDisclosureReturn } from '@chakra-ui/react';
import { regexpFilterFn } from '@statseeker/components/Legacy/react-table';
import {
   type OnChangeFn,
   type PaginationState,
   getCoreRowModel,
   getFilteredRowModel,
   getPaginationRowModel,
   getSortedRowModel,
   useReactTable,
   type Table,
} from '@tanstack/react-table';
import React, { type ReactNode, createContext, useContext, useMemo, useState, useCallback } from 'react';
import * as defaults from '~/config/defaults';
import { columns } from '~/features/Table';
import { type TableRowData } from '~/hooks/useFetchOaTableData';

type ViewMode = 'sm' | 'md';

export interface OAContextProps {
   groupId?: number | null;
   setGroupId: (groupId: number | null | undefined) => void;
};

export interface ContextProps {
   data: TableRowData[];
   table: Table<TableRowData>;
   isLoading: boolean;
   isSuccess: boolean;
   isError: boolean;
   globalFilter: string;
   setGlobalFilter: (arg: string) => void;
   viewMode: ViewMode;
   setViewMode: (arg: ViewMode) => void;
   addOaDisclosure?: UseDisclosureReturn;
}

interface ProviderProps {
   children: ReactNode;
   isLoading: ContextProps['isLoading'];
   isError: ContextProps['isError'];
   isSuccess: ContextProps['isSuccess'];
   Oas: TableRowData[];
   addOaDisclosure?: UseDisclosureReturn;
   paginationState: PaginationState;
   setPaginationState: OnChangeFn<PaginationState>;
}

interface OAProviderProps {
   children: ReactNode;
}

const emptyRow = {
   id: '',
   services: [''],
   name: '',
   status: '',
   uptime: 0,
   hostname: '',
   ipaddress: '',
   version: '',
   poll: 'on',
   region: '',
   site: '',
   netmask: '',
   gateway: '',
   timeout: 0,
};

const OaTableContext = createContext<ContextProps | null>(null);
const OaContext = createContext<OAContextProps | null>(null);

const useOaTableContext = () => {
   const context = useContext(OaTableContext);
   if (context === undefined) {
      throw new Error(
         'useOaTableContext must be used within a OaTableProvider'
      );
   }

   if (context === null) {
      throw new Error('oaTable context has not been initialized');
   }

   return context;
};

const useOaContext = () => {
   const context = useContext(OaContext);
   if (context === undefined) {
      throw new Error(
         'useOaTableContext must be used within a OaTableProvider'
      );
   }

   if (context === null) {
      throw new Error('oaTable context has not been initialized');
   }

   return context;
};

const OaProvider = ({
   children,
}: OAProviderProps) => {

   const [groupId, setGroupId] = React.useState<number | null | undefined>(null);

   // Memoize setGroupId to ensure it has a stable reference
   const stableSetGroupId = useCallback((newGroupId: number | null | undefined) => {
      setGroupId(newGroupId);
   }, []);

   // Memoize the context value to prevent unnecessary re-renders
   const contextValue = useMemo(() => ({
      groupId,
      setGroupId: stableSetGroupId
   }), [groupId, stableSetGroupId]);

   return <OaContext.Provider value={contextValue}>
      {children}
   </OaContext.Provider>;
};

const OaTableProvider = ({
   children,
   Oas: data,
   isLoading,
   isSuccess,
   isError,
   addOaDisclosure,
   paginationState,
   setPaginationState,
}: ProviderProps) => {
   const [globalFilter, setGlobalFilter] = useState('');
   const [viewMode, setViewMode] = useState<'sm' | 'md'>('md');
   const [rowSelection, setRowSelection] = React.useState({});

   const tableData = useMemo(() =>
      isLoading ? Array(defaults.TABLE_PAGE_SIZES[0]).fill(emptyRow) : data ?? [],
      [isLoading, data]
   );

   const tableState = useMemo(() => ({
      globalFilter,
      pagination: paginationState,
      rowSelection
   }), [globalFilter, paginationState, rowSelection]);

   // Memoize callbacks to prevent recreating them on every render
   const handleGlobalFilterChange = useCallback((filter: string) => {
      setGlobalFilter(filter);
   }, []);

   const handleViewModeChange = useCallback((mode: ViewMode) => {
      setViewMode(mode);
   }, []);

   const table = useReactTable({
      data: tableData,
      columns,
      globalFilterFn: regexpFilterFn,
      getSortedRowModel: getSortedRowModel(),
      getCoreRowModel: getCoreRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      onGlobalFilterChange: setGlobalFilter,
      onPaginationChange: setPaginationState,
      //enableRowSelection: true,
      enableMultiRowSelection: false,
      onRowSelectionChange: (updater) => {
         setRowSelection(updater);
      },
      getRowId: (row: TableRowData) => String(row.id),
      state: tableState,
   });

   return (
      <OaTableContext.Provider value={{
         data,
         table,
         isLoading,
         isError,
         isSuccess,
         globalFilter,
         setGlobalFilter: handleGlobalFilterChange,
         viewMode,
         setViewMode: handleViewModeChange,
         addOaDisclosure,
      }}>
         {children}
      </OaTableContext.Provider>
   );
};

export { useOaTableContext, OaTableProvider, useOaContext, OaProvider };