import { type ButtonProps } from "@chakra-ui/react";
import { type SSDataTableProps } from "@statseeker/components/Legacy/SSDataTable";
import { type LinkProps } from "@tanstack/react-router";

export type AdminManageListButtonDef = {
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
};


export interface AdminManageListPageProps<DatatableType> {
   /**
    * The textual description of the DatatableType. Used in no results message.
    */
   dataLabel: string;
   /**
    * The tanstack/react-router Route that this component is loaded under.
    * Used for default navigation behaviour.
    */
   routeId: string;
   /**
    * The tanstack/react-router base route that this component navigates to for editing an item.
    */
   toRoute?: string;
   /**
    * A list of action buttons for the list. Typically Add, Delete, Copy.
    */
   buttonDefs: AdminManageListButtonDef[];
   /**
    * The data to populate the list with.
    */
   data: DatatableType[];
   /**
    * The total number of data entries for the list which may exceed the currently shown data.
    */
   dataTotal: number;
   /**
    * Was the data query for the list successful? Used to distinguish between 0 results and failed query.
    */
   success: boolean;
   /**
    * A list of props for the list SSDataTable.
    * @default {
    *    height: '100%',
    *    rowData: data,
    *    rowSelectMode: 'checkbox',
    *    selectedRows: selectedIds, // From route search
    *    emptyMessage: generateEmptyMessage(),
    *    rowIdKey: 'id',
    *    sortCol: sort, // From route search
    *    sortDir: dir, // From route search
    *    onSort: onSort, // Update route search
    * }
    */
   datatableProps: SSDataTableProps<DatatableType>;
   /**
    * An optional list of filter functions that can be applied to the list.
    */
   filterActions?: {
      [index: string]: () => void;
   };
   /**
    * The active filter that is currently applied to the list.
    *
    * Needs to be one of the `filterActions` keys.
    */
   activeFilter?: string;
   /**
    * Optional width for the list.
    * @default 400
    */
   listWidth?: number;
   /**
    * An optional list of non-index pathname fragments to match for Routes that don't have the selectedIds search parameter.
    * When all list items are deselected navigation to index will occur unless one of these strings is matched.
    * @default ['/copy', '/add']
    */
   noSelectedIdsPaths?: string[];
   /**
    * Indicates whether the left tab is disabled.
    */
   isLoading?: boolean;
   /**
    * Indicates whether text search is supported for the list. If false, the search bar will not be rendered.
    */
   textSearchSupported?: boolean;
};
