// Imports
import { type ColDef as AgGridColDef, type ITooltipParams } from 'ag-grid-community';
import { type CustomCellRendererProps } from 'ag-grid-react';
import defaultCellRenderer from './defaultCellRenderer';
import { type DefaultCellRendererProps, type ColumnDef } from './types';

/**
 * Generates a set of Ag Grid Column Definitions based on the columns prop provided to SSDataTable.
 * Note that this also adds an extra checkbox column to the start of the row if running in checkbox selection mode.
 * @param TBD TBD
 * @returns TBD
 */
export const generateColumnDefs = ({
   columns,
   hasCheckBox = false,
   sortCol,
   sortDir,
   resizableCols
}: {
   columns?: string[] | ColumnDef[];
   hasCheckBox?: boolean;
   sortCol: string | null;
   sortDir: 'asc' | 'desc' | null;
   resizableCols: boolean;
}) => {
   let fields: AgGridColDef[] | undefined = [];
   let colTypeDefault = true;
   if (columns && typeof columns[0] === 'string') {
      const cols = columns as string[];
      fields = cols?.map((col) => ({ field: col }));
   } else {
      const cols = columns as ColumnDef[];
      fields = cols.map((col) => {
         let coldef: AgGridColDef = {
            field: col.field,
         };
         // Apply column sizing
         let colSize = col.columnSize;
         if (colSize === undefined) {
            colSize = 'md';
         }
         switch (colSize) {
            case 'sm':
               coldef.flex = 0.66;
               coldef.minWidth = 100;
               break;
            case 'md':
               coldef.flex = 1;
               coldef.minWidth = 150;
               break;
            case 'lg':
               coldef.flex = 1.33;
               coldef.minWidth = 200;
         }
         if (col.flex !== undefined) {
            coldef.flex = col.flex;
         }
         if (col.minWidth !== undefined) {
            coldef.minWidth = col.minWidth;
         }
         if (col.maxWidth !== undefined) {
            coldef.maxWidth = col.maxWidth;
         }
         if (col.headerName !== undefined) {
            coldef.headerName = col.headerName;
         }

         if (col?.cellRenderer) {
            const cellRenderer = col.cellRenderer as DefaultCellRendererProps[];
            if (Array.isArray(cellRenderer)) {
               coldef.cellRenderer = (props: CustomCellRendererProps) => {
                  const {
                     data: { id },
                  } = props;
                  return defaultCellRenderer(cellRenderer, id);
               };
            } else {
               coldef.cellRenderer = cellRenderer;
            }
         }

         if (col.showTooltip === true) {
            coldef.tooltipValueGetter = ({ value }: ITooltipParams) => value;
         }

         if (col.valueFormatter !== undefined) {
            coldef.valueFormatter = col.valueFormatter;
         }

         if (col.tooltipValueGetter !== undefined) {
            coldef.tooltipValueGetter = col.tooltipValueGetter;
         }

         return coldef;
      });
      colTypeDefault = false;
   }

   let fieldsLen = fields?.length ?? 0;

   const defaultColumnConfig: AgGridColDef = {
      suppressMovable: true,
      resizable: resizableCols,
      sortable: false,
      headerComponentParams: {
         sortCol,
         sortDir,
      },
      tooltipValueGetter: () => null,
      headerComponent: 'agColumnHeader',
   };
   const checkBoxConfig: Partial<AgGridColDef> = {
      headerCheckboxSelection: true,
      checkboxSelection: true,
   };

   const columnDefs = fields?.map((field: AgGridColDef) => {
      let fieldConfig;

      if (!colTypeDefault) {
         if (fields?.length == fieldsLen && hasCheckBox) {
            fieldConfig = { ...defaultColumnConfig, ...field, ...checkBoxConfig };
         } else {
            fieldConfig = { ...defaultColumnConfig, ...field };
         }
      } else {
         // First column to have the checkbox
         if (fields?.length == fieldsLen && hasCheckBox) {
            fieldConfig = {
               ...defaultColumnConfig,
               ...field,
               ...checkBoxConfig,
            };
         } else {
            fieldConfig = { ...defaultColumnConfig, ...field };
         }
      }
      fieldConfig.headerComponentParams = {
         sortCol,
         sortDir,
      };
      fieldsLen--;
      return fieldConfig;
   });
   return columnDefs;
};
