import { type Field, type SelectTableHeaderArgs } from '../types';

import { removeAllChildren } from '../utils';

export type Columns = {
   key: string;
   title: string;
   onClick: (e: MouseEvent) => void;
}[];

/** Header table, with sorting functionality */
export default class SelectTableHeader {
   element: HTMLElement;
   private columnClassName = 'select-table-column-header';
   private toggleSort;
   private toggleSelectAll;
   private mode;

   constructor({
      columns,
      toggleSelectAll,
      toggleSort,
      mode,
   }: SelectTableHeaderArgs) {
      this.mode = mode;
      this.element = this.createElement();
      this.toggleSelectAll = toggleSelectAll;
      this.toggleSort = toggleSort;
      this.render(columns, false);
   }

   render(columns: Field[], isAllSelected: boolean) {
      removeAllChildren(this.element);

      if (this.mode === 'multi') {
         this.generateSelectAllCheckbox(isAllSelected);
      }
      this.generateColumns(columns);
   }

   private createElement() {
      const headerElement = document.createElement('div');
      headerElement.className = 'header';
      headerElement.setAttribute('role', 'none');
      headerElement.setAttribute('aria-label', 'select header');
      return headerElement;
   }

   private generateColumns(columns: Field[]) {
      for (const column of columns) {
         const { title, id, sort } = column;

         const columnHeader = document.createElement('div');
         columnHeader.setAttribute('role', 'columnheader');
         columnHeader.setAttribute('tabindex', '0');
         columnHeader.setAttribute('aria-label', `sort rows by ${title}`);
         columnHeader.className = 'header__title';
         columnHeader.textContent = title;

         switch (sort) {
            case 'asc':
               columnHeader.classList.add('header__title--sort-asc');
               columnHeader.classList.remove('header__title--sort-desc');
               break;
            case 'desc':
               columnHeader.classList.add('header__title--sort-desc');
               columnHeader.classList.remove('header__title--sort-asc');
               break;
            default:
               columnHeader.classList.remove('header__title--sort-desc');
               columnHeader.classList.remove('header__title--sort-asc');
               break;
         }

         columnHeader.addEventListener('click', () => {
            this.toggleSort(id);
         });
         columnHeader.addEventListener('keydown', (e) => {
            const { code } = e;
            if (code === 'Space' || code === 'Enter') {
               this.toggleSort(id);
            }
         });

         this.element.appendChild(columnHeader);
      }
   }

   private generateSelectAllCheckbox(isAllSelected: boolean) {
      const button = document.createElement('label');
      button.className = 'header__select-all';
      button.setAttribute('aria-label', 'select all rows');
      button.setAttribute('tabindex', '0');
      button.addEventListener('click', this.toggleSelectAll);
      button.addEventListener('keydown', (e) => {
         const { code } = e;
         if (code === 'Enter' || code === 'Space') {
            this.toggleSelectAll();
         }
      });

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = isAllSelected;
      checkbox.setAttribute('tabindex', '-1');

      button.appendChild(checkbox);

      this.element.append(button);
   }
}
