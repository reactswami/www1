import { type FilterFn, type Row } from '@tanstack/react-table';

/*
* Attempt to create regexp search with the search value provided.
* If the value is not a valid regexp expression, default to 'includes text' mode.
*/
export const regexpSearch = (searchValue: string, stringToSearch: string) => {
   try {
      const regexp = new RegExp(searchValue, 'ig');
      return regexp.test(stringToSearch);
   } catch (e) {
      return stringToSearch.toLowerCase().includes(searchValue.toLowerCase());
   }
};

/*
 * Table filter function that can be used within the column defs to make it 'regexpable'
 */
export const regexpFilterFn: FilterFn<any> = <T>(
   row: Row<T>,
   columnId: string,
   filterValue: string
) => {
   return regexpSearch(filterValue, row.getValue(columnId) as string);
};
