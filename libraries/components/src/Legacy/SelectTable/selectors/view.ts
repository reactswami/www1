import { type Data, type ISelector, type SelectorConstructorArgs } from '../types';

export default class ViewOnlySelector implements ISelector {
   private setFocus: (rowId: number | null) => void;
   private getFocus: () => number | null;
   private getNextRowNotDisabled: ({
      direction,
      index,
   }: {
      direction: 'up' | 'down';
      index: number;
   }) => Data | undefined;

   constructor({
      setFocus,
      getNextRowNotDisabled,
      getFocus,
   }: SelectorConstructorArgs) {
      this.setFocus = setFocus;
      this.getNextRowNotDisabled = getNextRowNotDisabled;
      this.getFocus = getFocus;
   }

   onMouseDown(e: MouseEvent, row: Data) {
      this.setFocus(row.id);
   }

   onMouseMove() {
      // Do nothing
   }

   onKeyDown(e: KeyboardEvent, row: null | Data) {
      const id = this.getFocus() || row?.id;
      if (!id) {
         throw Error('Error getting the focused row id (in view mode).');
      }
      this.handleKeyCode(e, id);
   }

   private handleKeyCode(e: KeyboardEvent, rowId: number) {
      switch (e.code) {
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
