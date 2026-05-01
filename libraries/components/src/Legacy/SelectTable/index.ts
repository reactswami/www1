/*
 * All software Copyright 2021 of Techniche Technologies Pty Ltd., All rights reserved.
 * Any redistribution or reproduction of part or all of the contents in any form is
 * prohibited without express written permission of the company.
 */

import './style.less';
import SelectTableBody from './dom/body';
import FooterPagination from './dom/footer-pagination';
import FooterShowMore from './dom/footer-show-more';
import SelectTableHeader from './dom/header';
import MultiSelector from './selectors/multi';
import SingleSelector from './selectors/single';
import ViewOnlySelector from './selectors/view';
import {
   type CallBackArgs,
   type Counts,
   type Data,
   type Field,
   type ISelector,
   type ITableBody,
   type ITableFooter,
   type ITableHeader,
   type Options,
} from './types';
import { getNextRowNotDisabled, localSortFn, removeAllChildren } from './utils';

export type SelectTableArgs = {
   containerElement: HTMLElement;
   data: Omit<Data, 'id'>[];
   total: number;
   fields: Omit<Field, 'id'>[];
   options: Partial<Options>;
};

/**
 * SelectTable create a select table on in place of the container element.
 * The table can be in view mode only, single select or multi select.
 * This is the 'controller' that handles the creation of the header, footer and table as well as the selector.
 * It also handles the data and re-render the UI when needed.
 *
 * It is quite large and might be broken down into further component later down the track
 */
export default class SelectTable {
   private containerElement!: HTMLElement; // The DOM element in which the table will be rendered.
   private headerElement!: ITableHeader;
   private bodyElement!: ITableBody;
   private footerElement!: ITableFooter;
   private loaderElement!: HTMLElement;
   private total!: number; // Total number of table rows that could be loaded
   private fields: Field[] = []; // Array of table fields/columns
   private data: Data[] = []; // Array of data, one per row rows
   private isLoading = false;
   private isAllSelected = false;
   private currentPage = 1; // Used internallyfor pagination
   private options: Options = {
      onSortFn: (column, data, sort) => localSortFn(column, data, sort), // Sorting function. Use the local sort by default.
      fetchFn: () => {
         throw Error('No fetch function implemented');
      }, // Function to fetch more data
      onSelectFn: () => {
         // Do nothing
      }, // Function run when data is selected. Note: not throttle are applied, it is up to the user to set a throttle if required.
      onUpdateFn: () => {
         // Do nothing
      }, // Function run at each update
      onErrorFn: (error: string) => {
         throw Error(error);
      }, // Function run on error
      selectionMode: 'multi', // Selection mode: multi, single or view only.
      dataMode: 'append', // Data mode. Append: data will be appended to exsiting data. Pagination: data will replace the existing data.
      resultsPerPage: 1000, // Number of results per page, only used for pagination mode
   };
   private updateFn:
      | ((searchResult: Data[], searchTotal: number, fields?: Field[]) => void)
      | undefined;

   constructor(selectTableArgs: SelectTableArgs) {
      const { containerElement, data, total, fields, options } =
         selectTableArgs;
      this.validateConstructorArguments(selectTableArgs);
      this.initialiseClassMembers(
         containerElement,
         total,
         fields,
         data,
         options
      );
      this.initialiseDOM(containerElement);
      this.initialiseUpdate();
   }

   /**
    * Public method to get the currently selected data.
    */
   getSelected(): Data[] {
      return this.data.filter((item) => item.isSelected);
   }

   /**
    * Public method to clear the current selection
    */
   clearSelection() {
      this.setFocus(null);
      this.setSelected([]);
   }

   /**
    *  Public method to update manually the data from outside, for example to create a search functionality or change the columns
    */
   update(data: Data[], total: number, fields: Field[]) {
      if (!this.updateFn) {
         throw Error('UpdateFn hasn`t been provided.');
      }
      this.updateFn(data, total, fields);
   }

   private render({
      newData,
      newTotal,
      newFields,
      clearSelection,
   }: {
      newData?: Data[];
      newTotal?: number;
      newFields?: Field[];
      clearSelection?: boolean;
   } = {}) {
      if (
         newData &&
         newData.length > 0 &&
         newData[0].values.length !== this.fields.length
      ) {
         throw Error(
            `the data provided does not have the same length as the current fields (${this.fields})`
         );
      }
      const { data, total, fields } = this;
      this.setLoading(true);
      this.data = newData !== undefined ? newData : data;
      this.total = newTotal || total;
      this.fields = newFields || fields;

      if (clearSelection) {
         this.clearSelection();
      }

      this.data = this.data.map((data, index) => ({ ...data, id: index }));
      const isAllSelected = this.data.every((item) => item.isSelected);

      this.headerElement.render(fields, isAllSelected);
      this.bodyElement.render(this.data);
      this.footerElement.render({ data: this.data, total });

      this.setLoading(false);
      this.onUpdate();
   }

