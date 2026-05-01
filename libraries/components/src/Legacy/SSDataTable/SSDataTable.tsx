// Imports - The order of these imports is very important so take care when changing them
import { Box } from '@chakra-ui/react';
import {
   RowApiModule,
   ClientSideRowModelModule,
   provideGlobalGridOptions,
   type RowSelectionOptions,
   type CellClickedEvent,
   type ColDef,
   type SelectionChangedEvent,
   type IRowNode,
   ModuleRegistry,
   RowSelectionModule,
   RowStyleModule,
   TooltipModule,
   RowDragModule
} from 'ag-grid-community';
// import '@ag-grid-community/styles/ag-grid.css'; // Mandatory CSS
import './ag-grid-min.css'; // Mandatory CSS (our cut down version)
import 'ag-grid-community/styles/ag-theme-quartz.css'; // AG CSS Theme
import { type DragStoppedEvent, type RowDragEnterEvent } from 'ag-grid-community/dist/types/src/events';
import { AgGridReact } from 'ag-grid-react';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import './SSDataTable.css'; // Our CSS Theme
import { generateColumnDefs } from './columns';
import { DefaultColumnHeader, type DefaultColumnHeaderProps } from './defaultCustomHeader';
import { DefaultOverlay } from './defaultOverlay';
import { memo } from './typeHelpers';
import { type SSDataTableProps } from './types';


ModuleRegistry.registerModules([
   RowApiModule,
   ClientSideRowModelModule,
   RowSelectionModule,
   RowStyleModule,
   TooltipModule,
   RowDragModule
]);

/** This will need to be removed the next time we upgrade AG Grid */
provideGlobalGridOptions({
   theme: 'legacy',
});

/**
 * The standard Statseeker data table component.
 * Handles presentation of and interaction with data only.
 * Loading data and applying transformations like sorting must be done outside of this component.
 * If `rowData` is not provided a loading message will be shown,
 * and if it is an empty array then a "no data" message will be shown.
 *
 * Key props include:
 * - `columns` - The definition of the columns for the table
 * - `rowData` - The data to display in the table
 * - `rowSelectMode` - Enables single or multi selection of the table rows
 * - `onAction` - Event listener for all table actions
 */
