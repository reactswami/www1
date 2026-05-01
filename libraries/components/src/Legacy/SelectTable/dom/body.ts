import { type Data, type SelectTableBodyArgs } from '../types';

import { removeAllChildren } from '../utils';

type Row = {
   key: string;
   element: HTMLElement;
   isSelected: boolean;
   isDisabled: boolean;
   isFocused: boolean;
};

/**
 *  The body of the select table, i.e. the rows.
 */
export default class SelectTableBody {
   element;
   private rows!: Row[];
   private onMouseDown;
   private onMouseMove;
   private onFocus;
   private mode;

   constructor({
      data,
      onMouseDown,
      onMouseMove,
      onFocus,
      mode,
   }: SelectTableBodyArgs) {
      this.element = this.createElement();
      this.onMouseDown = onMouseDown;
      this.onMouseMove = onMouseMove;
      this.onFocus = onFocus;
      this.mode = mode;
      this.render(data);
   }

   render(data: Data[]) {
      const scrollY = this.element.scrollTop;
      removeAllChildren(this.element);

      this.rows = this.createRows(data);
      this.rows.map((row) => this.element.append(row.element));
      this.element.scrollTop = scrollY;
      this.rows.find(({ isFocused }) => isFocused)?.element?.focus();
   }

   private createElement() {
      const bodyElement = document.createElement('div');
      bodyElement.className = 'body';
      bodyElement.setAttribute('role', 'table');
      bodyElement.setAttribute('aria-label', 'select body');

      return bodyElement;
   }

   private createRows(data: Data[]): Row[] {
      const rows: Row[] = [];

      for (const rowData of data) {
         const { key, isFocused, isSelected, isDisabled } = rowData;

         const checkbox =
            this.mode === 'multi'
               ? this.createCheckbox(key, isDisabled, isSelected)
               : null;
         const row = this.createRow(rowData, checkbox);

         row.addEventListener('focus', () => {
            this.onFocus(rowData.id);
         });
         row.addEventListener('mousemove', (e) => {
            this.onMouseMove(e, rowData);
         });
         row.addEventListener(
            'mousedown',
            (e) => {
               this.onMouseDown(e, rowData);
            },
            true
         );
         rows.push({
            key: rowData.key,
            element: row,
            isDisabled,
            isSelected,
            isFocused,
         });
      }

      return rows;
   }

   private createCheckbox(
      key: string,
      isDisabled: boolean,
      isChecked: boolean
   ) {
      const label = document.createElement('label');
      label.setAttribute('for', `select-${key}`);
      label.className = 'row__select';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = `select-${key}`;
      checkbox.setAttribute('tabIndex', '-1');
      checkbox.setAttribute('aria-label', 'select row');
      checkbox.onclick = (e) => e.preventDefault();
      checkbox.checked = isChecked;
      checkbox.disabled = isDisabled;

      label.append(checkbox);

      return label;
   }

   private createRow(rowData: Data, checkbox: HTMLLabelElement | null) {
      const { isSelected, isFocused } = rowData;
      const row = document.createElement('div');
      row.setAttribute('tabIndex', '0');
      row.setAttribute('role', 'row');

      row.classList.add('row');

      isSelected // eslint-disable-line @typescript-eslint/no-unused-expressions
         ? row.classList.add('row--selected')
         : row.classList.remove('row--selected');

      isFocused // eslint-disable-line @typescript-eslint/no-unused-expressions
         ? row.classList.add('row--focused')
         : row.classList.remove('row--focused');

      const hasClasses = rowData.classes && rowData.classes?.length > 0;
      if (hasClasses) {
         row.classList.add(...(rowData.classes as string[]));
      }

      if (checkbox) {
         row.appendChild(checkbox);
      }

      for (const value of rowData.values) {
         const cell = document.createElement('span');
         cell.setAttribute('role', 'cell');
         cell.className = 'row__cell';
         cell.textContent = value;
         cell.title = value;
         row.appendChild(cell);
      }

      return row;
   }
}
