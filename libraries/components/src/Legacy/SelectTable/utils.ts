import { type Data, type Field } from './types';

export function removeAllChildren(element: HTMLElement) {
   while (element.firstChild) {
      element.firstChild.remove();
   }
}

export function getNextRowNotDisabled({
   direction,
   index,
   data,
}: {
   direction: 'up' | 'down';
   index: number;
   data: Data[];
}): Data | undefined {
   const dataToSearch =
      direction === 'down'
         ? data.slice(index)
         : data.slice(undefined, index + 1).reverse();
   return dataToSearch.find((item) => !item.isDisabled);
}

// Default local sort function
export const localSortFn = (
   column: NonNullable<Field>,
   currentData: Data[],
   nextSort: 'asc' | 'desc'
): Promise<Data[]> => {
   const { id } = column;

   return new Promise((res) =>
      res(
         currentData.sort((a, b) => {
            if (nextSort === 'desc') {
               return a.values[id] > b.values[id] ? -1 : 1;
            } else {
               return a.values[id] > b.values[id] ? 1 : -1;
            }
         })
      )
   );
};
