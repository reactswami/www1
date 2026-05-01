import { type IpRangeRuleWithNulls } from "./NetworkRangesBuilder";


export type RangeReducerAction = (
   (
      { type: 'ADD' } |
      { type: 'REMOVE'; index: number } |
      { type: 'UPDATE'; index: number; value: string | null }
   ) &
   { list: 'include' | 'exclude' } |

   { type: 'REPLACE'; value: IpRangeRuleWithNulls }
);


export function rangeReducer(currentRange: IpRangeRuleWithNulls, action: RangeReducerAction) {
   let newRange: IpRangeRuleWithNulls = {
      include: [],
      exclude: [],
   };
   let list: (string | null)[] = [];

   if (action.type !== 'REPLACE') {
      newRange = {
         include: [...currentRange.include],
         exclude: [...currentRange.exclude],
      };
      list = newRange[action.list];
   }

   switch (action.type) {
      case 'ADD': {
         // Because we always render one input, an add action on an empty list should
         // actually add a second element, not a first
         if (list.length === 0) {
            list.push('');
         }
         list.push('');
         break;
      }

      case 'REMOVE': {
         /*
          * As an optimization don't actually remove values, just null them out.
          * This way list indexes don't change, saving rerenders.
          */
         let delValue = null;
         // Don't delete (null) if this is the last value, just empty it
         if (list.filter((v) => v !== null).length === 1) {
            delValue = '';
         }
         list[action.index] = delValue;
         break;
      }

      case 'UPDATE': {
         // We allow calling update on an empty list because we always render at least one input
         if (action.index === list.length) {
            list.push(null);
         }
         list[action.index] = action.value;
         break;
      }

      case 'REPLACE': {
         newRange = {
            include: [...action.value.include],
            exclude: [...action.value.exclude],
         };
         break;
      }
   }

   return newRange;
}