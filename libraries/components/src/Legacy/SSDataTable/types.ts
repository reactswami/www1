// Imports
import { type BoxProps, type ButtonProps } from '@chakra-ui/react';
import { type LinkProps } from '@tanstack/react-router';
import {
   DragStoppedEvent, RowDragEnterEvent,
   type GridApi,
   type ITooltipParams,
   type RowClassRules,
   type SelectionEventSourceType,
   type ValueFormatterFunc,
} from 'ag-grid-community';
import { type AgGridReactProps, type CustomCellRendererProps } from 'ag-grid-react';
import { type FunctionComponent } from 'react';

/**
 * @type DefaultCellRendererProps
 * Default cell render props for the table.
 */
export type DefaultCellRendererProps = {
   /**
    * The text to display in the button
    */
   text: string;
   /**
    * Props for the Link element that wraps the button
    * @example { to: '/add', search: true }
    */
   linkProps?: LinkProps;
   /**
    * Props for the Button element
    * @default { className: text, variant: 'outline' }
    */
   buttonProps?: ButtonProps;

   // id of the record to navigate to
   id?: string;
};
// Types
export type CellRendererProps = CustomCellRendererProps & {
   /**
    * The action callback for the cell render click.
    */
   onCellAction: () => void;
};

/**
 * @type ColumnDef
 * Definition of a single column in an SSDataTable component.
 */
export type ColumnDef = {
   /**
    * The field of the row object to get the cell's data from. Deep references into a row object is supported via dot notation, i.e 'address.firstLine'.
    */
   field: string;
   /**
    * The name to render in the column header. If not specified and field is specified, the field name will be used as the header name.
    */
   headerName?: string;
   /**
    * An optional description of the header.
    */
   headerDescription?: string;
   /**
    * Is the column sortable?
    * @default true
    */
   canSort?: boolean;
   /**
    * The ideal size/width for the column. Either 'sm', 'md', or 'lg'
    * This will change the defaults for the flex and minWidth props.
    * Only use those props as overrides for this if more granular control is needed.
    *
    * @default md
    */
   columnSize?: 'sm' | 'md' | 'lg';
   /**
    * The CSS flex-basis property for the column.
    * This is intended as an override, so prefer to use the columnSize prop instead.
    * @default 1 (md) 0.66 (sm) 1.33 (lg)
    */
   flex?: number;
   /**
    * The minimum width in px that the column can shrink to.
    * If the content is larger than this value it will be truncated with an ellipsis.
    * This is intended as an override, so prefer to use the columnSize prop instead.
    * @default 150 (md) 100 (sm) 200 (lg)
    */
   minWidth?: number;
   /**
    * The maximum width in px that the column can grow to.
    * This is intended as an override, so prefer to use the columnSize prop instead.
    */
   maxWidth?: number;

   /**
    * The component that renders the custom component for the column
    *
    */
   cellRenderer?: FunctionComponent<CellRendererProps> | DefaultCellRendererProps[];
   /**
    * Should tooltips be shown for cells in this column?
    * @default false
    */
   showTooltip?: boolean;
   /**
    * Use a Value Formatter to provide text formatting of values.
    */
   valueFormatter?: string | ValueFormatterFunc;
   /**
    *
    * @param p
    * @returns Callback that should return the string to use for a tooltip
    */
   tooltipValueGetter?: (p: ITooltipParams) => string;
};

/**
 * The payload data for a sort action triggered by the SSDataTable component.
 */
export type SortEventPayload = {
   column: string;
   order: 'asc' | 'desc' | undefined;
};

/**
 * The payload data for click action triggered by the SSDataTable component.
 */
export type ClickEventPayload<T> = {
   cellValue: string;
   rowData: T | undefined;
};

/**
 * The underlying table library (Ag Grid) reference.
 */
export type SSDataTableRef<T> = {
   /**
    * Returns the list data for selected rows
    * @returns The list of selected row data
    */
   getSelectedRowData: () => T[] | undefined;
   /**
    * Returns the Ag Grid API handle for this instance
    * @returns The Ag Grid API
    */
   getGridApi: () => GridApi | undefined;
};

/**
 * The props for the SSTable component.
 */
type SSDataTableActualProps<T> = {
   /**
    * An array of either column names, or custom column definitions for the table.
    */
   columns: string[] | ColumnDef[];
   /**
    * Set the data to be displayed as rows in the grid.
    * Note that setting this to null or undefined shows the loading indicator.
    */
   rowData?: AgGridReactProps<T>['rowData'];
   /**
    * Type of Row Selection:
    * - `none` - Rows can't be selected
    * - `single`- A single row can be selected
    * - `multiple`- Multiple rows can be selected
    * - `checkbox` - Multiple rows can be selected with checkboxes
    * @default 'none'
    */
   rowSelectMode?: 'none' | 'single' | 'multiple' | 'checkbox';
   /**
    * A custom message to show when there is no data for the table.
    * @default 'No Rows to Show'
    */
   emptyMessage?: string;
   /**
    * A custom message to show when the table is loading. To have no message at all, set this to null.
    * @default 'Loading...'
    */
   loadingMessage?: string | null;
   /**
    * Width of the table in CSS units.
    * @default '100%'
    */
   width?: string;

   /**
    * Height of the table in CSS units.
    * @default 'auto'
    */
   height?: string;

   /**
    * The current column that is being sorted on.
    * Null if the table data is unsorted.
    * @default null
    */
   sortCol?: string | null;
   /**
    * The current sort direction that is being applied to the sorted column.
    * Null if the table data is unsorted.
    * @default null
    */
   sortDir?: 'asc' | 'desc' | null;

   /**
    * An event listener for clicking on the data triggered by the table.
    *
    * @param data The payload of the click
    */
   onClick?: (data: ClickEventPayload<T>) => void;
   /**
    * An event listener for the sort event triggered by the table.
    *
    * @param data The payload of the sort event
    */
   onSort?: (data: SortEventPayload) => void;
   /**
    * An event listener for the selection change triggered by the table.
    *
    * @param data The payload of the selection change
    */
   onChange?: (data: T[] | undefined, eventSource: SelectionEventSourceType) => void;
   /**
    * selectedRows the payload of row ids selected
    */
   selectedRows?: number[] | 'all';
   /**
    * rowIdKey can be used to set the id to a field within your data. This field must be unique.
    */
   rowIdKey?: keyof T | undefined;
   /**
    * A map of rules to apply custom CSS classes to rows in the table.
    *
    * Commonly used to set a 'disabled' class which already has styles set up for.
    * @example { 'disabled': ({data}) => (data?.enabled !== 1) }
    */
   rowClassRules?: RowClassRules;
   /**
    * Enable row dragging for the table. This will add a drag handle to the first column of the table.
    * Note that you will need to implement the onRowDrag event to handle the reordering of the data.
    * @default false
    */
   rowDrag?: boolean;
   /**
    * Callback to handle when rows have been dragged.
    *
    * @param newRows The list of rows in the new order.
    */
   onRowDrag?: (newRows: T[]) => void;
   /**
    * Indicates whether the table is in a loading state. This will show a loading overlay on the table and disable interactions.
    * @default false
    */
   isLoading?: boolean;
   /**
    * Indicate whether the row dragging callback should be debounced. Default debounce period of 700ms.
    */
   debounceRowDrag?: boolean;
   /**
    * Flag to indicate the table columns can be resized.
    */
   resizableCols?: boolean;
   /**
    * Table within the text can be selected for copying
    */
   selectText?: boolean;
};

export type SSDataTableProps<T> = Omit<BoxProps, keyof SSDataTableActualProps<T>> &
   SSDataTableActualProps<T>;