   private initialiseClassMembers(
      containerElement: HTMLElement,
      total: number,
      fields: Omit<Field, 'id'>[],
      data: Omit<Data, 'id'>[],
      options: Partial<Options>
   ) {
      this.containerElement = containerElement;
      this.total = total;
      this.initialiseFields(fields);
      this.initialiseData(data);
      this.initialiseOptions(options);
   }

   /**
    * Bind the update function
    */
   private initialiseUpdate() {
      this.updateFn = (
         searchResult: Data[],
         searchTotal: number,
         fields?: Field[]
      ) => {
         this.render.call(this, {
            newData: searchResult,
            newTotal: searchTotal,
            newFields: fields,
         });
      };
   }

   private initialiseOptions(options: Partial<Options>) {
      this.options = { ...this.options, ...options };
   }

   private initialiseData(data: Omit<Data, 'id'>[]) {
      this.data = data.map((item, index) => ({
         ...item,
         id: index,
         isDisabled: item.isDisabled ?? false,
         isFocused: false,
         isSelected: false,
      }));
   }

   private initialiseFields(fields: Omit<Field, 'id'>[]) {
      this.fields = fields.map((field, index) => ({
         ...field,
         id: index,
      }));
   }

   private validateConstructorArguments({ fields }: SelectTableArgs) {
      if (fields.length === 0) {
         throw Error('Error initialising SelectTable: Please provide fields.');
      }
   }

   private initialiseDOM(selectTableElement: HTMLElement) {
      removeAllChildren(selectTableElement);

      this.initialiseLoader(selectTableElement);

      this.initialDataSort();

      const selector = this.initialiseSelector();

      const { onKeyDown } = selector;

      this.addGlobalListeners({
         onKeyDown: onKeyDown.bind(selector),
      });

      this.initialiseHeader();
      this.initialiseBody(selector);
      this.initialiseFooter();

      selectTableElement.classList.add('select_table');
      selectTableElement.appendChild(this.headerElement.element);
      selectTableElement.appendChild(this.bodyElement.element);
      selectTableElement.appendChild(this.footerElement.element);

      this.setLoading(false);
   }

   private initialiseLoader(selectTableElement: HTMLElement) {
      this.loaderElement = this.createLoader();
      selectTableElement.appendChild(this.loaderElement);
      this.setLoading(true);
   }

   private initialiseFooter() {
      let footer;
      switch (this.options.dataMode) {
         case 'append':
            footer = new FooterShowMore({
               getCounts: () => this.getCounts(),
               fetchData: () => this.fetchData(),
            });
            break;
         case 'pagination':
            footer = new FooterPagination({
               getCounts: () => this.getCounts(),
               nextPage: () => this.nextPage(),
               previousPage: () => this.previousPage(),
            });
            break;
      }
      this.footerElement = footer;
   }

   private initialiseBody(selector: ISelector) {
      this.bodyElement = new SelectTableBody({
         mode: this.options.selectionMode,
         onMouseMove: selector.onMouseMove.bind(selector),
         onMouseDown: selector.onMouseDown.bind(selector),
         onFocus: (rowId: number) => this.setFocus(rowId),
         data: this.data,
      });
   }

   private initialiseHeader() {
      this.headerElement = new SelectTableHeader({
         mode: this.options.selectionMode,
         columns: this.fields,
         toggleSort: (fieldId: number) => this.toggleSort(fieldId),
         toggleSelectAll: () => {
            this.toggleSelectAll();
         },
      });
   }

   private initialiseSelector() {
      const buildSelectorArguments = (self: SelectTable) => ({
         getNextRowNotDisabled: ({
            direction,
            index,
         }: {
            direction: 'up' | 'down';
            index: number;
         }) => getNextRowNotDisabled({ data: self.data, direction, index }),
         selectRows: (rowIds: number[]) => self.setSelected(rowIds),
         getSelected: () => this.getSelected().map(({ id }) => id),
         setFocus: (rowId: number | null) => self.setFocus(rowId),
         getFocus: () =>
            self.data.find(({ isFocused }) => isFocused)?.id ?? null,
         getCounts: () => self.getCounts(),
      });

      let selector: ISelector;

      switch (this.options.selectionMode) {
         case 'multi':
            selector = new MultiSelector(buildSelectorArguments(this));
            break;
         case 'single':
            selector = new SingleSelector(buildSelectorArguments(this));
            break;
         case 'view':
            selector = new ViewOnlySelector(buildSelectorArguments(this));
            break;
      }

      return selector;
   }

   /**
    * Initial data sort. By default the data is sorted ascending on the first column, unless otherwise specified.
    */
   private initialDataSort() {
      const sort = this.fields.find((field) => field.sort);
      if (!sort) {
         this.fields[0].sort = 'asc';
         this.data.sort((a, b) => (a.values[0] > b.values[0] ? 1 : -1));
      } else {
         const sortField = sort.id;
         this.data.sort((a, b) =>
            a.values[sortField] > b.values[sortField] ? 1 : -1
         );
      }
      this.data = this.data.map((item, index) => ({ ...item, id: index }));
   }

   private nextPage() {
      this.fetchData(false);
   }

