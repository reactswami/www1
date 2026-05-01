import { type Data, type ISelector, type SelectorConstructorArgs } from '../types';

export default class MultiSelector implements ISelector {
   private isMac: boolean;
   private dragStartIndex: null | number;
   private getCounts;
   private selectRows: (rowIds: number[]) => void;
   private getSelected: () => number[];
   private setFocus: (rowId: number | null) => void;
   private getFocus: () => number | null;
   private getNextRowNotDisabled;
   private shiftArrowAnchor: null | number = null;

   constructor({
      getNextRowNotDisabled,
      selectRows,
      getCounts,
      setFocus,
      getFocus,
      getSelected,
   }: SelectorConstructorArgs) {
      this.isMac = navigator.userAgent.indexOf('Mac OS X') !== -1;
      this.getCounts = getCounts;
      this.selectRows = selectRows;
      this.setFocus = setFocus;
      this.getFocus = getFocus;
      this.getSelected = getSelected;
      this.getNextRowNotDisabled = getNextRowNotDisabled;
      this.dragStartIndex = null;
   }

   // eslint-disable-next-line @typescript-eslint/no-unused-vars
   onKeyDown(e: KeyboardEvent, _: null | Data): void {
      const { shiftKey, code } = e;

      const tabKey = code === 'Tab';
      if (tabKey) {
         this.shiftArrowAnchor = null;
         return;
      }

      const rowId = this.getFocus();
      const isAnyElementFocused = rowId !== null;

      if (!isAnyElementFocused) {
         return;
      }

      if (!shiftKey) {
         this.shiftArrowAnchor = null;
      }

      if (shiftKey && this.shiftArrowAnchor === null) {
         this.shiftArrowAnchor = rowId;
      }

      // Specific actions if row or meta has focus
      this.handleKeyCode(e, rowId);
      this.handleShiftBehaviorOnKeydown();
   }

   onMouseMove(e: MouseEvent, row: Data): void {
      if (!e.buttons) {
         this.dragStartIndex = null;
         return;
      }
      const { id } = row;
      this.setFocus(id);

      if (this.dragStartIndex === null) {
         this.dragStartIndex = id;
      }
      const selectedRows = this.getSelectedRange(id, this.dragStartIndex);
      this.selectRows(selectedRows);
   }

   onMouseDown(e: MouseEvent, row: Data): void {
      const { id, isDisabled } = row;
      if (isDisabled) {
         return;
      }

      this.dragStartIndex = id;
      this.setFocus(id);

      const isShiftHeld = e.shiftKey;
      if (isShiftHeld) {
         this.handleShiftKeyOnMouseDown(id);
         return;
      }
      this.shiftArrowAnchor = null;

      const isCtrlHeld = this.isCtrlDown(e);
      const isClickingCheckbox =
         (e.target as HTMLInputElement).type === 'checkbox';

      if (isClickingCheckbox || isCtrlHeld) {
         this.handleMultiClick(id);
         return;
      }

      this.selectRows([id]);
      return;
   }

   private handleMultiClick(id: number) {
      const shouldSelect = !this.getSelected().includes(id);
      const selectedRows = shouldSelect
         ? this.getSelected().concat([id])
         : this.getSelected().filter((key) => key !== id);
      this.selectRows(selectedRows);
      return;
   }

   private handleShiftKeyOnMouseDown(id: number) {
      const start = this.shiftArrowAnchor ?? this.dragStartIndex;
      const range = this.getSelectedRange(start ?? 0, id);
      this.selectRows(range);
      return;
   }

   private toggleSelect(id: number, isCtrlHeld = true): void {
      const shouldSelect = !this.getSelected().includes(id);
      let selectedRows;

      if (isCtrlHeld) {
         selectedRows = shouldSelect
            ? this.getSelected().concat([id])
            : this.getSelected().filter((key) => key !== id);
      } else {
         selectedRows = shouldSelect ? [id] : [];
      }

      this.selectRows(selectedRows);
   }

   private isCtrlDown(e: MouseEvent | KeyboardEvent): boolean {
      return this.isMac ? e.metaKey : e.ctrlKey;
   }

   private getSelectedRange(index1: number, index2: number): number[] {
      const { visible } = this.getCounts();
      const [min, max] = [index1, index2].sort((a, b) => (a < b ? -1 : 1));
      const [start, finish] = [Math.max(0, min), Math.min(visible ?? max, max)];
      const range = Array.from(
         { length: finish + 1 - start },
         (_, i) => i + start
      );
      return range;
   }

   private handleShiftBehaviorOnKeydown(): void {
      if (this.shiftArrowAnchor === null) {
         return;
      }
      if (this.shiftArrowAnchor === this.getFocus()) {
         return;
      }

      const range = this.getSelectedRange(
         this.shiftArrowAnchor,
         this.getFocus() as number
      );
      this.selectRows(range);
   }

   private toggleSelectAll(): void {
      const { total } = this.getCounts();
      const shouldSelectAll = this.getSelected().length < total;
      const selectedRows = shouldSelectAll
         ? this.getSelectedRange(0, total)
         : [];
      this.selectRows(selectedRows);
   }

   private handleKeyCode(e: KeyboardEvent, rowId: number) {
      switch (e.code) {
         case 'KeyA':
            if (!this.isCtrlDown(e)) {
               return;
            }
            e.preventDefault();
            this.toggleSelectAll();
            break;
         case 'Space':
            e.preventDefault();
            this.toggleSelect(rowId as number, true);
            break;
         case 'ArrowUp':
            this.handleNavigation({
               e,
               navigateToIndex: (rowId as number) - 1,
               direction: 'up',
            });
            break;
         case 'ArrowDown':
            this.handleNavigation({
               e,
               navigateToIndex: (rowId as number) + 1,
               direction: 'down',
            });
            break;
         case 'Home':
            this.handleNavigation({
               e,
               navigateToIndex: 0,
               direction: 'up',
            });
            break;
         case 'End':
            this.handleNavigation({
               e,
               navigateToIndex: -1,
               direction: 'up',
            });
            break;
      }
   }

   private handleNavigation({
      e,
      direction,
      navigateToIndex,
   }: {
      e: KeyboardEvent;
      direction: 'up' | 'down';
      navigateToIndex: number;
   }) {
      e.preventDefault();
      const { id } =
         this.getNextRowNotDisabled({
            direction,
            index: navigateToIndex,
         }) || {};

      if (id === undefined) {
         return;
      }

      this.setFocus(id);
      return;
   }
}