export const SSDataTable = memo(function SSDataTable<T>({
   columns,
   rowData,
   rowSelectMode = 'none',
   onClick,
   onChange,
   onSort,
   emptyMessage,
   loadingMessage,
   sortCol,
   sortDir,
   width = '100%',
   height = 'auto',
   selectedRows,
   rowClassRules,
   rowIdKey,
   rowDrag = false,
   onRowDrag,
   isLoading,
   debounceRowDrag = false,
   resizableCols,
   selectText = false,
   ...props
}: SSDataTableProps<T>) {
   // Change internal settings based on selection mode
   let selection: RowSelectionOptions = { mode: 'singleRow', checkboxes: false };
   switch (rowSelectMode) {
      case 'single':
         selection = {
            mode: 'singleRow',
            checkboxes: false,
            enableClickSelection: true,
         };
         break;
      case 'multiple':
         selection = {
            mode: 'multiRow',
            checkboxes: false,
            enableClickSelection: true,
            headerCheckbox: false,
         };
         break;
      case 'checkbox':
         selection = {
            mode: 'multiRow',
            enableClickSelection: true,
            selectAll: 'currentPage',
         };
   }
   const tableRef = useRef<AgGridReact>(null);

   // Build header component and tie reactivity to columns
   const ColumnHeader = useCallback(
      (params: DefaultColumnHeaderProps) => (
         <DefaultColumnHeader {...params} onSort={onSort} columnDefs={columns} />
      ),
      [columns, onSort]
   );
   const components = useMemo<object>(() => {
      return {
         agColumnHeader: ColumnHeader,
      };
   }, [ColumnHeader]);

   // Generate internal column definitions
   const colDefs: ColDef[] = useMemo(() => {
      const defaultColumnDefs = {
         columns: columns as string[],
         sortCol: sortCol ?? null,
         sortDir: sortDir ?? null,
         resizableCols: resizableCols ?? false,
      };
      return generateColumnDefs(defaultColumnDefs);
   }, [columns, sortCol, sortDir]);

   // Set up no data message overlay
   const noRowsOverlayComponentDefault = useMemo(() => {
      return DefaultOverlay;
   }, []);
   const noRowsOverlayComponentParamsDefault = useMemo(() => {
      return {
         overlayMessage: () => emptyMessage,
      };
   }, [emptyMessage]);

   const loadingOverlayComponentDefault = useMemo(() => {
      return DefaultOverlay;
   }, []);
   const loadingOverlayComponentParamsDefault = useMemo(() => {
      return {
         overlayMessage: () => loadingMessage === undefined ? 'Loading...' : loadingMessage,
      };
   }, [loadingMessage]);

   // Fire event listener on selection change
   const defaultSelectionChange = (event: SelectionChangedEvent) => {
      return onChange && onChange(event.api?.getSelectedRows(), event.source);
   };

   const defaultClick = ({ value, data }: CellClickedEvent<T>) => {
      const params = {
         cellValue: value,
         rowData: data,
      };
      return onClick && onClick(params);
   };

   function setSelectedRows() {
      if (tableRef.current?.api) {
         if (selectedRows === 'all') {
            tableRef.current.api.selectAll();
         } else {
            let nodesToSelect: IRowNode[] = [];
            let nodesToDeselect: IRowNode[] = [];

            if (tableRef.current.api.isDestroyed()) {
               return;
            }

            tableRef?.current?.api?.forEachNode((node) => {
               let isSelected = node.isSelected();
               let needsToBeSelected = (selectedRows ?? []).includes(Number(node.id));
               if (!isSelected && needsToBeSelected) {
                  nodesToSelect.push(node);
               } else if (isSelected && !needsToBeSelected) {
                  nodesToDeselect.push(node);
               }
            });

            if (nodesToSelect.length > 0) {
               tableRef.current.api.setNodesSelected({
                  nodes: nodesToSelect,
                  newValue: true,
                  source: 'api',
               });
            }

            if (nodesToDeselect.length > 0) {
               tableRef.current.api.setNodesSelected({
                  nodes: nodesToDeselect,
                  newValue: false,
                  source: 'api',
               });
            }
         }
      }
   }

   // manually mange row selection
   useEffect(() => {
      setSelectedRows();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [selectedRows, rowData]);

   function getRowIdKey(params: any) {
      return params.data[rowIdKey].toString();
   }


   /* Add rowDrag to the first colDef to enable row dragging */
   if (rowDrag && colDefs.length > 0) {
      colDefs[0].rowDrag = true;
   }
   const dragDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

   const debouncedDrag = useCallback((newOrder: T[]) => {
      if (dragDebounceRef.current) {
         clearTimeout(dragDebounceRef.current);
      }
      dragDebounceRef.current = setTimeout(() => {
         if (onRowDrag) {
            onRowDrag(newOrder);
         }
      }, 700);
   }, [onRowDrag]);

   const gridOptions = useMemo(() => {
      return {
         onDragStopped: (event: DragStoppedEvent) => {
            const newRowOrder: T[] = [];
            event.api.forEachNode((node) => {
               newRowOrder.push(node.data);
            });
            if (debounceRowDrag) {
               debouncedDrag(newRowOrder);
            }
            else if (onRowDrag) {
               onRowDrag(newRowOrder);
            }
         },
         onRowDragEnter: (event: RowDragEnterEvent) => {
            /* Deselect all the rows */
            event.api.deselectAll();
         },
      };
   }, [debouncedDrag, onRowDrag, debounceRowDrag]);

   return (
      <Box className={`ag-theme-quartz ssDataTable${selectText ? ' ssDataTable--selectText' : ''}`} style={{ width, height }} {...props}>
         <AgGridReact<T>
            rowData={rowData}
            columnDefs={colDefs}
            rowSelection={selection}
            components={components}
            onSelectionChanged={defaultSelectionChange}
            onCellClicked={defaultClick}
            noRowsOverlayComponent={noRowsOverlayComponentDefault}
            noRowsOverlayComponentParams={noRowsOverlayComponentParamsDefault}
            loadingOverlayComponent={loadingOverlayComponentDefault}
            loadingOverlayComponentParams={loadingOverlayComponentParamsDefault}
            ref={tableRef}
            loading={isLoading || !(Array.isArray(rowData))}
            getRowId={rowIdKey ? getRowIdKey : undefined}
            onGridReady={setSelectedRows}
            enableBrowserTooltips={true}
            rowClassRules={rowClassRules}
            /* At this point, we assume the row dragging is managed by AG grid if it is desired.
            Change this in the case that the application must manage row dragging itself. */
            rowDragManaged={rowDrag}
            gridOptions={gridOptions}
         />
      </Box>
   );
});