   private previousPage() {
      this.fetchData(true);
   }

   private async fetchData(isPreviousPage?: boolean) {
      if (this.isDisabled()) {
         return;
      }
      this.setLoading(true);
      const isPagination = this.options.dataMode === 'pagination';

      let start, end;

      if (isPagination) {
         const maxPage = Math.ceil(this.total / this.options.resultsPerPage);
         this.currentPage = isPreviousPage
            ? Math.max(1, this.currentPage - 1)
            : Math.min(this.currentPage + 1, maxPage);
         start = (this.currentPage - 1) * this.options.resultsPerPage;
         end = this.currentPage * this.options.resultsPerPage;
      } else {
         start = this.data.length;
         end = this.data.length + this.options.resultsPerPage;
      }

      const range = { start, end };

      const sortRow = this.fields.find((field) => field.sort) ?? null;
      const nextSort: 'asc' | 'desc' =
         sortRow && sortRow.sort === 'asc' ? 'desc' : 'asc';
      const sort = sortRow ? { field: sortRow, order: nextSort } : null;

      try {
         const data = await this.options.fetchFn({
            range,
            sort,
         });
         this.data =
            this.options.dataMode === 'append' ? this.data.concat(data) : data;
         this.render();
      } catch (e) {
         this.onError(e as string);
      }
      this.setLoading(false);
   }

   private getCounts(): Counts {
      return {
         total: this.total,
         visible: this.data.length,
         selected: this.data.filter((item) => item.isSelected).length,
         pages: {
            currentPage: this.currentPage,
            lastPage: Math.ceil(this.total / this.options.resultsPerPage),
         },
      };
   }

   private addGlobalListeners({
      onKeyDown,
   }: {
      onKeyDown: (e: KeyboardEvent, row: Data | null) => void;
   }) {
      document.body.addEventListener('keydown', (e) =>
         this.isDisabled() ? null : onKeyDown(e, null)
      );
   }

   private createLoader() {
      const loaderElement = document.createElement('div');
      loaderElement.className = 'loader';
      loaderElement.style.pointerEvents = 'none';
      loaderElement.style.opacity = '1';

      const img = document.createElement('img');
      img.src = '/img/throbber_big.gif';
      img.alt = 'loader';

      loaderElement.appendChild(img);

      return loaderElement;
   }

   private setLoading(isLoading: boolean): void {
      this.isLoading = isLoading;
      this.loaderElement.style.visibility = isLoading ? 'auto' : 'hidden';
      this.loaderElement.style.pointerEvents = isLoading ? 'none' : 'all';
   }

   private isDisabled() {
      return this.isLoading;
   }

   private setSelected(rowIds: number[]) {
      // Avoid rerender if the arrays are the same.
      const currentlySelected = this.data.filter(
         ({ isSelected }) => isSelected
      );

      if (
         currentlySelected.every(({ id }) => rowIds.includes(id)) &&
         rowIds.length === currentlySelected.length
      ) {
         return;
      }

      this.data = this.data.map((item) => {
         const isSelected = rowIds.includes(item.id);
         return { ...item, isSelected };
      });
      this.options.onSelectFn(this.getCallBackArgs());
      this.render();
   }

   private getCallBackArgs(): CallBackArgs {
      return {
         selected: this.getSelected(),
         data: this.data,
         fields: this.fields,
         isAllSelected: this.isAllSelected,
         currentPage: this.currentPage,
      };
   }

   private setFocus(rowId: number | null) {
      // Avoid re-rendering if not needed;
      const currentlyFocus = this.data.find(({ isFocused }) => isFocused);
      if (currentlyFocus && currentlyFocus.id === rowId) {
         return;
      }
      this.data = this.data.map((item) => ({
         ...item,
         isFocused: rowId === item.id && !item.isDisabled,
      }));
      this.render();
   }

   private toggleSelectAll() {
      if (this.isDisabled()) {
         return;
      }
      const shouldSelectAll = !this.data.every((item) => item.isSelected);
      const range = Array.from({ length: this.data.length }, (_, i) => i);

      if (shouldSelectAll) {
         this.isAllSelected = true;
         this.setSelected(range);
      } else {
         this.isAllSelected = false;
         this.setSelected([]);
      }
   }

   private async toggleSort(columnId: number) {
      // Note: I had to grab the column here from the state as I had issues with closures on the event listeners in the headers
      const column = this.fields.find((item) => item.id === columnId);
      if (!column) {
         // This should not happen, but in case of.
         throw new Error('Fail to find the column during sorting.');
      }
      const { sort, id } = column;
      const nextSort = sort === 'asc' ? 'desc' : 'asc';
      this.data = await this.options.onSortFn(column, this.data, nextSort);
      this.fields = this.fields.map((field) => ({
         ...field,
         sort: id === field.id ? nextSort : null,
      }));

      this.render();
   }

   // === LIFECYCLE METHODS ===

   private onError(error: string) {
      this.options.onErrorFn(error);
   }

   private onUpdate() {
      this.options.onUpdateFn(this.getCallBackArgs());
   }
}
